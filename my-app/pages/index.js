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

  
}
