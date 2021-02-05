// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ICToken is IERC20 {
    function exchangeRateStored() external view returns(uint256);
}
