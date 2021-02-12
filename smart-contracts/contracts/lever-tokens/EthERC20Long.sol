// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Callee.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "../interfaces/ICEth.sol";
import "../interfaces/ICErc20.sol";
import "../interfaces/ICompPriceOracle.sol";
import "../interfaces/IComptroller.sol";
import "../interfaces/IWETH.sol";


contract EthERC20Long is ERC20, IUniswapV2Callee {
    using SafeMath for uint256;
    uint256 public constant SCALE = 1000000;

    ICompPriceOracle public immutable priceOracle;
    IUniswapV2Pair public immutable tokenPair;
    ICEth public immutable collateralCToken;
    ICErc20 public immutable debtCToken;
    uint256 public immutable targetRatio;
    IWETH public immutable weth;

    bool internal _currentlySwapping;

    event Rebalance(bool positive, uint256 fromRatio, uint256 toRatio);
    event Equity(uint256 positiveEquity, uint256 negativeEquity);

    constructor(
        string memory name_,
        string memory symbol_,
        ICompPriceOracle priceOracle_,
        IUniswapV2Pair tokenPair_,
        ICEth cETH,
        ICErc20 debtCToken_,
        uint256 targetRatio_,
        IWETH weth_
    )
        ERC20(name_, symbol_)
    {
        priceOracle = priceOracle_;
        tokenPair = tokenPair_;
        collateralCToken = cETH;
        debtCToken = debtCToken_;
        targetRatio = targetRatio_;
        weth = weth_;

        IComptroller troll = IComptroller(debtCToken_.comptroller());
        address[] memory markets = new address[](2);
        markets[0] = address(cETH);
        markets[1] = address(debtCToken_);
        troll.enterMarkets(markets);
    }

    receive() external payable {
        require(
            msg.sender == address(weth) ||
            msg.sender == address(collateralCToken),
            "Lever Token: Unauthorized sender"
        );
    }

    function mint() external payable {
        uint256 totalSupply_ = totalSupply();
        if (totalSupply_ == 0) {
            _mint(msg.sender, msg.value);
        } else {
            (uint256 positiveEquity,) = getEquity();
            uint256 portion = totalSupply_.mul(msg.value).div(positiveEquity);
            _mint(msg.sender, portion);
        }

        collateralCToken.mint{ value: msg.value }();

        rebalance();
    }

    function rebalance() public {
        (uint256 debtUsd, uint256 collatUsd) = getCurrentCollatRatio();
        uint256 currentRatio = debtUsd.mul(SCALE).div(collatUsd);

        if (currentRatio == targetRatio) {
            return;
        }

        bool positiveRebalance = currentRatio < targetRatio;
        _currentlySwapping = true;

        if (positiveRebalance) {
            // p = (r * v - d) / (1 - r)
            uint256 rebalanceValueUsd =
                targetRatio.mul(collatUsd).sub(debtUsd.mul(SCALE)).div(
                    SCALE.sub(targetRatio)
                );
            uint256 ethBorrow = rebalanceValueUsd.div(getEthPrice());
            tokenPair.swap(0, ethBorrow, address(this), new bytes(1));
        } else {
            uint256 rebalanceValueUsd =
                debtUsd.mul(SCALE).sub(targetRatio.mul(collatUsd)).div(
                    SCALE.sub(targetRatio)
                );
            uint256 daiBorrow = rebalanceValueUsd.div(getDaiPrice());
            tokenPair.swap(daiBorrow, 0, address(this), new bytes(1));
        }

        (uint256 newDebt, uint256 newCollat) = getCurrentCollatRatio();

        uint256 newRatio;
        if (newDebt == 0 && newCollat == 0) {
            newRatio = 0;
        } else {
            newRatio = newDebt.mul(SCALE).div(newCollat);
        }

        emit Rebalance(
            positiveRebalance,
            currentRatio,
            newRatio
        );
    }

    function uniswapV2Call(
        address sender,
        uint256 amount0,
        uint256 amount1,
        bytes calldata
    ) external override {
        require(msg.sender == address(tokenPair), "Lever Token: unauthorized call");
        require(sender == address(this), "Lever Token: Invalid sender");
        require(_currentlySwapping, "Lever Token: unauthorized call");
        require((amount0 == 0) != (amount1 == 0), "Lever Token: Invalid swap");

        if (amount0 == 0) { // positive rebalance
            weth.withdraw(amount1); // has to unwrap incoming eth
            collateralCToken.mint{ value: amount1 }();
            (uint112 reserve0, uint112 reserve1,) = tokenPair.getReserves();
            uint256 x = uint256(reserve0);
            uint256 y = uint256(reserve1);
            uint256 borrowAmount = x.mul(amount1).mul(1000).div(y.sub(amount1).mul(997)).add(1);
            require(debtCToken.borrow(borrowAmount) == 0, "Lever Token: borrow error");
            IERC20(debtCToken.underlying()).transfer(address(tokenPair), borrowAmount);
        } else { // negative rebalanc()
            debtCToken.repayBorrow(amount0);
            (uint112 reserve0, uint112 reserve1,) = tokenPair.getReserves();
            uint256 x = uint256(reserve0);
            uint256 y = uint256(reserve1);
            uint256 redeemAmount = y.mul(amount0).mul(1000).div(x.sub(amount0).mul(997)).add(1);
            require(
                collateralCToken.redeemUnderlying(redeemAmount) == 0,
                "Lever token: redeem error"
            );
            weth.deposit{ value: redeemAmount }();
            weth.transfer(address(tokenPair), redeemAmount);
        }

        _currentlySwapping = false;
    }

    function redeem(uint256 amount) external {
        _redeemTo(msg.sender, amount);
    }

    function redeemTo(address payable recipient, uint256 amount) external {
        _redeemTo(recipient, amount);
    }

    function getEquity() public returns(uint256, uint256) {
        uint256 value = getUnderlyingCollateral();
        uint256 debt = getUnderlyingDebt();

        uint256 debtAsEth = debt.mul(getDaiPrice()).div(getEthPrice());

        if (value > debtAsEth) return (value - debtAsEth, 0);
        else return (0, debtAsEth - value);
    }

    function getCurrentCollatRatio() public returns(uint256, uint256) {
        uint256 debtDai = getUnderlyingDebt();
        uint256 debtUsd = debtDai.mul(getDaiPrice());

        uint256 valueEth = getUnderlyingCollateral();
        uint256 collatUsd = valueEth.mul(getEthPrice());

        return (debtUsd, collatUsd);
    }

    function getUnderlyingDebt() public returns(uint256) {
        return debtCToken.borrowBalanceCurrent(address(this));
    }

    function getUnderlyingCollateral() public returns(uint256) {
        return collateralCToken.balanceOfUnderlying(address(this));
    }

    function getDaiPrice() public view returns(uint256) {
        return priceOracle.getUnderlyingPrice(debtCToken);
    }

    function getEthPrice() public view returns(uint256) {
        return priceOracle.getUnderlyingPrice(collateralCToken);
    }

    function _redeemTo(address payable recipient, uint256 amount) internal {
        require(amount > 0, "Lever Token: Can't redeem nothing");
        require(amount >= balanceOf(msg.sender), "Lever Token: Insufficient balance");

        rebalance();

        uint256 debtDai = getUnderlyingDebt();
        uint256 debtShare = debtDai.mul(amount).div(totalSupply());

        _currentlySwapping = true;
        tokenPair.swap(debtShare, 0, address(this), new bytes(1));

        (uint256 positiveEthEquity,) = getEquity();
        require(positiveEthEquity > 0, "Lever Token: No equity");

        uint256 equityShare = positiveEthEquity.mul(amount).div(totalSupply());
        require(
            collateralCToken.redeemUnderlying(equityShare) == 0,
            "Lever token: redeem comp error"
        );

        _burn(msg.sender, amount);
        recipient.transfer(equityShare);
    }
}
