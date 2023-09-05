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

    

}