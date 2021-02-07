// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "../interfaces/ICompPriceOracle.sol";

contract MalleablePriceOracle {
    ICompPriceOracle public constant realOracle
        = ICompPriceOracle(0x922018674c12a7F0D394ebEEf9B58F186CdE13c1);

    mapping(string => uint256) internal _setPrices;

    function setPrice(string memory ticker, uint256 newPrice) external {
        _setPrices[ticker] = newPrice;
    }

    function resetPrice(string memory ticker) external {
        _setPrices[ticker] = 0;
    }

    function price(string memory ticker) external view returns(uint256) {
        uint256 setPrice_ = _setPrices[ticker];

        return setPrice_ > 0 ? setPrice_ : realOracle.price(ticker);
    }
}
