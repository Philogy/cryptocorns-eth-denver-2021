const { contract, accounts } = require('@openzeppelin/test-environment')
const {
  expectEvent,
  constants: { ZERO_ADDRESS }
} = require('@openzeppelin/test-helpers')
const {
  ether,
  ZERO,
  expectEqualWithinError,
  expectEqualWithinPrecision,
  trackBalance,
  bnPerc
} = require('./utils/general')
const contractDebugger = require('./utils/debug')

const [deployer, user1] = accounts

// Setup Chai for 'expect' or 'should' style assertions (you only need one)
const { BN } = require('bn.js')
const chai = require('chai')
chai.use(require('chai-bn')(BN))
const { expect } = chai

const MalleablePriceOracle = contract.fromArtifact('MalleablePriceOracle')
const EthDaiLong = contract.fromArtifact('EthDaiLong')
const Debugger = contract.fromArtifact('Debugger')

describe('EthDaiLong', () => {
  before(async () => {
    this.priceOracle = await MalleablePriceOracle.new({ from: deployer })
    contractDebugger.use(await Debugger.new())
  })
  beforeEach(async () => {
    await this.priceOracle.resetPrice('DAI')
    await this.priceOracle.resetPrice('ETH')

    this.ethDaiLong = await EthDaiLong.new(
      this.priceOracle.address,
      '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11',
      { from: deployer }
    )
  })
  it('can mint and redeem', async () => {
    const mintAmount = ether('1')
    const leverBalUser1 = await trackBalance(this.ethDaiLong, user1)
    const ethBalUser1 = await trackBalance(null, user1)

    let receipt = await this.ethDaiLong.mint({ from: user1, value: mintAmount })

    const perc = bnPerc(mintAmount, '3')

    expectEqualWithinError(await ethBalUser1.delta(), mintAmount.neg(), perc)
    expect(await leverBalUser1.delta()).to.be.bignumber.equal(mintAmount)
    expectEvent(receipt, 'Transfer', { from: ZERO_ADDRESS, to: user1, value: mintAmount })

    const TARGET_RATIO = await this.ethDaiLong.TARGET_RATIO()
    const [{ args: rebalance }] = receipt.logs.filter(({ event }) => event === 'Rebalance')

    expect(rebalance.positive).to.be.true
    expect(rebalance.fromRatio).to.be.bignumber.equal(ZERO)
    expectEqualWithinError(
      rebalance.toRatio,
      TARGET_RATIO,
      new BN('10000'),
      `Out of bounds, target: ${TARGET_RATIO.toString()}   actual: ${rebalance.toRatio.toString()}`
    )

    expect(await this.ethDaiLong.totalSupply()).to.be.bignumber.equal(mintAmount)

    receipt = await this.ethDaiLong.redeem(mintAmount, { from: user1 })
    expectEvent(receipt, 'Transfer', { from: user1, to: ZERO_ADDRESS, value: mintAmount })
    expect(await leverBalUser1.delta()).to.be.bignumber.equal(mintAmount.neg())
    expectEqualWithinError(await ethBalUser1.delta(), mintAmount, bnPerc(mintAmount, '4'))

    const {
      result: { 0: debt }
    } = await contractDebugger.getReturnData(this.ethDaiLong, 'getUnderlyingDebt', [], {
      from: user1
    })
    const {
      result: { 0: collat }
    } = await contractDebugger.getReturnData(this.ethDaiLong, 'getUnderlyingCollateral', [], {
      from: user1
    })

    expect(debt).to.be.bignumber.equal(ZERO, 'Leftover debt should be zero')
    expectEqualWithinPrecision(
      new BN(collat),
      ZERO,
      '9',
      'Leftover collateral should be almost zero'
    )
  })
})
