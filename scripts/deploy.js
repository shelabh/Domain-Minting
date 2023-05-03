// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
  // Setup accounts & variables
  const [deployer] = await ethers.getSigners()
  const NAME = "Solo Draft"
  const SYMBOL = "SD"

  // Deploy contract
  const SoloDraft = await ethers.getContractFactory("SoloDraft")
  const soloDraft = await SoloDraft.deploy(NAME, SYMBOL)
  await soloDraft.deployed();

  console.log(`Deployed Domain Contract at: ${soloDraft.address}\n`)

  // List 11 domains
  const names = [".lagos", ".uyo", ".abuja", ".ibom", ".kano", ".aba", ".jos", ".warri", ".calabar", ".oyo", ".30bg"]
  const costs = [tokens(10), tokens(25), tokens(15), tokens(2.5), tokens(3), tokens(1), tokens(5), tokens(13), tokens(8), tokens(22), tokens(2)]

  for (var i = 0; i < 11; i++) {
    const transaction = await soloDraft.connect(deployer).list(names[i], costs[i])
    await transaction.wait()

    console.log(`Listed Domain ${i + 1}: ${names[i]}`)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});