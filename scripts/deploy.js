const hre = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), 'ether')
}

async function main() {
    // Deploy token smart contract.
    console.log(`Deploying BLOT tokens....`);
    const BLOT = await hre.ethers.getContractFactory("Token");
    const blot = await BLOT.deploy(tokens(1e8), 10, 10, '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc', '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc'); //100 million and this is already parsed with 18 decmimals

    const blotAddress = await blot.getAddress();
    console.log(`BLOT token Deployed!!: ${await blot.getAddress()}`);

    // Deploy lottery Smart contract
    console.log(`Deploying Lottery contract...`);
    const LOTTERY = await hre.ethers.getContractFactory('Lottery');
    const lottery = await LOTTERY.deploy(100, blotAddress);

    console.log(`Lottery contract deployed to: ${await lottery.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
