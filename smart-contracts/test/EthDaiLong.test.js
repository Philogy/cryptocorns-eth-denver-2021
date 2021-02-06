const { contract, accounts } = require('@openzeppelin/test-environment')
const { expectEvent } = require('@openzeppelin/test-helpers')
const { ether, trackBalance, ZERO, expectEqualWithinError } = require('./utils')

const [deployer, user1] = accounts

// Setup Chai for 'expect' or 'should' style assertions (you only need one)
const { BN } = require('bn.js')
const chai = require('chai')
chai.use(require('chai-bn')(BN))
const { expect } = chai

const ICEth = contract.fromArtifact('ICEth')
const EthDaiLong = contract.fromArtifact('EthDaiLong')
const Debugger = contract.fromArtifact('Debugger')

describe('EthDaiLong', () => {
  beforeEach(async () => {
    this.debugger = await Debugger.new()

    this.ethDaiLong = await EthDaiLong.new({ from: deployer })
    this.cEth = await ICEth.at(await this.ethDaiLong.collateralCToken())
  })
  it('mints based on deposit', async () => {
    const leverTokenTracker = await trackBalance(this.ethDaiLong, user1)

    expectEvent(await this.debugger.getEquity(this.ethDaiLong.address), 'EquityFetch', {
      equity: ZERO
    })

    const firstTimeAmount = ether('2')
    await this.ethDaiLong.mint({ from: user1, value: firstTimeAmount })

    let receipt = await this.debugger.getEquity(this.ethDaiLong.address)
    const startEquity = receipt.logs[0].args.equity
    expectEqualWithinError(firstTimeAmount, startEquity, '10', 'A')
    expect(await leverTokenTracker.delta()).to.be.bignumber.equal(firstTimeAmount, 'B')

    const secondAmount = ether('1.2')
    await this.ethDaiLong.mint({ from: user1, value: secondAmount })

    receipt = await this.debugger.getEquity(this.ethDaiLong.address)
    const newEquity = receipt.logs[0].args.equity
    expectEqualWithinError(secondAmount, newEquity.sub(startEquity), '10', 'C')
    expectEqualWithinError(await leverTokenTracker.delta(), secondAmount, '10', 'D')
  })
})
