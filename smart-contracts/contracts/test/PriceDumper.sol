// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "../interfaces/IWETH.sol";

contract PriceDumper {
    using SafeMath for uint256;

    IWETH public constant WETH = IWETH(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);

    uint256 public constant SCALE = 1000;

    function dumpPair(
        IUniswapV2Pair tokenPair,
        uint256 dumpFactor
    ) external payable {
        (uint112 reserve0, uint112 reserve1,) = tokenPair.getReserves();
        uint256 x = uint256(reserve0);
        uint256 y = uint256(reserve1);
        uint256 inputAmount = y.mul(dumpFactor).div(SCALE).add(1);
        WETH.deposit{ value: inputAmount }();
        WETH.transfer(address(tokenPair), inputAmount);

        uint256 outputAmount = x.mul(inputAmount).mul(997).div(y.mul(1000).add(inputAmount.mul(997)));

        tokenPair.swap(outputAmount, 0, address(this), new bytes(0));
        msg.sender.transfer(msg.value.sub(inputAmount));
    }

}
