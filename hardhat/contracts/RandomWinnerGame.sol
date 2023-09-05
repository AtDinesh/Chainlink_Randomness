// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract RandomWinnerGame is VRFConsumerBase, Ownable {

    /// variables
    // Chainlink-related variable
    // amount of LINK to send with request
    uint256 public fee;
    // ID of public key against which randomness is generated
    bytes32 public keyHash;

    // Addresses of the players in the game
    address[] public players;
    // Max number of players in the game
    uint8 maxPlayers;
    // has the game started ?
    bool public gameStarted;
    // fees for entering a game
    uint256 entryFee;
    // current game id
    uint256 public gameId;

    /// Events
    event GameStarted(uint256 gameId, uint8 maxPlayers, uint256 entryFee);
    event PlayerEntered(address player, uint256 gameId);
    event GameEnded(uint256 gameId, address winner, bytes32 requestId);

    /**
   * constructor inherits a VRFConsumerBase and initiates the values for keyHash, fee and gameStarted
   * @param vrfCoordinator address of VRFCoordinator contract
   * @param linkToken address of LINK token contract
   * @param vrfFee the amount of LINK to send with the request
   * @param vrfKeyHash ID of public key against which randomness is generated
   */
   constructor (address vrfCoordinator, address linkToken, uint256 vrfFee, bytes32 vrfKeyHash) 
   VRFConsumerBase(vrfCoordinator, linkToken) {
      fee = vrfFee;
      keyHash = vrfKeyHash;
      gameStarted = false;
   }

   /**
    * startGame create a new game by setting appropriate values for all the variables
    */
    function startGame(uint8 _maxPlayers, uint256 _entryFee) public onlyOwner {
        // Check if there is already a game running
        require(!gameStarted, "Game already started");
        // we need at least 2 players
        require(_maxPlayers >= 2, "Minimum 2 players required");

        // empty current list of players
        delete players;
        // set the max player number for the new game
        maxPlayers = _maxPlayers;
        // set the entry fee for the new game
        entryFee = _entryFee;
        // set the game started flag to true
        gameStarted = true;
        gameId += 1;
        emit GameStarted(gameId, maxPlayers, entryFee);
    }




}