const secrets = require('./secrets')

module.exports = {
  accounts: {
    amount: 10,
    ether: 100
  },
  node: {
    fork: secrets['infura-endpoint']
  }
}
