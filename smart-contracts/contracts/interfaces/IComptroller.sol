// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

interface IComptroller {
    function getAccountLiquidity(address account)
        external
        view
        returns (uint256, uint256, uint256);
    function enterMarkets(address[] calldata cTokens) external returns (uint256[] memory);
    function oracle() external view returns(address);
    function _setPriceOracle(address newOracle) external returns(uint256);
}
