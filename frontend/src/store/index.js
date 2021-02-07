import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counter: 1,
    provider: null,
    account: null
  },
  mutations: {
    doubleCounter(state) {
      state.counter *= 2
    }
  },
  actions: {
    async connect({ dispatch }) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        dispatch('handleAccountsChanged', accounts)
      } catch (err) {
        if (err.code === 4001) {
          console.log('Connect to MetaMask.') //TODO interface
        } else {
          console.error(err) //TODO interface
        }
      }
    },
    handleAccountsChanged({ state }, accounts) {
      if (accounts.length === 0) {
        console.log('MetaMask is locked or user has not connected any accounts') // TODO "Please connect to MetaMask"
      } else if (accounts[0] !== state.account) {
        console.log('accounts....', accounts)
        state.account = accounts[0]
        console.log('state.account...', state.account)
      }
    }
  }
})
