import Vuex from 'vuex'
import Vue from 'vue'

import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider'
import { listenTo } from '@/utils/web3'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    provider: null,
    web3: null,
    accounts: [],
    listenerRemovers: {
      accountsChanged: null
    }
  },
  getters: {
    connected({ accounts }) {
      return accounts.length > 0
    },
    mainAccount({ accounts, web3 }, { connected }) {
      if (!connected) return null
      return web3.utils.toChecksumAddress(accounts[0])
    }
  },
  actions: {
    async handleAccountsChanged({ state }, { accounts: newAccounts, messageCb }) {
      const prevAccounts = state.accounts

      if (prevAccounts.length === 0) {
        if (newAccounts.length === 0) {
          messageCb({
            message: 'Error fetching accounts',
            type: 'error'
          })
        } else {
          messageCb({
            message: 'Successfully connected wallet',
            type: 'success'
          })
        }
      } else {
        if (newAccounts.length === 0) {
          messageCb({
            message: 'Your wallet has been disconnected',
            type: 'warning'
          })
        } else if (newAccounts[0] !== prevAccounts[0]) {
          messageCb({
            message: 'Switched account',
            type: 'info'
          })
        }
      }

      state.accounts = newAccounts
    },
    async connect({ state, dispatch }, messageCb) {
      try {
        const accounts = await state.provider.request({ method: 'eth_requestAccounts' })
        await dispatch('handleAccountsChanged', { accounts, messageCb })
      } catch (err) {
        if (err.code === 4001) {
          // 4001: rejected by user
          messageCb({
            message: 'Please connect to MetaMask.',
            type: 'warning'
          })
        } else {
          messageCb({
            message: `Unexpected error while connecting to MetaMask: ${err}`,
            type: 'error'
          })
        }
      }
    },
    async initListeners({ state, dispatch }, messageCb) {
      state.listenerRemovers.accountsChanged = listenTo(
        state.provider,
        'accountsChanged',
        accounts => dispatch('handleAccountsChanged', { accounts, messageCb })
      )
    },
    async initWeb3({ state, dispatch }, messageCb) {
      const provider = await detectEthereumProvider()
      if (!provider) {
        messageCb({
          message: 'Please install MetaMask',
          type: 'warning'
        })
      } else if (provider !== window.ethereum) {
        messageCb({
          message: 'Problem with MetaMask. Do you have multiple wallets installed?',
          type: 'error'
        })
      } else {
        state.provider = provider
        state.web3 = new Web3(provider)
      }

      await dispatch('initListeners', messageCb)
    }
  }
})
