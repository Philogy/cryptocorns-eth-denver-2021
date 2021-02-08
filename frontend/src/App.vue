<template>
  <div id="app" class="m-0 text-white">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'

export default {
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

    const web3 = new Web3(this.$store.state.provider)

    // Handle chainChanged //FIX? issue with reload on Brave (fine on Firefox)
    // window.ethereum.on('chainChanged', handleChainChanged)
    // function handleChainChanged() {
    //   window.location.reload()
    // }

    // Handle user accounts and accountsChanged
    window.ethereum
      .request({ method: 'eth_accounts' })
      .then(accounts => this.$store.dispatch('handleAccountsChanged', accounts))
      .catch(err => {
        console.error(err)
      })

    let accountInterval = setInterval(async () => {
      let currentAccounts = await web3.eth.getAccounts()
      if (this.account !== currentAccounts[0]) {
        this.$store.state.account = currentAccounts[0]
      }
    }, 1200)
    accountInterval
  }
}
</script>

<style src="./assets/index.css"></style>
