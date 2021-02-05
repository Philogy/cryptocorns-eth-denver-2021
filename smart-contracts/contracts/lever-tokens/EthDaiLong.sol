// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../interfaces/ICEth.sol";

contract EthDaiLong is ERC20 {
    ICEth public constant underlyingCToken =
        ICEth(0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5);

    constructor() ERC20("ETH/DAI leveraged long 3x", "longETH") { }

    function mint() external payable {
        uint256 portion = _calcPortion(msg.value);
        _mint(msg.sender, portion);
        underlyingCToken.mint{ value: msg.value }();
    }

    function _calcPortion(uint256 incomingEth) internal pure returns(uint256) {
        return incomingEth;
    }
}
