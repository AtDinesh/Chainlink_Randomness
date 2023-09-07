# Chainlink Randomness

Chainlink VRF (Verifiable Random Function) is a provably-fair and verifiable source of randomness designed for smart contracts. Smart contract developers can use Chainlink VRF as a tamper-proof random number generator (RNG) to build reliable smart contracts for any applications which rely on unpredictable outcomes.

How is Chainlink VRF used ?
1. VRFConsumerBase contract calls the VRF Coordinator responsible for pushing randomness.
2. We inherit the VRFConsumerBase to use:
    - `requestRandomness()` to request randomness from Chainlink VRF.
    - `fulfillRandomness()` to receive and do something with randomness.

## Example

In this project, we will be experimenting the randomness generation by chainlink.
To do so, we build a simple lottery game which simply consist in choosing a random winner in each game.

The `RandomWinnerGame` Contract is deployed at address 0x820CeE82c1CDBa721B8eD4022adc34135DEbEcDe on the Polygon PoS Mumbai testnet.
The contract is verified on [Polygonscan](https://mumbai.polygonscan.com/address/0x820CeE82c1CDBa721B8eD4022adc34135DEbEcDe#code).

## Testing the LINK Oracle.
In order to request for randomness, the smart contract needs some link token to be sent with the request.
The contract can be funded with LINK on the [Chainlink Faucet](https://faucets.chain.link/mumbai) or the [Polygon Faucet](https://faucet.polygon.technology/).

# Part 2: The Graph's Indexer

The part 2 of this project is to use The Graph to index the data of the RandomWinnerGame contract.
The Graph is a decentralized query protocol and indexing service for the blockchain.
The Graph can be used to track events emitted from smart contracts and write custom data transformation scripts.

## How to ?
### Build

- Create an abi.json file in the root folder and paste in the abi of the contract.
- Create a Subgraph on [The Graph's Hosted Service](https://thegraph.com/hosted-service/)
- Install the graph-cli from the root folder: `yarn global add @graphprotocol/graph-cli` or `npm install -g @graphprotocol/graph-cli`
- Run `graph init` and select the subgraph name and the network: 
    `graph init --contract-name {NameOfContract} --product hosted-service {GITHUB_USERNAME}/{subgraph_name}  --from-contract {CONTRACT_ADDRESS}  --abi ./abi.json --network mumbai graph`
- Configure the graph access token by getting it from the dashboard. `graph auth --product hosted-service ACCESS_TOKEN`
- deploy the graph: `cd graph && yarn deploy` or `npm run deploy`
- You should be able to see the graph from [The Graph's Hosted Service](https://thegraph.com/hosted-service/)