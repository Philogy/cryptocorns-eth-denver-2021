const { contract, accounts } = require('@openzeppelin/test-environment')
const { time, send } = require('@openzeppelin/test-helpers')
const { compWhale } = require('../../globals')
const { ZERO, encodeFunctionCall, ether } = require('./general')
const { expect } = require('chai')

const helper = accounts[9]

const IComptroller = contract.fromArtifact('IComptroller')
const IGovernance = contract.fromArtifact('IGovernance')
const IComp = contract.fromArtifact('IComp')

const takeControlOfOracle = async (newOracleAddress, governanceAddress, comptrollerAddress) => {
  const governance = await IGovernance.at(governanceAddress)
  const comptroller = await IComptroller.at(comptrollerAddress)
  const compToken = await IComp.at(await governance.comp())
  const callData = encodeFunctionCall(comptroller, '_setPriceOracle', [newOracleAddress])

  await send.ether(helper, compWhale, ether('0.1'))
  await compToken.delegate(helper, { from: compWhale })

  const receipt = await governance.propose(
    [comptrollerAddress],
    [ZERO],
    [''],
    [callData],
    'price oracle update',
    { from: helper }
  )
  const proposalId = receipt.logs[0].args.id
  await time.advanceBlock()
  await governance.castVote(proposalId, true, { from: helper })

  const forwards = (await governance.votingPeriod()).toNumber()

  const before = Date.now()
  for (let i = 0; i < forwards; i++) {
    if (i % 1000 === 0) console.log('i: ', i)
    await time.advanceBlock()
  }
  const after = Date.now()
  console.log(`took: ${(after - before) / 1000}s`)

  await governance.queue(proposalId)

  await time.increase(time.duration.days(2))
  await governance.execute(proposalId)

  expect(await comptroller.oracle()).to.equal(newOracleAddress)
}

module.exports = { takeControlOfOracle }
