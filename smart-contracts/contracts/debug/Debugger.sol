// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

interface ILeverToken {
    function getEquity() external returns(uint256, uint256);
}

contract Debugger {
    event EquityFetch(uint256 positiveEquity, uint256 negativeEquity);

    function getEquity(ILeverToken token) external {
        (uint256 positiveEquity, uint256 negativeEquity) = token.getEquity();

        emit EquityFetch(positiveEquity, negativeEquity);
    }
}
