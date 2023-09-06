require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const ALCHEMY_RPC_URL = process.env.ALCHEMY_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const POLYGONSCAN_KEY = process.env.POLYGONSCAN_KEY
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    mumbai: {
      url: ALCHEMY_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: POLYGONSCAN_KEY,
    },
  },
};
