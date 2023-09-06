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

    /**
    joinGame is called by players to enter the game
    The function is payable since players must pay fees at entry
    Note: A plater can enter the same game several times. To disencourage this,
    we could add a unrecoverable fee that goes to the smart contract.
    */
    function joinGame() public payable {
        // Check if the game is started
        require(!gameStarted, "Game already started");
        // Check if the value sent by the user matches the entryFee;
        require(msg.value == entryFee, "Entry fee is incorrect");
        // Check if there is place left in the game
        require(players.length < maxPlayers, "Game is full");
        
        // Add the player to the game
        players.push(msg.sender);
        // Emit the event
        emit PlayerEntered(msg.sender, gameId);

        // Once the maxPlayers is reached, launch the game
        if (players.length == maxPlayers) {
            getRandomWinner();
        }
    }


    /**
    * getRandomWinner requests a random winner from the VRF Coordinator
    */
    function getRandomWinner() private returns (bytes32 requestId){
        // VRFConsumerBase we inherited has a LINK interface
        // Make sure the contract has enough LINK to request for randomness
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK");
        // Launch the request to the coordinator
        // requestRandomness is a function of the ConsumerBaseVRF
        return requestRandomness(keyHash, fee);
    }

    /**
    * VRFCoordinator calls fulfillRandomness when it receives a valid VRF proof.
    * This function is overrided to act upon the random number generated by Chainlink VRF.
    * @param requestId  this ID is unique for the request we sent to the VRF Coordinator
    * @param randomness this is a random unit256 generated and returned to us by the VRF Coordinator
    * The random number is a uint256. This function needs to process the random number so that it can be applied
    * correctly in the context of the dApp.
   */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal virtual override {
        // We want a random number within maxPLayers
        uint256 winnerIndex = randomness % maxPlayers;
        // Get the address of the winner
        address winner = players[winnerIndex];
        // Transfer the prize to the winner
        // The prize is the total amount of eth in the contract (no unrecoverable fee)
        (bool sent,) = winner.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
        // Emit corresponding event
        emit GameEnded(gameId, winner, requestId);
        gameStarted = false;
    }


}