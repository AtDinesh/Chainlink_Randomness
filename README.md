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
