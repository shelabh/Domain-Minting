const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("SoloDraft", () => {
  let soloDraft
  let deployer, owner1

  const NAME = "Solo Draft"
  const SYMBOL = "SD"

  beforeEach(async () => {
    // Setup accounts
    [deployer, owner1] = await ethers.getSigners()

    // Deploy contract
    const SoloDraft = await ethers.getContractFactory("SoloDraft")
    soloDraft = await SoloDraft.deploy(NAME, SYMBOL)

    // List a domain
    const transaction = await soloDraft.connect(deployer).list(".lagos", tokens(10))
    await transaction.wait()
  })

  describe("Deployment", () => {
    it("Sets the name", async () => {
      const result = await soloDraft.name()
      expect(result).to.equal(NAME)
    })

    it("Sets the symbol", async () => {
      const result = await soloDraft.symbol()
      expect(result).to.equal(SYMBOL)
    })

    it("Sets the owner", async () => {
      const result = await soloDraft.owner()
      expect(result).to.equal(deployer.address)
    })

    it("Returns the max supply", async () => {
      const result = await soloDraft.maxSupply()
      expect(result).to.equal(1)
    })

    it("Returns the total supply", async () => {
      const result = await soloDraft.totalSupply()
      expect(result).to.equal(0)
    })
  })

  describe("Domain", () => {
    it('Returns domain attributes', async () => {
      const domain = await soloDraft.getDomain(1)
      expect(domain.name).to.be.equal(".lagos")
      expect(domain.cost).to.be.equal(tokens(10))
      expect(domain.isOwned).to.be.equal(false)
    })
  })

  describe("Minting", () => {
    const ID = 1
    const AMOUNT = ethers.utils.parseUnits("10", 'ether')

    beforeEach(async () => {
      const transaction = await soloDraft.connect(owner1).mint(ID, { value: AMOUNT })
      await transaction.wait()
    })

    it('Updates the owner', async () => {
      const owner = await soloDraft.ownerOf(ID)
      expect(owner).to.be.equal(owner1.address)
    })

    it('Updates the domain status', async () => {
      const domain = await soloDraft.getDomain(ID)
      expect(domain.isOwned).to.be.equal(true)
    })

    it('Updates the contract balance', async () => {
      const result = await soloDraft.getBalance()
      expect(result).to.be.equal(AMOUNT)
    })
  })

  describe("Withdrawing", () => {
    const ID = 1
    const AMOUNT = ethers.utils.parseUnits("10", 'ether')
    let balanceBefore

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      let transaction = await soloDraft.connect(owner1).mint(ID, { value: AMOUNT })
      await transaction.wait()

      transaction = await soloDraft.connect(deployer).withdraw()
      await transaction.wait()
    })

    it('Updates the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it('Updates the contract balance', async () => {
      const result = await soloDraft.getBalance()
      expect(result).to.equal(0)
    })
  })
})