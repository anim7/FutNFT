// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./FutNFTTraining.sol";

/// @title FutNFTTransfer
/// @author Anish Pandit
/// @notice This contract helps in the transfer of a player from one user to another
contract FutNFTTransfer is FutNFTTraining {
    /// @notice This is fired when the player is listed on the market
    /// @param playerId The uint id of the player who is listed
    event Listed(uint256 playerId);
    /// @notice This is fired when the player is unlisted from the market
    /// @param playerId The uint id of the player who is unlisted
    event Unlisted(uint256 playerId);

    /// @notice Checks whether the player is already listed on the market
    /// @param _playerId The uint id of the player to be checked
    modifier listed(uint256 _playerId) {
        require(
            listedOnMarket[_playerId],
            "This player is not listed on the market!"
        );
        _;
    }

    /// @notice Checks whether the player is not listed on the market
    /// @param _playerId The uint id of the player to be checked
    modifier notListed(uint256 _playerId) {
        require(
            !listedOnMarket[_playerId],
            "This player is already listed on the market!"
        );
        _;
    }

    /// @notice Lists the player on the market
    /// @dev Can use gelato here to automate
    /// @param _playerId the uint id of the player to be listed
    function list(
        uint256 _playerId /*, bool repeatTillSold*/
    ) external owned(_playerId) notListed(_playerId) {
        listedOnMarket[_playerId] = true;
        emit Listed(_playerId);
    }

    /// @notice Unlists the player from the market
    /// @param _playerId the uint id of the player to be unlisted
    function unlist(uint256 _playerId)
        external
        owned(_playerId)
        listed(_playerId)
    {
        listedOnMarket[_playerId] = false;
        emit Unlisted(_playerId);
    }

    /// @notice Transfers the player from the sender of the msg to another address
    /// @param _to The address of the user to whom the player is to be sent
    /// @param _playerId The uint id of the player to be transferred
    function transferPlayer(address _to, uint256 _playerId)
        external
        owned(_playerId)
        listed(_playerId)
    {
        super.safeTransferFrom(msg.sender, _to, _playerId);
    }
}
