const { contract, accounts } = require('@openzeppelin/test-environment')
const { ether, trackBalance } = require('./utils')

const [deployer, user1] = accounts

// Setup Chai for 'expect' or 'should' style assertions (you only need one)
const { BN } = require('bn.js')
const chai = require('chai')
chai.use(require('chai-bn')(BN))

const ICEth = contract.fromArtifact('ICEth')
const EthDaiLong = contract.fromArtifact('EthDaiLong')

describe('EthDaiLong', () => {
  beforeEach(async () => {
    this.ethDaiLong = await EthDaiLong.new({ from: deployer })
    this.cEth = await ICEth.at(await this.ethDaiLong.underlyingCToken())
  })
  it('mints based on deposit', async () => {
    const cTokenTracker = await trackBalance(this.cEth, this.ethDaiLong.address)

    console.log(
      'await this.cEth.exchangeRateStored(): ',
      await this.cEth.exchangeRateStored().toString()
    )
    await this.ethDaiLong.mint({ from: user1, value: ether('2') })

    const diff = await cTokenTracker.delta()
    console.log('diff: ', diff.toString())
  })
})
