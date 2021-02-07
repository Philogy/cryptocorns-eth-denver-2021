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


contract EthDaiLong is ERC20, IUniswapV2Callee {
    using SafeMath for uint256;

    ICEth public constant collateralCToken = ICEth(0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5);
    ICErc20 public constant debtCToken = ICErc20(0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643); //dai
    ICompPriceOracle public immutable priceOracle;
    IUniswapV2Pair public immutable tokenPair;

    IWETH public constant WETH = IWETH(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);

    uint256 public constant SCALE        = 1000000;
    uint256 public constant TARGET_RATIO = 668672;

    bool internal _currentlySwapping;

    event Rebalance(bool positive, uint256 fromRatio, uint256 toRatio);
    event Error(uint256 errorCode);

    constructor(address priceOracle_, address pair_)
        ERC20("ETH/DAI leveraged long 3x", "longETH")
    {
        priceOracle = ICompPriceOracle(priceOracle_);
        tokenPair = IUniswapV2Pair(pair_);

        IComptroller troll = IComptroller(collateralCToken.comptroller());
        address[] memory markets = new address[](2);
        markets[0] = address(collateralCToken);
        markets[1] = address(debtCToken);
        troll.enterMarkets(markets);
    }

    receive() external payable {
        require(msg.sender == address(WETH), "");
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

        if (currentRatio > TARGET_RATIO) {
            emit Rebalance(false, 0, 0);
        } else if (currentRatio < TARGET_RATIO) {
            // p = (r * v - d) / (1 - r)
            uint256 rebalanceValueUsd =
                TARGET_RATIO.mul(collatUsd).sub(debtUsd.mul(SCALE)).div(
                    SCALE.sub(TARGET_RATIO)
                );

            uint256 ethBorrow = rebalanceValueUsd.div(getEthPrice());
            _currentlySwapping = true;

            // TODO: generalize amount0 / amount1 selection
            tokenPair.swap(0, ethBorrow, address(this), new bytes(1));

            (uint256 newDebt, uint256 newCollat) = getCurrentCollatRatio();
            emit Rebalance(
                true,
                currentRatio,
                newDebt.mul(SCALE).div(newCollat)
            );
        }
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
            WETH.withdraw(amount1); // has to unwrap incoming eth
            collateralCToken.mint{ value: amount1 }();

            (uint112 reserve0, uint112 reserve1,) = tokenPair.getReserves();
            uint256 x = uint256(reserve0);
            uint256 y = uint256(reserve1);

            uint256 borrowAmount = x.mul(amount1).mul(1000).div(y.sub(amount1).mul(997)).add(1);
            require(debtCToken.borrow(borrowAmount) == 0, "Lever Token: borrow error");
            IERC20(debtCToken.underlying()).transfer(address(tokenPair), borrowAmount);
        } else { // negative rebalanc()
            revert("Wrong rebalance");
        }

        _currentlySwapping = false;
    }

    function getEquity() public returns(uint256, uint256) {
        uint256 value = collateralCToken.balanceOfUnderlying(address(this));
        uint256 debt = debtCToken.borrowBalanceCurrent(address(this));

        uint256 debtAsEth = debt.mul(getDaiPrice()).div(getEthPrice());

        if (value > debtAsEth) return (value - debtAsEth, 0);
        else return (0, debtAsEth - value);
    }

    function getCurrentCollatRatio() public returns(uint256, uint256) {
        uint256 debtDai = debtCToken.borrowBalanceCurrent(address(this));
        uint256 debtUsd = debtDai.mul(getDaiPrice());

        uint256 valueEth = collateralCToken.balanceOfUnderlying(address(this));
        uint256 collatUsd = valueEth.mul(getEthPrice());

        return (debtUsd, collatUsd);
    }

    function getDaiPrice() public view returns(uint256) {
        return priceOracle.price("DAI");
    }

    function getEthPrice() public view returns(uint256) {
        return priceOracle.price("ETH");
    }
}
