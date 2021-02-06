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
    connect({ dispatch }) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => dispatch('handleAccountsChanged', accounts))
        .catch((err) => {
          if (err.code === 4001) {
            console.log('Connect to MetaMask.') //TODO interface
          } else {
            console.error(err) //TODO interface
          }
        })
    },
    handleAccountsChanged({ state }, accounts) {
      if (accounts.length === 0) {
        console.log('MetaMask is locked or user has not connected any accounts') // TODO "Please connect to MetaMask"
      } else if (accounts[0] !== state.account) {
        state.account = accounts[0]
      }
    }
  }
})
