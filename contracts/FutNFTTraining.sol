// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./FutNFT.sol";

contract FutNFTTraining is FutNFT {
    uint256 public cooldown = 43200 seconds;
    uint256 public fee = 0.001 ether;
    uint256 public maxLevel = 100;

    event LevelUp(uint256 playerId);

    modifier belowLevel(uint256 _level, uint256 _playerId) {
        require(
            players[_playerId].level < _level,
            "Player has reached max level!"
        );
        _;
    }

    modifier cooldownOver(uint256 _playerId, uint256 _cooldown) {
        require(
            players[_playerId].lastUpgrade + cooldown <= block.timestamp,
            "Cooldown period is not over!"
        );
        _;
    }

    function setCooldown(uint256 _cooldown) external onlyOwner {
        cooldown = _cooldown;
    }

    function setFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    function setMaxLevel(uint256 _level) external onlyOwner {
        maxLevel = _level;
    }

    function train(uint256 _playerId)
        external
        payable
        cooldownOver(_playerId, cooldown)
        belowLevel(maxLevel, _playerId)
        owned(_playerId)
    {
        require(msg.value >= fee, "Required fee is not sent!");
        players[_playerId].level++;
        emit LevelUp(_playerId);
    }
}
