// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IERC20Long is IERC20 {
    event Rebalance(bool positive, uint256 fromRatio, uint256 toRatio);
    event Equity(uint256 positiveEquity, uint256 negativeEquity);

    function mint(uint256 amount) external;
    function rebalance() external;
    function redeem(uint256 amount) external;
    function redeemTo(address recipient, uint256 amount) external;
}
