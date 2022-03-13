// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title FutNFT
/// @author Anish Pandit
/// @notice This contract is mainly for minting and getting football players
/// @dev getPlayer, ownerOf, getPlayerExists, _beforeTokenTransfer and supportsInterface are implemented without side effects
contract FutNFT is ERC721, ERC721Enumerable, Ownable {
    /// @notice Player struct to store information about players
    /// @dev Should have logic for players with no suitable position array
    /// @dev NA in suitablePositions no suitable position
    struct Player {
        uint256 id;
        string name;
        string preferredPosition;
        uint8 age;
        uint8 level;
        uint32 lastUpgrade;
        string[] suitablePositions;
    }

    /// @notice History struct to store owner win and loss count
    struct History {
        uint256 winCount;
        uint256 lossCount;
    }

    /// @notice Stores the owner's win and loss count
    /// @dev The key is the owner address and the value is the History (win and loss count)
    mapping(address => History) ownerHistory;

    /// @notice This stores all the players
    /// @dev the key is the player id and the value is the player
    mapping(uint256 => Player) public players;

    /// @notice This stores all the owners of the players
    /// @dev The key is the player id and the value is the address of the owner
    mapping(uint256 => address) public playerToOwner;

    /// @notice This stores the number of player a owner has
    /// @dev The key is the address of the owner and the value is the count of players
    mapping(address => uint256) public ownerPlayerCount;

    /// @notice This stores the players who are listed on the market
    /// @dev The key is the player id and the value is a boolean value
    mapping(uint256 => bool) public listedOnMarket;

    /// @notice This event is fired when a player is minted
    /// @param playerId the uint id of the player
    event PlayerAdded(uint256 playerId);

    /// @notice Checks if the player is owned by the sender of the message
    /// @param id The uint id of the player
    modifier owned(uint256 id) {
        require(getPlayerExists(id), "Player does not exist");
        require(msg.sender == ownerOf(id), "Not the owner!");
        _;
    }

    constructor() ERC721("FutNFT", "FNFT") {}

    /// @notice Gets a player by id
    /// @param _id The uint id of the player
    /// @return player The player fetched using the id
    function getPlayer(uint256 _id) public view returns (Player memory) {
        return players[_id];
    }

    /// @notice Gets the owner of a player by id
    /// @param tokenId The uint id of the player
    /// @return ownerAddress The address of the owner of the player
    /// @inheritdoc	ERC721
    function ownerOf(uint256 tokenId)
        public
        view
        override(ERC721, IERC721)
        returns (address)
    {
        return super.ownerOf(tokenId);
    }

    /// @notice Checks if a player exists by id
    /// @param _id The uint id of the player
    /// @return playerExists Boolean value which tells if the player exits or not
    function getPlayerExists(uint256 _id) public view returns (bool) {
        return playerToOwner[_id] != address(0);
    }

    /// @notice Mints a player
    /// @param _player The player of type Player which is to be minted
    function mint(Player memory _player) public onlyOwner {
        require(playerToOwner[_player.id] == address(0), "Player Exists!");
        players[_player.id] = _player;
        playerToOwner[_player.id] = msg.sender;
        _mint(msg.sender, _player.id);
        emit PlayerAdded(_player.id);
    }

    /// @param from The address of the account from which the token is to be transferred
    /// @param to The address of the account to which the token is to be transferred
    /// @param tokenId The uint id of the token
    /// @inheritdoc	ERC721
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /// @param interfaceId The id of the interface of type bytes4
    /// @return supportsInterface Boolean value
    /// @inheritdoc	ERC721
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
