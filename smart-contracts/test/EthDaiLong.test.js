const { contract, accounts } = require('@openzeppelin/test-environment')
const { expectEvent } = require('@openzeppelin/test-helpers')
const {
  ether,
  trackBalance,
  ZERO,
  expectEqualWithinError,
  bnPerc,
  getDetAddr
} = require('./utils/general')
const { takeControlOfOracle } = require('./utils/compound')

const [deployer, user1] = accounts

// Setup Chai for 'expect' or 'should' style assertions (you only need one)
const { BN } = require('bn.js')
const chai = require('chai')
chai.use(require('chai-bn')(BN))
const { expect } = chai

const MalleablePriceOracle = contract.fromArtifact('MalleablePriceOracle')
const EthDaiLong = contract.fromArtifact('EthDaiLong')
const ICEth = contract.fromArtifact('ICEth')
const Debugger = contract.fromArtifact('Debugger')

describe('EthDaiLong', () => {
  before(async () => {
    this.oracleAddr = getDetAddr(deployer, 0)
    await takeControlOfOracle(
      this.oracleAddr,
      '0xc0da01a04c3f3e0be433606045bb7017a7323e38',
      '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b'
    )
  })
  beforeEach(async () => {
    this.priceOracle = await MalleablePriceOracle.new({ from: deployer })
    expect(this.priceOracle.address).to.equal(this.oracleAddr)

    this.debugger = await Debugger.new()
    this.ethDaiLong = await EthDaiLong.new(this.priceOracle.address, { from: deployer })
    this.cEth = await ICEth.at(await this.ethDaiLong.collateralCToken())
  })
  it('mints based on deposit', async () => {
    const leverTokenTracker = await trackBalance(this.ethDaiLong, user1)

    expectEvent(await this.debugger.getEquity(this.ethDaiLong.address), 'EquityFetch', {
      positiveEquity: ZERO,
      negativeEquity: ZERO
    })

    const firstTimeAmount = ether('2')
    await this.ethDaiLong.mint({ from: user1, value: firstTimeAmount })

    let receipt = await this.debugger.getEquity(this.ethDaiLong.address)
    const startEquity = receipt.logs[0].args.positiveEquity
    expectEqualWithinError(firstTimeAmount, startEquity, '10', 'A')
    expect(await leverTokenTracker.delta()).to.be.bignumber.equal(firstTimeAmount, 'B')

    const secondAmount = ether('1.2')
    await this.ethDaiLong.mint({ from: user1, value: secondAmount })

    receipt = await this.debugger.getEquity(this.ethDaiLong.address)
    const newEquity = receipt.logs[0].args.positiveEquity
    expectEqualWithinError(secondAmount, newEquity.sub(startEquity), '10', 'C')
    expectEqualWithinError(await leverTokenTracker.delta(), secondAmount, '10', 'D')
  })
  it('detects rebalance', async () => {
    const inputValue = ether('1')
    expectEvent(await this.ethDaiLong.mint({ from: user1, value: inputValue }), 'PositiveRebalance')
    const ethPrice = await this.priceOracle.price('ETH')
    const daiPrice = await this.priceOracle.price('DAI')
    const borrowAmount = bnPerc(inputValue.mul(ethPrice).div(daiPrice), '50')

    await this.ethDaiLong.doBorrow(borrowAmount)
    let receipt = await this.ethDaiLong.rebalance()
    expectEvent(receipt, 'PositiveRebalance')
    expectEvent.notEmitted(receipt, 'NegativeRebalance')

    await this.priceOracle.setPrice('ETH', bnPerc(ethPrice, '40'))

    receipt = await this.ethDaiLong.rebalance()
    expectEvent(receipt, 'NegativeRebalance')
    expectEvent.notEmitted(receipt, 'PositiveRebalance')
  })
  it('does positive rebalance', async () => {})
})
