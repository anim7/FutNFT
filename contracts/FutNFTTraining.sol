// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./FutNFT.sol";

/// @title FutNFTTraining
/// @dev ADD A MAX LEVEL STATE VARIABLE TO CONTROL THE MAX LEVEL
/// @author Anish Pandit
/// @notice This contract can be used to train players to increase their level
contract FutNFTTraining is FutNFT {
    /// @notice This stores the value of the cooldown period
    uint256 public cooldown = 432000 seconds;
    /// @notice This stores the value of the fee required to level up
    uint256 public fee = 0.001 ether;

    /// @notice This event is fired when a player is levelled up
    /// @param playerId The uint id of the player
    event LevelUp(uint256 playerId);

    /// @notice This checks if the player's level is below the maximum level
    /// @param _level The maximum level
    /// @param _playerId The uint id of the player
    modifier belowLevel(uint256 _level, uint256 _playerId) {
        require(
            players[_playerId].level < _level,
            "Player has reached max level!"
        );
        _;
    }

    /// @notice Checks if the cooldown period of the player is over
    /// @param _playerId The uint id of the player
    /// @param _cooldown The cooldown period
    modifier cooldownOver(uint256 _playerId, uint256 _cooldown) {
        require(
            players[_playerId].lastUpgrade + cooldown <= block.timestamp,
            "Cooldown period is not over!"
        );
        _;
    }

    /// @notice Sets the cooldown period
    /// @dev Only the owner of the contract can do so
    /// @param _cooldown The new cooldown period
    function setCooldown(uint256 _cooldown) external onlyOwner {
        cooldown = _cooldown;
    }

    /// @notice Sets the required fee to level up
    /// @dev Only the owner of the contract can do so
    /// @param _fee The new fee
    function setFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    /// @notice Trains the player
    /// @dev The owner should send the required fee and the player should be below level 100
    /// @param _playerId The uint id of the player who is to be trained
    function train(uint256 _playerId)
        external
        payable
        cooldownOver(_playerId, cooldown)
        belowLevel(100, _playerId)
        owned(_playerId)
    {
        require(msg.value >= fee, "Required fee is not sent!");
        players[_playerId].level++;
        emit LevelUp(_playerId);
    }
}
