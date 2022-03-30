// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract VRFConsumer is VRFConsumerBase {
    bytes32 keyHash;
    uint256 requiredFee;
    uint256 public randomResult;

    constructor()
        VRFConsumerBase(
            0x8C7382F9D8f56b33781fE506E897a4F1e2d17255,
            0x326C977E6efc84E512bB9C30f76E30c160eD06FB
        )
    {
        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        requiredFee = 0.1 * 10**18;
    }

    function getRandomNumber() public returns (bytes32 requestId) {
        require(
            LINK.balanceOf(address(this)) >= requiredFee,
            "Not enough LINK - fill contract with faucet"
        );
        return requestRandomness(keyHash, requiredFee);
    }

    function fulfillRandomness(
        bytes32, /*requestId*/
        uint256 randomness
    ) internal override {
        randomResult = randomness;
    }
}
