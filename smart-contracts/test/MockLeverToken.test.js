const { contract, accounts } = require('@openzeppelin/test-environment')
const {
  constants: { ZERO_ADDRESS }
} = require('@openzeppelin/test-helpers')

const { ether, bnPerc } = require('./utils/general')

const [deployer, user1] = accounts

// Setup Chai for 'expect' or 'should' style assertions (you only need one)
const { BN } = require('bn.js')
const chai = require('chai')
chai.use(require('chai-bn')(BN))
const { expect } = chai

const MockLeverToken = contract.fromArtifact('MockLeverToken')
const MockERC20 = contract.fromArtifact('MockERC20')
const BasicPriceOracle = contract.fromArtifact('BasicPriceOracle')

describe('Mock Lever Token', () => {
  beforeEach(async () => {
    this.token = await MockERC20.new('Dai stablecoin', 'DAI')
    this.oracle = await BasicPriceOracle.new()
    this.leverToken = await MockLeverToken.new(
      'ETH-DAI 3x long',
      'longETH',
      this.token.address,
      this.oracle.address,
      new BN('666667')
    )
  })
  it('can mint', async () => {
    const ethPrice = new BN('1780000000')
    await this.oracle.setPrice(ZERO_ADDRESS, ethPrice)
    await this.oracle.setPrice(this.token.address, new BN('1000000'))

    const mintAmount = ether('1')
    await this.leverToken.mint({ from: user1, value: mintAmount })

    expect(await this.leverToken.balanceOf(user1)).to.be.bignumber.equal(mintAmount)

    await this.oracle.setPrice(ZERO_ADDRESS, bnPerc(ethPrice, '95'))

    await this.leverToken.redeem(mintAmount, { from: user1 })
  })
})
