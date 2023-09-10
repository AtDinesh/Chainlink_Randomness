import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useEffect, useState, useRef } from "react";
import Web3Modal from "web3modal";
import { FETCH_CREATED_GAME } from "@/queries";
import { abi, RANDOM_GAME_NFT_CONTRACT_Address } from "../constants";

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


}
