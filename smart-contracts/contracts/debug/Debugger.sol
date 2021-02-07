// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "../interfaces/ICToken.sol";

interface ILeverToken {
    function getEquity() external returns(uint256, uint256);
}

contract Debugger {
    event EquityFetch(uint256 positiveEquity, uint256 negativeEquity);
    event UnderlyingBal(uint256 bal);

    function getEquity(ILeverToken token) external {
        (uint256 positiveEquity, uint256 negativeEquity) = token.getEquity();

        emit EquityFetch(positiveEquity, negativeEquity);
    }

    function getUnderlyingBalance(ICToken token, address account) external {
        uint256 underyling = token.balanceOfUnderlying(account);
        emit UnderlyingBal(underyling);
    }
}
