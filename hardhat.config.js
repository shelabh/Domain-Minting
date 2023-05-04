require("dotenv").config();

require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: process.env.url,
      accounts: [process.env.key]
    }
  }
};