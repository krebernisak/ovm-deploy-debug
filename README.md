# Debugging OVM testnet deployment

The contract we are trying to deploy is [chainlink/evm-contracts/src/v0.6-ovm/FluxAggregator.sol](https://github.com/smartcontractkit/chainlink/blob/feature/ovm-v10/contracts/evm-contracts/src/v0.6-ovm/FluxAggregator.sol).

Install dependencies:

```bash
yarn install
```

Start the [local OVM testnet](https://github.com/ethereum-optimism/optimism-integration) and run:

```bash
node index.js
```

The output should look something like this:

```bash
Deploying with:  [
  '0x0000000000000000000000000000000000000000',
  1,
  100,
  '0x0000000000000000000000000000000000000000',
  2,
  4,
  42,
  'Test 4.20',
  { gasPrice: 0 }
]
Deployed in transaction: 0x9a69fe35b0c6146d9818d83ac7633dade8a09b1bcdfdfb0eb997ee7df6163f54
Will live at address: 0x89aad3089938F7C0d788b8e102d1124026fa5838
Contract now live at:  0x89aad3089938F7C0d788b8e102d1124026fa5838
Receipt:  {
  to: null,
  from: '0x640e7cc27b750144ED08bA09515F3416A988B6a3',
  contractAddress: '0x89aad3089938F7C0d788b8e102d1124026fa5838',
  transactionIndex: 0,
  gasUsed: BigNumber { _hex: '0x34fef7', _isBigNumber: true },
  logsBloom: '0x00000000000000000000000000000000000000000000000000040000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000008000000000000000010000000000000000000000400000000000000000000000000008000000000000000000000000010000000000000000000000000000000000000000040000000002000000000000000000000000000000000004020000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  blockHash: '0xb40f63f44572611a9f305f9f3cb722b9ac3fdf42af5c7c859dd9dae8ebea13cc',
  transactionHash: '0x9a69fe35b0c6146d9818d83ac7633dade8a09b1bcdfdfb0eb997ee7df6163f54',
  logs: [
    {
      transactionIndex: 0,
      blockNumber: 22,
      transactionHash: '0x9a69fe35b0c6146d9818d83ac7633dade8a09b1bcdfdfb0eb997ee7df6163f54',
      address: '0x4200000000000000000000000000000000000006',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000000000000000000000',
      logIndex: 0,
      blockHash: '0xb40f63f44572611a9f305f9f3cb722b9ac3fdf42af5c7c859dd9dae8ebea13cc'
    }
  ],
  blockNumber: 22,
  confirmations: 1,
  cumulativeGasUsed: BigNumber { _hex: '0x34fef7', _isBigNumber: true },
  status: 1,
  byzantium: true
}
Code:  0x
Error: call revert exception (method="owner()", errorSignature=null, errorArgs=[null], reason=null, code=CALL_EXCEPTION, version=abi/5.0.9)
    at Logger.makeError (/.../ovm-deploy-debug/node_modules/@ethersproject/logger/lib/index.js:179:21)
    at Logger.throwError (/.../ovm-deploy-debug/node_modules/@ethersproject/logger/lib/index.js:188:20)
    at Interface.decodeFunctionResult (/.../ovm-deploy-debug/node_modules/@ethersproject/abi/lib/interface.js:286:23)
    at Contract.<anonymous> (/.../ovm-deploy-debug/node_modules/@ethersproject/contracts/lib/index.js:319:56)
    at step (/.../ovm-deploy-debug/node_modules/@ethersproject/contracts/lib/index.js:46:23)
    at Object.next (/.../ovm-deploy-debug/node_modules/@ethersproject/contracts/lib/index.js:27:53)
    at fulfilled (/.../ovm-deploy-debug/node_modules/@ethersproject/contracts/lib/index.js:18:58)
    at processTicksAndRejections (internal/process/task_queues.js:97:5) {
  reason: null,
  code: 'CALL_EXCEPTION',
  method: 'owner()',
  errorSignature: null,
  errorArgs: [ null ],
  address: '0x89aad3089938F7C0d788b8e102d1124026fa5838',
  args: [],
  transaction: {
    data: '0x8da5cb5b',
    to: '0x89aad3089938F7C0d788b8e102d1124026fa5838',
    from: '0x640e7cc27b750144ED08bA09515F3416A988B6a3'
  }
}
```
