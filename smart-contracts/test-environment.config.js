const secrets = require('./secrets')
const { compWhale, ethWhale } = require('./globals')

module.exports = {
  accounts: {
    amount: 10,
    ether: 100
  },
  node: {
    fork: secrets['infura-endpoint'],
    unlocked_accounts: [compWhale, ethWhale]
  }
}
