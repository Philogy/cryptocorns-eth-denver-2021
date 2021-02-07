const { contract, accounts } = require('@openzeppelin/test-environment')
const { expectEvent } = require('@openzeppelin/test-helpers')
const { ether, bnPerc, ZERO, expectEqualWithinError } = require('./utils/general')
const { takeControlOfOracle, expectAccountLiquidity } = require('./utils/compound')
const { ethWhale } = require('../globals')
const contractDebugger = require('./utils/debug')

const [deployer, user1] = accounts

// Setup Chai for 'expect' or 'should' style assertions (you only need one)
const { BN } = require('bn.js')
const chai = require('chai')
chai.use(require('chai-bn')(BN))
const { expect } = chai

const MalleablePriceOracle = contract.fromArtifact('MalleablePriceOracle')
const EthDaiLong = contract.fromArtifact('EthDaiLong')
const IComptroller = contract.fromArtifact('IComptroller')
const PriceDumper = contract.fromArtifact('PriceDumper')
const Debugger = contract.fromArtifact('Debugger')

describe('EthDaiLong (requiring takeover)', () => {
  before(async () => {
    this.priceOracle = await MalleablePriceOracle.new({ from: deployer })
    this.comptroller = await IComptroller.at('0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b')
    await takeControlOfOracle(
      this.priceOracle.address,
      '0xc0da01a04c3f3e0be433606045bb7017a7323e38',
      this.comptroller.address
    )
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
  it('rebalances after price drop', async () => {
    const mintAmount = ether('1')
    let receipt = await this.ethDaiLong.mint({ from: user1, value: mintAmount })
    expectEvent(receipt, 'Rebalance', { positive: true })
    const currentEthPrice = await this.ethDaiLong.getEthPrice()

    await expectAccountLiquidity(this.comptroller, this.ethDaiLong.address, true)

    await this.priceOracle.setPrice('ETH', bnPerc(currentEthPrice, '80'))
    const priceDumper = await PriceDumper.new()
    await priceDumper.dumpPair(await this.ethDaiLong.tokenPair(), new BN('118'), {
      from: ethWhale,
      value: ether('10000')
    })
    await expectAccountLiquidity(this.comptroller, this.ethDaiLong.address, false)

    receipt = await this.ethDaiLong.rebalance()
    const TARGET_RATIO = await this.ethDaiLong.TARGET_RATIO()
    const [{ args: rebalance }] = receipt.logs.filter(({ event }) => event === 'Rebalance')

    expect(rebalance.positive).to.be.false
    expectEqualWithinError(
      rebalance.toRatio,
      TARGET_RATIO,
      new BN('10000'),
      `Out of bounds, target: ${TARGET_RATIO.toString()}   actual: ${rebalance.toRatio.toString()}`
    )

    await expectAccountLiquidity(this.comptroller, this.ethDaiLong.address, true)
  })
})
