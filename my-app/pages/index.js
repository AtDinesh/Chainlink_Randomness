import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useEffect, useState, useRef } from "react";
import Web3Modal from "web3modal";
import { FETCH_CREATED_GAME } from "@/queries";
import { abi, RANDOM_GAME_CONTRACT_ADDRESS } from "../constants";
import { subgraphQuery } from "@/utils";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const zero = BigNumber.from("0");
  // keep track of whether the user's wallet is connected
  const [walletConnected, setWalletConnected] = useState(false);
  // loading state
  const [loading, setLoading] = useState(false);
  // Is the connected wallet the owner ?
  const [isOwner, setIsOwner] = useState(false);
  // keep track of the entryFee for current game
  const [entryFee, setEntryFee] = useState(zero);
  // track how much players max can join the game
  const [maxPlayers, setMaxPlayers] = useState(0);
  // has the game already started ?
  const [gameStarted, setGameStarted] = useState(false);
  // Which players joined the game ?
  const [players, setPlayers] = useState([]);
  // Who wins the game ?
  const [winner, setWinner] = useState();
  // keep track of all the logs for a given game
  const [logs, setLogs] = useState([]);
  // required ref to Web3Modal to connect metamask
  const web3ModalRef = useRef();

  // force react to re render the page if needed.
  // This is used here to show new logs
  const forceUpdate = react.useReducer(() => ({}), {})[1];

  /** Helper function
   * Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
   * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
   * request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Mumbai network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to Mumbai");
      throw new Error("Change network to Mumbai");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  // Connect the metamask wallet
  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal (metamask)
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  }


  // startGame is called by the owner of the contract to start a new game
  const startGame = async () => {
    try {
      // Get the signer
      const signer = await getProviderOrSigner(true);
      // Connect to contract: signer needs to sign transaction to start new game
      const randomGameContract = new Contract(
        RANDOM_GAME_CONTRACT_ADDRESS,
        abi,
        signer
      );
      setLoading(true);

      // Call the startGame function of the contract
      const tx = await randomGameContract.startGame(maxPlayers, entryFee);
      await tx.wait();
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };


  // joinGame is called by a player to join a game
  const joinGame = async () => {
    try {
      // Get the signer
      const signer = await getProviderOrSigner(true);
      // Connect to contract
      const randomGameContract = new Contract(
        RANDOM_GAME_CONTRACT_ADDRESS,
        abi,
        signer
      );

      setLoading(true);
      // Call the joinGame function of the contract
      const tx = await randomGameContract.joinGame({value: entryFee});
      await tx.wait();
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };


  // checkIfGameStarted checks if the game has started and initializes the logs for the game.
  const checkIfGameStarted = async () => {
    try {
      // Get the provider
      const provider = getProviderOrSigner(false);
      // Connect to the contract
      const randomGameContract = new Contract(
        RANDOM_GAME_CONTRACT_ADDRESS,
        abi,
        provider
      );
      // read gameStarted boolean from contract
      const _gameStarted = await randomGameContract.gameStarted();

      // query the latest game
      const _gameArray = await subgraphQuery(FETCH_CREATED_GAME());
      const _game = _gameArray[0];

      // Initialize the logs
      let _logs = [];
      if (_gameStarted) {
        _logs = [`Game has started with ID: ${_game.id}`];
        if (_game.players && _game.players.length > 0) {
          _logs.push(`${_game.players.length} / ${game.maxPlayers} joined the game`);
          _game.players.forEach((player) => {
          _logs.push(`${player} joined !`);
          });
        }
        setEntryFee(BigNumber.from(_game.entryFee));
        setMaxPlayers(_game.maxPlayers);
      } else if (!_gameStarted && _game.winner) { // game ended and there is a winner
        _logs = [
          `Last game with ID ${_game.id} has ended`,
          `Winner is: ${_game.winner}`,
          `Wait for a new game to start...`
        ];

        setWinner(_game.winner);
      }
      setLogs(_logs);
      setPlayers(_game.players);
      setGameStarted(_gameStarted);
      forceUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  // getOwner retrieves the owner of the contract
  const getOwner = async () => {
    try {
      // Get the provider
      const provider = getProviderOrSigner(false);
      // Connect to the contract
      const randomGameContract = new Contract(
        RANDOM_GAME_CONTRACT_ADDRESS,
        abi,
        provider
      );
      
      // call the owner function of the contract
      const _owner = randomGameContract.owner();
      // get the Signer to extract the address of currently connected address
      const signer = getProviderOrSigner(true);
      const connectedAddress = await signer.getAddress();
      if (connectedAddress.toLowerCase() === _owner.toLowerCase()) {
        setIsOwner(true);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  

}
