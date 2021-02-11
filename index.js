const { ethers } = require("ethers");
const assert = require("assert");
const { Median__factory } = require("./contracts/Median__factory");
const {
  FluxAggregator__factory,
} = require("./contracts/FluxAggregator__factory");
const {
  AccessControlledAggregator__factory,
} = require("./contracts/AccessControlledAggregator__factory");

const deployLibraries = async (wallet) => {
  // Deploy Median
  const medianTx = await new Median__factory(wallet).deploy([]);
  const medianContract = await medianTx.deployed();
  console.log("Median contract now live at: ", medianContract.address);

  return {
    "/Users/krebernisak/Documents/workspace/work/chainlink/code/chainlink-optimism/evm-contracts/src/v0.6-ovm/Median.sol:Median":
      medianContract.address,
  };
};

const main = async () => {
  const key =
    "0xea8b000efb33c49d819e8d6452f681eed55cdf7de47d655887fc0e318906f2e7";

  const networkArg = process.argv.slice(2)[0] || "local";

  const networks = {
    local: { url: "http://localhost:8545/", id: 420 },
    goerli: { url: "https://goerli.optimism.io/", id: 420 },
    kovan: { url: "https://kovan.optimism.io", id: 69 },
  };

  const { url, id, gasPrice } = networks[networkArg];
  console.log("Deploying to: ", networks[networkArg]);
  const provider = new ethers.providers.JsonRpcProvider(url, id);
  const wallet = new ethers.Wallet(key, provider);

  const options = { gasPrice: gasPrice || 0, gasLimit: 8999999 };

  const _finishAndCheckDeploy = async (tx) => {
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

    return contract;
  };

  const _deploy = async (factory, payload) => {
    console.log("Deploying with: ", payload);
    const tx = await factory.deploy(...payload);
    return await _finishAndCheckDeploy(tx);
  };

  const _deployFA = async () => {
    const linkLibraryAddresses = await deployLibraries(wallet);
    console.log(linkLibraryAddresses);

    const factory = new FluxAggregator__factory(linkLibraryAddresses, wallet);

    const payload = [options];
    return await _deploy(factory, payload);
  };

  const _deployACA = async (faAddr) => {
    const factory = new AccessControlledAggregator__factory(wallet);

    const payload = [faAddr, options];
    return await _deploy(factory, payload);
  };

  const _init = async (contract) => {
    const payload = [
      "0x833916Cc2874408f1f6a68f680F4AE2240c46af9", // link
      "0", // paymentAmount
      "600", // timeout
      "0x0000000000000000000000000000000000000000", // validator
      "10000000", // minSubmissionValue
      "100000000000000", // maxSubmissionValue
      0, // decimals
      "Fast Gas / Gwei", // description
      options,
    ];
    console.log("Initializing with: ", payload);

    const initTx = await contract.init(...payload);
    console.log("initTx: ", initTx);

    const initTxReceipt = await initTx.wait();
    console.log("initTxReceipt: ", initTxReceipt);
  };

  const faContract = await _deployFA();
  const acaContract = await _deployACA(faContract.address);
  const contract = new ethers.Contract(
    acaContract.address,
    faContract.interface,
    wallet
  );
  await _init(contract);

  // Try to read
  console.log("\nTESTING: read\n--------");
  const owner = await contract.owner();
  console.log("Owner: ", owner);

  const maxSubmissionValue = await contract.maxSubmissionValue();
  console.log("maxSubmissionValue: ", maxSubmissionValue.toString());

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

  // Check access

  try {
    await contract.latestAnswer();
    assert(false);
  } catch (err) {
    console.log("Access blocked: ", err);
  }

  const addAccessTx = await acaContract.addAccess(wallet.address);
  console.log("addAccessTx: ", addOraclesTx);

  const addAccessTxReceipt = await addAccessTx.wait();
  console.log("addAccessTxReceipt: ", addAccessTxReceipt);

  const latestAnswer = await contract.latestAnswer();
  console.log("latestAnswer: ", latestAnswer);

  const description = await contract.description();
  console.log("description: ", description);
};

main().catch((e) => console.error(e));
