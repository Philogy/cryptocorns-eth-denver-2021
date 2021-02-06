// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "../interfaces/ICEth.sol";
import "../interfaces/ICErc20.sol";
import "../interfaces/ICompPriceOracle.sol";
import "../interfaces/IComptroller.sol";

contract EthDaiLong is ERC20 {
    using SafeMath for uint256;

    ICEth public constant collateralCToken = ICEth(0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5);
    ICErc20 public constant debtCToken = ICErc20(0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643); //dai
    ICompPriceOracle public immutable priceOracle;

    uint256 public constant SCALE        = 1000000;
    uint256 public constant TARGET_RATIO = 666667;

    event PositiveRebalance();
    event NegativeRebalance();

    event Error(uint256 errorCode);

    constructor(address priceOracle_)
        ERC20("ETH/DAI leveraged long 3x", "longETH")
    {
        priceOracle = ICompPriceOracle(priceOracle_);

        IComptroller troll = IComptroller(collateralCToken.comptroller());
        address[] memory markets = new address[](2);
        markets[0] = address(collateralCToken);
        markets[1] = address(debtCToken);
        troll.enterMarkets(markets);
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
        uint256 valueEth = collateralCToken.balanceOfUnderlying(address(this));
        uint256 debtDai = debtCToken.borrowBalanceCurrent(address(this));

        uint256 valueUsd = valueEth.mul(getEthPrice());
        uint256 debtUsd = debtDai.mul(getDaiPrice());

        uint256 currentRatio = debtUsd.mul(SCALE).div(valueUsd);

        if (currentRatio > TARGET_RATIO) {
            emit NegativeRebalance();
        } else if (currentRatio < TARGET_RATIO) {
            emit PositiveRebalance();
        }
    }

    function getEquity() public returns(uint256, uint256) {
        uint256 value = collateralCToken.balanceOfUnderlying(address(this));
        uint256 debt = debtCToken.borrowBalanceCurrent(address(this));

        uint256 debtAsEth = debt.mul(getDaiPrice()).div(getEthPrice());

        if (value > debtAsEth) return (value - debtAsEth, 0);
        else return (0, debtAsEth - value);
    }

    function getDaiPrice() public view returns(uint256) {
        return priceOracle.price("DAI");
    }

    function getEthPrice() public view returns(uint256) {
        return priceOracle.price("ETH");
    }

    // TODO: Remove this method
    function doBorrow(uint256 amount) external {
        uint256 error = debtCToken.borrow(amount);

        if (error != 0) emit Error(error);
    }
}
