// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const config = require('../src/components/abis/config.json');

const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
}

async function main() {

    console.log(`Fetching accounts and network details... \n`)
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]


    //Fetch network
    const { chainId } =  await ethers.provider.getNetwork()
    console.log(`Fetching token and transferring to accounts \n`)

    const lottery = await ethers.getContractAt('Token', config[chainId].lottery.address)
    console.log(`lottery data fetched: ${await lottery.getAddress()} \n`)

    const blot = await ethers.getContractAt('Token', config[chainId].BLOT.address)
    console.log(`blot token fetched: ${await blot.getAddress()} \n`)


    let transaction, tokenMinting

    transaction = await blot.connect(deployer).transfer(await lottery.getAddress(), tokens(1000))
    await transaction.wait()

  console.log(`Finished! \n`)
}


// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
