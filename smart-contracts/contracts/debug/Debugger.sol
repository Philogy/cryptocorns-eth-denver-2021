// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

interface ILeverToken {
    function getEquity() external returns(uint256);
}

contract Debugger {
    event EquityFetch(uint256 equity);

    function getEquity(ILeverToken token) external {
        uint256 equity = token.getEquity();

        emit EquityFetch(equity);
    }
}
