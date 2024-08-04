require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()



/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url:`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API}`,
      accounts: [process.env.PRIVATE_KEY1, process.env.PRIVATE_KEY2],
      gas: 2100000,
      gasPrice: 8000000000,
      saveDeployments: true,

    },
    localhost: {
      url: "http://localhost:8545",
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY
    }
  }
}

