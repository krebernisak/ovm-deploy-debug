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

  const networkArg = process.argv.slice(2)[0] || "local";

  const networks = {
    local: { url: "http://localhost:8545/", port: 420, engine: "ovm" },
    goerli: {
      url: "https://goerli.optimism.io/",
      port: 420,
      engine: "ovm",
    },
    kovan: { url: "https://kovan.optimism.io", port: 69, engine: "ovm" },
  };

  const { url, port, engine, gasPrice } = networks[networkArg];
  console.log("Deploying to: ", networks[networkArg]);
  const provider = new ethers.providers.JsonRpcProvider(url, port);
  const wallet = new ethers.Wallet(key, provider);

  const payload = [
    "0x833916Cc2874408f1f6a68f680F4AE2240c46af9", // link
    "0", // paymentAmount
    "600", // timeout
    "0x0000000000000000000000000000000000000000", // validator
    "10000000", // minSubmissionValue
    "100000000000000", // maxSubmissionValue
    0, // decimals
    "Fast Gas / Gwei", // description
    { gasPrice: gasPrice || 0 },
  ];

  console.log("Deploying with: ", payload);

  const abi = loadJSON(`./abi/v0.6-${engine}/FluxAggregator.json`);
  const factory = loadFactory(abi, wallet);

  const tx = await factory.deploy(...payload);

  const txHash = tx.deployTransaction.hash;
  console.log("Deployed in transaction:", txHash);
  console.log("Will live at address:", tx.address);

  const contract = await tx.deployed();
  console.log("Contract now live at: ", contract.address);

  const txReceipt = await provider.getTransactionReceipt(txHash);
  console.log("Receipt: ", txReceipt);

  // Check if code is stored
  console.log("\nTESTING: code\n--------");
  const code = await provider.getCode(contract.address);
  console.log("Code: ", code);

  // Try to read
  console.log("\nTESTING: read\n--------");
  const owner = await contract.owner();
  console.log("Owner: ", owner);
  const maxSubmissionCountBefore = await contract.maxSubmissionCount();
  console.log("MaxSubmissionCount: ", maxSubmissionCountBefore);

  // Try to write
  console.log("\nTESTING: write\n--------");
  const payload2 = [
    [],
    [
      "0x50D6BDfc451314fB162D7D3322bFB4a005Cf192f",
      "0x2183464128D6f4020cB4c1c908BAE2e87f83214A",
      "0xfF2B320Cf904D78Eae7298ed10EC143C5E7e2314",
      "0x501698a6f6F762C79e4D28E3815C135E3f9Af996",
      "0xC7310123914f624Da9C376f8eC590055e62733c1",
      "0xeE4eD7389A1C565CE7Ba4586D86D049780d2fE5d",
      "0xABbAbB17965310949842323f06EEDE92fD787d0D",
      "0x0699a397c3cf614C9a7Db23a4Be28Fc4c8F3a755",
      "0xCF2D187D3833Dd9063B019D0c39E4566576C3C56",
    ],
    [
      "0x6cDC3Efa3bAa392fAF3E5c1Ca802E15B6185E0e8",
      "0xC8c30Fa803833dD1Fd6DBCDd91Ed0b301EFf87cF",
      "0xDFBfB73f3013bc1584CcAa0CD2D9621194aEd29B",
      "0x7b1660682078fe0eFD9310e8EFe32Cb93a0417bc",
      "0x9efa0A617C0552F1558c95993aA8b8A68b3e709C",
      "0x3b74c27115965ba74D695E3AEdb615F991F3f310",
      "0x1B17eB8FAE3C28CB2463235F9D407b527ba4e6Dd",
      "0x9D219125a0CE10241b4eC1280c2F880475f172f1",
      "0x3FB4600736d306Ee2A89EdF0356D4272fb095768",
    ],
    5,
    9,
    1,
    { gasPrice: gasPrice || 0 },
  ];
  const addOraclesTx = await contract.changeOracles(...payload2);
  console.log("addOraclesTx: ", addOraclesTx);

  const addOraclesReceipt = await addOraclesTx.wait();
  console.log("addOraclesReceipt: ", addOraclesReceipt);

  const maxSubmissionCountAfter = await contract.maxSubmissionCount();
  console.log("MaxSubmissionCount: ", maxSubmissionCountAfter);
};

main().catch((e) => console.error(e));
