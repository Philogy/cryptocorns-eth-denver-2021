const { accounts, contract, web3 } = require('@openzeppelin/test-environment')
const [main] = accounts
const { ether } = require('./utils')

// Setup Chai for 'expect' or 'should' style assertions (you only need one)
const { BN } = require('bn.js')
const chai = require('chai')
chai.use(require('chai-bn')(BN))
const { expect } = chai

const TestERC20 = contract.fromArtifact('TestERC20')

describe('ERC20', () => {
  it('something', async () => {
    const token = await TestERC20.new({ from: main })
    expect(await token.balanceOf(main)).to.be.bignumber.equal(ether('1000'))
  })
})
