// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

interface ICompPriceOracle {
    function price(string memory symbol) external view returns(uint256);
}
