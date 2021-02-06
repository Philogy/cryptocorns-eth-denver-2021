// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ICToken is IERC20 {
    function borrow(uint256 borrowAmount) external returns(uint256);
    function exchangeRateStored() external view returns(uint256);
    function accrueInterest() external returns(uint256);
    function balanceOfUnderlying(address account) external returns (uint256);
    function borrowBalanceCurrent(address account) external returns (uint256);
    function getAccountSnapshot(address account)
        external
        view
        returns(uint256, uint256, uint256, uint256);
    function comptroller() external view returns(address);
}
