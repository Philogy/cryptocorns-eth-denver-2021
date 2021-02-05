// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EthDaiLong is ERC20 {
    constructor() ERC20("ETH/DAI leveraged long 3x", "longETH") { }

    function mint() external payable {
        uint256 portion = _calcPortion(msg.value);
        _mint(msg.sender, portion);
    }

    function _calcPortion(uint256 incomingEth) internal pure returns(uint256) {
        return incomingEth;
    }
}
