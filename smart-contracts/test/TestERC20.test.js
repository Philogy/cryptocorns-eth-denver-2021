const { contract } = require('@openzeppelin/test-environment')

// Setup Chai for 'expect' or 'should' style assertions (you only need one)
const { BN } = require('bn.js')
const chai = require('chai')
chai.use(require('chai-bn')(BN))

const ERC20 = contract.fromArtifact('ERC20')

describe('ERC20', () => {
  it('something', async () => {
    const dai = await ERC20.at('0x6b175474e89094c44da98b954eedeac495271d0f')
    console.log('await dai.name(): ', await dai.name())
  })
})
