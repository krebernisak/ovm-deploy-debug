# Debugging Optimism L2 deployment of Chainlink OVM contracts

The Chainlink feeds contracts this script will deploy and test are:

- [chainlink/evm-contracts/src/v0.6-ovm/Medianizer.sol](https://github.com/smartcontractkit/chainlink/blob/feature/ovm/contracts-v2/evm-contracts/src/v0.6-ovm/Medianizer.sol).
- [chainlink/evm-contracts/src/v0.6-ovm/FluxAggregator.sol](https://github.com/smartcontractkit/chainlink/blob/feature/ovm/contracts-v2/evm-contracts/src/v0.6-ovm/FluxAggregator.sol).
- [chainlink/evm-contracts/src/v0.6-ovm/AccessControlledAggregator.sol](https://github.com/smartcontractkit/chainlink/blob/feature/ovm/contracts-v2/evm-contracts/src/v0.6-ovm/AccessControlledAggregator.sol).
- [chainlink/evm-contracts/src/v0.6-ovm/EACAggregatorProxy.sol](https://github.com/smartcontractkit/chainlink/blob/feature/ovm/contracts-v2/evm-contracts/src/v0.6-ovm/EACAggregatorProxy.sol).

Install dependencies:

```bash
yarn install
```

Start the [local OVM testnet](https://github.com/ethereum-optimism/optimism-integration) (or use `kovan`) and run:

```bash
node index.js [network]
```
