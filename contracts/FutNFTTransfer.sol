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

    function list(uint256 _playerId, uint256 _price)
        public
        owned(_playerId)
        notListed(_playerId)
    {
        for (uint256 i = 0; i < 11; i++) {
            uint256 playerId = lineUps[msg.sender].playerIds[i];
            require(
                playerId != _playerId,
                "Player is in the lineup, cannot list!"
            );
        }
        listedPlayers.push(_playerId);
        listedPlayersPrices[_playerId] = _price;
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
        listedPlayersPrices[_playerId] = 0;
        emit Unlisted(_playerId);
    }

    function transferPlayer(uint256 _playerId)
        external
        payable
        listed(_playerId)
    {
        require(msg.value == listedPlayersPrices[_playerId]);
        address payable owner = payable(ownerOf(_playerId));
        (bool _sent, ) = owner.call{value: msg.value}("");
        require(_sent, "Failed to send");
        super._transfer(owner, msg.sender, _playerId);
        ownerPlayerCount[owner]--;
        playerToOwner[_playerId] = msg.sender;
        ownerPlayerCount[msg.sender]++;
        unlist(_playerId);
    }
}
