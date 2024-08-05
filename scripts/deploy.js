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

    // Deploy lottery Smart contract
    console.log(`Deploying Lottery contract...`);
    const LOTTERY = await hre.ethers.getContractFactory('Lottery');
    const lottery = await LOTTERY.deploy(tokens(100), tokenAddress);

    console.log(`Lottery contract deployed to: ${await lottery.getAddress()}`);

    console.log(`Deploying customERC20 contract....`);
    const CUSTERC20 = await hre.ethers.getContractFactory("CustomERC20");
    const custERC20 = await CUSTERC20.deploy("customERC20", "CERC");
//
    const custERC20Address = await custERC20.getAddress();
    console.log(`custom ERC20 token Deployed!!: ${custERC20Address}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
