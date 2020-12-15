const { ethers } = require("ethers");
const { existsSync, readFileSync } = require("fs");
const { join } = require("path");

const loadJSON = (path) => {
  const cwd = process.cwd();
  const absPath = join(cwd, path);

  const found = existsSync(absPath);
  if (!found) throw new Error(`File ${absPath} not found`);

  const buffer = readFileSync(absPath);
  return JSON.parse(buffer.toString());
};

const loadFactory = (abi, signer) => {
  return new ethers.ContractFactory(
    abi.compilerOutput.abi,
    abi.compilerOutput.evm.bytecode,
    signer
  );
};

const main = async () => {
  const key =
    "0xea8b000efb33c49d819e8d6452f681eed55cdf7de47d655887fc0e318906f2e7";
  const url = "http://localhost:8545/";
  const provider = new ethers.providers.JsonRpcProvider(url, 420);
  const wallet = new ethers.Wallet(key, provider);

  const payload = [
    ethers.constants.AddressZero, // link
    1, // paymentAmount
    100, // timeout
    ethers.constants.AddressZero, // validator
    2, // minSubmissionValue
    4, // maxSubmissionValue
    42, // decimals
    "Test 4.20", // description
    { gasPrice: 0 },
  ];
  console.log("Deploying with: ", payload);

  const abi = loadJSON("./abi/FluxAggregator.json");
  const factory = loadFactory(abi, wallet);

  const tx = await factory.deploy(...payload);

  const txHash = tx.deployTransaction.hash;
  console.log("Deployed in transaction:", txHash);
  console.log("Will live at address:", tx.address);

  const contract = await tx.deployed();
  console.log("Contract now live at: ", contract.address);

  const txReceipt = await provider.getTransactionReceipt(txHash);
  console.log("Receipt: ", txReceipt);

  const code = await provider.getCode(contract.address);
  console.log("Code: ", code);

  const owner = await contract.owner();
  console.log("Owner: ", owner);
};

main().catch((e) => console.error(e));
