const { BN } = require('bn.js')
const { web3 } = require('@openzeppelin/test-environment')
const rlp = require('rlp')
const keccak = require('keccak')

const ZERO = new BN('0')
const bnSum = (...nums) => nums.reduce((x, y) => x.add(y), ZERO)
const encodeFunctionCall = (contract, method, args) => {
  return contract.contract.methods[method](...args).encodeABI()
}
const ether = (wei) => new BN(web3.utils.toWei(wei.toString()))
const bnPerc = (num, perc) => num.mul(new BN(perc)).div(new BN('100'))
const getDetAddr = (addr, nonce) => {
  const rlpEncoded = rlp.encode([addr, nonce])
  const resHash = keccak('keccak256').update(rlpEncoded).digest('hex')

  const contractAddr = `0x${resHash.substring(24)}`
  return web3.utils.toChecksumAddress(contractAddr)
}

const getTxNonce = async (txId) => {
  const tx = await web3.eth.getTransaction(txId)
  return tx.nonce
}

class _BalanceTracker {
  constructor(token, address) {
    this.token = token
    this.address = address
    this.prev = ZERO
  }

  async _get() {
    if (this.token === null) return await web3.eth.getBalance(this.address)
    return await this.token.balanceOf(this.address)
  }

  async get(resetPrev = true) {
    const balance = await this._get()

    if (resetPrev) this.prev = balance
    return balance
  }

  async delta(resetPrev = true) {
    const balance = await this._get()

    const difference = balance.sub(this.prev)
    if (resetPrev) this.prev = balance

    return difference
  }
}

const trackBalance = async (token, address, setPrev = true) => {
  const balanceTracker = new _BalanceTracker(token, address)
  if (setPrev) balanceTracker.prev = await balanceTracker._get()
  return balanceTracker
}

module.exports = {
  ZERO,
  bnSum,
  encodeFunctionCall,
  ether,
  bnPerc,
  getDetAddr,
  getTxNonce,
  trackBalance
}
