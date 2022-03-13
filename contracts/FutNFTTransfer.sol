// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./FutNFTTraining.sol";

contract FutNFTTransfer is FutNFTTraining {
    event Listed(uint256 playerId);
    event Unlisted(uint256 playerId);

    modifier listed(uint256 _playerId) {
        require(
            listedOnMarket[_playerId],
            "This player is not listed on the market!"
        );
        _;
    }

    modifier notListed(uint256 _playerId) {
        require(
            !listedOnMarket[_playerId],
            "This player is already listed on the market!"
        );
        _;
    }

    /// @dev Can use gelato here to automate
    function list(
        uint256 _playerId /*, bool repeatTillSold*/
    ) external owned(_playerId) notListed(_playerId) {
        listedOnMarket[_playerId] = true;
        emit Listed(_playerId);
    }

    function unlist(uint256 _playerId)
        external
        owned(_playerId)
        listed(_playerId)
    {
        listedOnMarket[_playerId] = false;
        emit Unlisted(_playerId);
    }

    function transferPlayer(address _to, uint256 _playerId)
        external
        owned(_playerId)
        listed(_playerId)
    {
        super.safeTransferFrom(msg.sender, _to, _playerId);
    }
}
