# Debugging OVM testnet deployment of Chanlink contracts

The contract we are trying to deploy is [chainlink/evm-contracts/src/v0.6-ovm/FluxAggregator.sol](https://github.com/smartcontractkit/chainlink/blob/feature/ovm-v10/contracts/evm-contracts/src/v0.6-ovm/FluxAggregator.sol).

Install dependencies:

```bash
yarn install
```

Start the [local OVM testnet](https://github.com/ethereum-optimism/optimism-integration) and run:

```bash
node index.js [network]
```
