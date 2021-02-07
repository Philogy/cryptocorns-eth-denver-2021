<template>
  <div id="app">
    <router-view></router-view>
    <h1>App</h1>
    <MetaMaskConnect v-if="!account" />
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
    ...mapState(['provider', 'account'])
  },
  methods: {
    ...mapMutations([])
  },
  async mounted() {
    // Detect the MetaMask Ethereum provider
    this.$store.state.provider = await detectEthereumProvider()

    if (this.$store.state.provider) {
      if (this.$store.state.provider !== window.ethereum) {
        this.$message({
          message: 'Problem with MetaMask. Do you have multiple wallets installed?',
          type: 'error'
        })
      } else {
        // Ethereum provider detected
      }
    } else {
      this.$message({
        message: 'Please install MetaMask',
        type: 'warning'
      })
    }


    // Handle chainChanged
    window.ethereum.on('chainChanged', handleChainChanged)
    function handleChainChanged() {
      window.location.reload()
    }

    // Handle user accounts and accountsChanged
    window.ethereum
      .request({ method: 'eth_accounts' })
      .then(accounts => this.$store.dispatch('handleAccountsChanged', accounts))
      .catch(err => {
        console.error(err)
      })

    window.ethereum.on('accountsChanged', accounts =>
      this.$store.dispatch('handleAccountsChanged', accounts)
    )


  }
}
</script>
