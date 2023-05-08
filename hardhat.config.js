require("dotenv").config();

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
// require("@nomicfoundation/hardhat-verify");

module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: process.env.url,
      accounts: [process.env.key],
    },
    
  },
  etherscan: {
    apiKey: process.env.apiKey
  }
};