// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./FutNFTTransfer.sol";
import "./VRFConsumer.sol";

contract FutNFTMatch is FutNFTTransfer, VRFConsumer {
    uint256 public levelPercentSuitablePosition;
    uint256 public levelPercentNoPosition;
    mapping(string => string[]) formationToPositions;
    mapping(address => LineUp) lineUps;

    struct LineUp {
        uint256[11] playerIds;
        string[11] positions;
        string formation;
        bool isValid;
    }

    modifier playersOwned(uint256[11] memory _playerIds) {
        for (uint256 i = 0; i < _playerIds.length; i++) {
            require(ownerOf(_playerIds[i]) == msg.sender);
        }
        _;
    }

    modifier lineUpSet(address _owner) {
        require(lineUps[_owner].isValid, "Linup not set");
        _;
    }

    // modifier onlyOwner() override(Ownable, VRFv2Consumer) {
    //     require(owner == msg.sender);
    //     _;
    // }

    constructor() {
        formationToPositions["4-3-3"] = [
            "GK",
            "LB",
            "CB",
            "CB",
            "RB",
            "CM",
            "CM",
            "CM",
            "LW",
            "ST",
            "RW"
        ];
    }

    function setLevelPercentSuitablePosition(uint256 _percent)
        public
        onlyOwner
    {
        levelPercentSuitablePosition = _percent;
    }

    function setLevelPercentNoPosition(uint256 _percent) public onlyOwner {
        levelPercentNoPosition = _percent;
    }

    function setLineUp(
        uint256[11] memory _playerIds,
        string[11] memory _positions,
        string memory _formation
    ) external playersOwned(_playerIds) returns (uint256) {
        lineUps[msg.sender] = LineUp(_playerIds, _positions, _formation, true);
        return _getTeamRating(msg.sender);
    }

    function _getTeamRating(address _owner)
        internal
        view
        lineUpSet(_owner)
        returns (uint256)
    {
        LineUp memory lineup = lineUps[_owner];
        uint256 sum;
        uint256 count;
        for (uint256 i = 0; i < lineup.playerIds.length; i++) {
            sum += _getPlayerLevel(lineup, i);
            count++;
        }
        return sum / count;
    }

    function _getPlayerLevel(LineUp memory _lineup, uint256 _arrayPosition)
        internal
        view
        returns (uint256)
    {
        Player memory player = super.getPlayer(
            _lineup.playerIds[_arrayPosition]
        );
        string memory position = _lineup.positions[_arrayPosition];
        uint256 level;
        if (
            keccak256(abi.encodePacked(player.preferredPosition)) ==
            keccak256(abi.encodePacked(position))
        ) {
            level = player.level;
        } else {
            level = _getPlayerLevelForUnpreferredPosition(player, position);
        }
        return level;
    }

    function _getPlayerLevelForUnpreferredPosition(
        Player memory _player,
        string memory _position
    ) internal view returns (uint256) {
        uint256 level = (_player.level * levelPercentNoPosition) / 100;
        for (uint256 k = 0; k < _player.suitablePositions.length; k++) {
            if (
                keccak256(abi.encodePacked(_player.suitablePositions[k])) ==
                keccak256(abi.encodePacked(_position))
            ) {
                level = (_player.level * levelPercentSuitablePosition) / 100;
                break;
            }
        }
        return level;
    }

    function play(address _opponent)
        external
        lineUpSet(msg.sender)
        lineUpSet(_opponent)
    {
        uint256 teamRating = _getTeamRating(msg.sender);
        uint256 opponentTeamRating = _getTeamRating(_opponent);
        uint256 winProbability = 50;
        if (teamRating > opponentTeamRating) {
            winProbability = 50 + ((teamRating - opponentTeamRating) * 3);
        } else {
            winProbability = 50 - ((opponentTeamRating - teamRating) * 3);
        }
        getRandomNumber();
        randomResult = (randomResult % 100) + 1;
        if (randomResult <= winProbability) {
            // won
        } else {
            // lost
        }
    }
}
