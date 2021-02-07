// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "./IERC20Detailed.sol";

interface ICToken is IERC20Detailed {
    function borrow(uint256 borrowAmount) external returns(uint256);
    function exchangeRateStored() external view returns(uint256);
    function redeemUnderlying(uint256 redeemAmount) external returns(uint256);
    function accrueInterest() external returns(uint256);
    function balanceOfUnderlying(address account) external returns (uint256);
    function borrowBalanceCurrent(address account) external returns (uint256);
    function getAccountSnapshot(address account)
        external
        view
        returns(uint256, uint256, uint256, uint256);
    function comptroller() external view returns(address);
}
