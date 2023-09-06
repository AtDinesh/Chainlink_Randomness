// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env"});
const { FEE, VRF_COORDINATOR, LINK_TOKEN, KEY_HASH } = require("../constants");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("deploying")
  // deploy contract
  const randomWinnerGame = await hre.ethers.deployContract(
    "RandomWinnerGame",
    [VRF_COORDINATOR, LINK_TOKEN, FEE, KEY_HASH]
  );

  console.log("waiting for deployment")
  await randomWinnerGame.waitForDeployment();
  console.log("Contract deployed to:", randomWinnerGame.target);

  // Wait for etherscan to catch up
  console.log("Sleeping... wait for etherscan to catch up");
  await sleep(30 * 1000);

  // verify the contract
  await hre.run("verify:verify", {
    address: randomWinnerGame.target,
    constructorArguments: [VRF_COORDINATOR, LINK_TOKEN, FEE, KEY_HASH],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
