// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "../interfaces/ICompPriceOracle.sol";

contract BasicPriceOracle {
    mapping(address => uint256) public prices;

    function setPrice(address priceOf, uint256 price) external {
        prices[priceOf] = price;
    }
}
