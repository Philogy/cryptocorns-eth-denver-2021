const { contract, accounts } = require('@openzeppelin/test-environment')
const { ether } = require('./utils/general')

const [deployer, user1] = accounts

// Setup Chai for 'expect' or 'should' style assertions (you only need one)
const { BN } = require('bn.js')
const chai = require('chai')
chai.use(require('chai-bn')(BN))

const MalleablePriceOracle = contract.fromArtifact('MalleablePriceOracle')
const EthDaiLong = contract.fromArtifact('EthDaiLong')

describe('EthDaiLong', () => {
  before(async () => {
    this.priceOracle = await MalleablePriceOracle.new({ from: deployer })
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
  it('simple test', async () => {
    const mintAmount = ether('1')
    let receipt = await this.ethDaiLong.mint({ from: user1, value: mintAmount })
    const [{ args: rebalance }] = receipt.logs.filter(({ event }) => event === 'Rebalance')
    console.log('rebalance.positive: ', rebalance.positive)
    console.log('rebalance.fromRatio.toString(): ', rebalance.fromRatio.toString())
    console.log('rebalance.toRatio.toString(): ', rebalance.toRatio.toString())
  })
})
