const { encodeFunctionCall } = require('./general')
const { web3 } = require('@openzeppelin/test-environment')

const debuggerObj = {
  debugContract: null,
  use(debugContract) {
    this.debugContract = debugContract
  },
  async getReturnData(contract, method, args, sendData) {
    const callData = encodeFunctionCall(contract, method, args)
    const [{ outputs }] = contract.abi.filter(({ name }) => name === method)

    const receipt = await this.debugContract.getReturnData(contract.address, callData, sendData)
    const data = receipt.logs[0].args.data

    return {
      receipt,
      result: web3.eth.abi.decodeParameters(outputs, data)
    }
  }
}

module.exports = debuggerObj
