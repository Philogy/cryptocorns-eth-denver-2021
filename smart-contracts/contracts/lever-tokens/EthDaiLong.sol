// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "../interfaces/ICEth.sol";
import "../interfaces/ICErc20.sol";
import "../interfaces/ICompPriceOracle.sol";

contract EthDaiLong is ERC20 {
    using SafeMath for uint256;

    ICEth public constant collateralCToken = ICEth(0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5);
    ICErc20 public constant debtCToken = ICErc20(0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643);

    ICompPriceOracle public priceOracle = ICompPriceOracle(0x922018674c12a7F0D394ebEEf9B58F186CdE13c1);

    constructor() ERC20("ETH/DAI leveraged long 3x", "longETH") { }

    function mint() external payable {
        uint256 totalSupply_ = totalSupply();
        if (totalSupply_ == 0) {
            _mint(msg.sender, msg.value);
        } else {
            uint256 portion = totalSupply_.mul(msg.value).div(getEquity());
            _mint(msg.sender, portion);
        }

        collateralCToken.mint{ value: msg.value }();
    }

    function getEquity() public view returns(uint256) {
        (uint256 error1, uint256 value,,) = collateralCToken.getAccountSnapshot(address(this));
        require(error1 == 0, "Lever Token: error occured");
        (uint256 error2,, uint256 debt,) = debtCToken.getAccountSnapshot(address(this));
        require(error2 == 0, "Lever Token: error occured");

        uint256 debtAsEth = debt.mul(getDaiPrice()).div(getEthPrice());

        return value.sub(debtAsEth, "Lever Token: No equity");
    }

    function getDaiPrice() public view returns(uint256) {
        return priceOracle.price("ETH");
    }

    function getEthPrice() public view returns(uint256) {
        return priceOracle.price("ETH");
    }
}
