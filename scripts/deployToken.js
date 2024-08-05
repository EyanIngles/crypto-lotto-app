const hre = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), 'ether')
}

async function main() {
    // Deploy token smart contract.
    console.log(`Deploying TreasureToken....`);
    const TOKEN = await hre.ethers.getContractFactory("Token");
    const token = await TOKEN.deploy(1e8, 10, 10, '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc', '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc'); //100 million and this is already parsed with 18 decmimals

    const tokenAddress = await token.getAddress();
    console.log(` token Deployed!!: ${tokenAddress}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
