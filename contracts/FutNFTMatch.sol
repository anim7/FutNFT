// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./FutNFTTransfer.sol";
import "./VRFv2Consumer.sol";

/// @title FutNFTMatch
/// @author Anish Pandit
/// @notice This contract can be used to compete with other users' teams
/// @dev Can a substitute function to substitute players during a match
contract FutNFTMatch is FutNFTTransfer, VRFv2Consumer {
    /// @notice The percent of level which will be considered if the player is in a suitable position and not preferred position
    uint256 public levelPercentSuitablePosition;

    /// @notice The percent of level which will be considered if the player is not in a preferred or suitable position
    uint256 public levelPercentNoPosition;

    /// @notice This stores the positions avaiable in a formation
    /// @dev The key is the formation the value is an array of strings containing all the formations
    mapping(string => string[]) formationToPositions;

    /// @notice This stores the linups set by users
    /// @dev The key is the address of the owner and the value is the linup
    mapping(address => LineUp) lineUps;

    /// @notice LinUp struct to store linups
    struct LineUp {
        uint256[11] playerIds;
        string[11] positions;
        string formation;
        bool isValid;
    }

    /// @notice This checks whether the players in the array are owned by the sender of the msg
    /// @param _playerIds uint array of ids of players
    modifier playersOwned(uint256[11] memory _playerIds) {
        for (uint256 i = 0; i < _playerIds.length; i++) {
            require(ownerOf(_playerIds[i]) == msg.sender);
        }
        _;
    }

    /// @notice Checks whether the lineup is set
    /// @param _owner The address of the owner of the team
    modifier lineUpSet(address _owner) {
        require(lineUps[_owner].isValid, "Linup not set");
        _;
    }

    modifier onlyOwner() override(Ownable, VRFv2Consumer) {
        require(owner == msg.sender);
        _;
    }

    /// @notice sets the formationToPositions mapping
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

    /// @notice Sets the level percentage for suitable position
    /// @param _percent The uint value for percent
    function setLevelPercentSuitablePosition(uint256 _percent)
        public
        onlyOwner
    {
        levelPercentSuitablePosition = _percent;
    }

    /// @notice Sets the level percentage for no position
    /// @param _percent The uint value for percent
    function setLevelPercentNoPosition(uint256 _percent) public onlyOwner {
        levelPercentNoPosition = _percent;
    }

    /// @notice Sets the lineup
    /// @param _playerIds The uint ids of 11 players in the lineup
    /// @param _positions The positions of the 11 players in the lineup
    /// @param _formation The formation the players are playing in
    /// @return teamRating The average level of the team after the linup is set
    function setLineUp(
        uint256[11] memory _playerIds,
        string[11] memory _positions,
        string memory _formation
    ) external playersOwned(_playerIds) returns (uint256) {
        lineUps[msg.sender] = LineUp(_playerIds, _positions, _formation, true);
        return _getTeamRating(msg.sender);
    }

    /// @notice Gets the average level of the team
    /// @param _owner The address of the owner of the team
    /// @return teamRating The average level of the team
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

    /// @notice Gets the level of player after checking the position
    /// @param _lineup The lineup
    /// @param _arrayPosition The index in the array
    /// @return level The level of the player
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

    /// @notice Gets player level for unpreferred position
    /// @param _player The player
    /// @param _position The position the player is playing on
    /// @return level The level of the player
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
        requestRandomWords();
        uint256[] memory randomWords;
        randomWords[0] = 1;
        randomWords[1] = 2;
        randomWords[2] = 3;
        randomWords[3] = 4;
        fulfillRandomWords(requestId, randomWords);
    }
}
