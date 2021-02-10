// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

import "../interfaces/ICToken.sol";

contract Debugger {
    event DebugMessage(bytes data);

    function getReturnData(address target, bytes calldata callData)
        external
        payable
    {
        (bool success, bytes memory returnData) = target.call{ value: msg.value }(callData);
        require(success, string(returnData));

        if (returnData.length > 0) {
            emit DebugMessage(returnData);
        }
    }
}
