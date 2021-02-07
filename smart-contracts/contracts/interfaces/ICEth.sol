// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "./ICToken.sol";

interface ICEth is ICToken {
    function mint() external payable;
    function repayBorrow() external payable;
}
