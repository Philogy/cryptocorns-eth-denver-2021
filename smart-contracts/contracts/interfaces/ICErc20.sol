// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "./ICToken.sol";

interface ICErc20 is ICToken {
    function mint(uint256 mintAmount) external returns(uint256);
    function underlying() external view returns(address);
    function repayBorrow(uint256 repayAmount) external returns(uint256);
}
