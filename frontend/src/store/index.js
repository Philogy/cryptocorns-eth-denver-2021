import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    provider: null,
    account: null
  },
  mutations: {
  },
  actions: {
    async connect({ dispatch }) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        dispatch('handleAccountsChanged', accounts)
      } catch (err) {
        if (err.code === 4001) { // 4001: rejected by user
          this.$message({
            message: 'Please connect to MetaMask.',
            type: 'warning'
          })
        } else {
          this.$message({
            message: 'Error connecting to MetaMask.',
            type: 'error'
          })
          console.error(err)
        }
      }
    },
    async handleAccountsChanged({ state }, accounts) {
      if (accounts.length === 0) { // MetaMask is locked or user has not connected any accounts
        this.$message({
          message: 'Please connect to MetaMask',
          type: 'warning'
        })
      } else if (accounts[0] !== state.account) {
        state.account = await accounts[0]
      }
    }
  }
})
