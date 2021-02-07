// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "./ICToken.sol";

interface ICompPriceOracle {
    function price(string memory symbol) external view returns(uint256);
    function getUnderlyingPrice(ICToken cToken) external view returns(uint256);
}
