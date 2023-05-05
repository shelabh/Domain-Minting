require("dotenv").config();

import"@nomiclabs/hardhat-waffle";
import"@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-verify";

module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: process.env.url,
      accounts: [process.env.key]
    }
  },
  etherscan: {
    apiKey: process.env.apiKey
  }
};