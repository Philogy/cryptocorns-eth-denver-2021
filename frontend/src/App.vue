<template>
  <div id="app">
    <router-view></router-view>
    <h1>App</h1>
    <MetaMaskConnect v-if="!account" />
    <p>counter: {{ counter }}</p>
    <el-button @click="doubleCounter">double</el-button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import detectEthereumProvider from '@metamask/detect-provider'
import MetaMaskConnect from './components/MetaMaskConnect.vue'

export default {
  components: {
    MetaMaskConnect
  },
  computed: {
    ...mapState(['counter', 'provider', 'account'])
  },
  methods: {
    ...mapMutations(['doubleCounter'])
  },
  async mounted() {
    // Detect the MetaMask Ethereum provider
    this.$store.state.provider = await detectEthereumProvider()

    if (this.$store.state.provider) {
      if (this.$store.state.provider !== window.ethereum) {
        console.error('Do you have multiple wallets installed?') //TODO present interface (if provider returned by detectEthereumProvider is not same as window.ethereum, something is overwriting it, perhaps anoter wallet)
      } else {
        console.log('Ethereum provider successfully detected.') //TODO maybe consider a success indicator?
      }
    } else {
      console.warn('Install MetaMask') //TODO present interface
    }

    // Handle chainChanged
    window.ethereum.on('chainChanged', handleChainChanged)
    function handleChainChanged() {
      window.location.reload()
    }

    // Handle user accounts and accountsChanged
    window.ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts) => this.$store.dispatch('handleAccountsChanged', accounts))
      .catch((err) => {
        console.error(err)
      })

    window.ethereum.on('accountsChanged', (accounts) => this.$store.dispatch('handleAccountsChanged', accounts)) //TODO prob change to web3js (don't think this will realise account signed off entirely)
  }
}
</script>
