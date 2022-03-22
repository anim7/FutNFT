// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./FutNFTTraining.sol";

contract FutNFTTransfer is FutNFTTraining {
    event Listed(uint256 playerId);
    event Unlisted(uint256 playerId);

    modifier listed(uint256 _playerId) {
        require(
            listedPlayerIndex[_playerId] != uint256(0),
            "This player is not listed on the market!"
        );
        _;
    }

    modifier notListed(uint256 _playerId) {
        require(
            listedPlayerIndex[_playerId] == uint256(0),
            "This player is already listed on the market!"
        );
        _;
    }

    /// @dev Can use gelato here to automate
    function list(
        uint256 _playerId /*, bool repeatTillSold*/
    ) public owned(_playerId) notListed(_playerId) {
        listedPlayers.push(_playerId);
        listedPlayerIndex[_playerId] = listedPlayers.length;
        emit Listed(_playerId);
    }

    function unlist(uint256 _playerId)
        public
        owned(_playerId)
        listed(_playerId)
    {
        delete listedPlayers[listedPlayerIndex[_playerId] - 1];
        listedPlayerIndex[_playerId] = 0;
        emit Unlisted(_playerId);
    }

    function transferPlayer(address _to, uint256 _playerId)
        external
        owned(_playerId)
        listed(_playerId)
    {
        super.safeTransferFrom(msg.sender, _to, _playerId);
        playerToOwner[_playerId] = _to;
        unlist(_playerId);
    }
}
