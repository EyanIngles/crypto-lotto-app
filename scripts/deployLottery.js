const hre = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), 'ether')
}

async function main() {
  console.log(`Deploying Lottery contract...`);
  const LOTTERY = await hre.ethers.getContractFactory('Lottery');
  const lottery = await LOTTERY.deploy(tokens(100), tokenAddress);

  console.log(`Lottery contract deployed to: ${await lottery.getAddress()}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
