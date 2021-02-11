<template>
  <div class="h-full w-full bg-tgray-700 rounded-2xl p-2 overflow-hidden">
    <div class="h-1/5 px-4 flex items-center justify-between mr-6">
      <div class="flex items-center">
        <coin-pair
          :tokenA="token.primary"
          :tokenB="token.secondary"
          class="w-18 h-12 mr-4"
        ></coin-pair>
        <h1 class="text-2xl font-normal">{{ token.desc }}</h1>
      </div>
      <div id="redeem-mint-buttons" class="space-x-12">
        <el-button type="primary" @click="createTokens">Create</el-button>
        <el-button type="primary" @click="redeemTokens">Redeem</el-button>
      </div>
    </div>
    <hr class="border-tgray-500" />
    <div class="h-full px-4 py-8 flex flex-wrap content-start">
      <div class="stat-display">
        <span class="label">Total Equity</span>
        <span class="info">2,384 ETH</span>
      </div>
      <div class="stat-display">
        <span class="label">Equity / Token</span>
        <span class="info">1.105 ETH</span>
      </div>
      <div class="stat-display">
        <span class="label">Current Price / Token</span>
        <span class="info">2432.5 USD</span>
      </div>
      <div class="stat-display">
        <span class="label">Leverage</span>
        <span class="info">{{ token.leverage }}x</span>
      </div>
      <div class="stat-display">
        <span class="label">Debt Token</span>
        <span class="info">{{ token.debt }}</span>
      </div>
      <div class="stat-display">
        <span class="label">Collateral Token</span>
        <span class="info">{{ token.collat }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import CoinPair from '@/components/CoinPair'
import { getLeverTokens } from '@/utils/tokens'
import axios from 'axios'

export default {
  components: { CoinPair },
  data: () => ({
    debtCToken: null,
    collatCToken: null
  }),
  computed: {
    token() {
      const [currentToken] = getLeverTokens().filter(
        ({ address }) => address === this.$route.params.tokenAddr
      )
      return currentToken
    }
  },
  methods: {
    createTokens() {
      this.$message({
        type: 'warning',
        message: 'No create method implemented yet'
      })
    },
    redeemTokens() {
      this.$message({
        type: 'warning',
        message: 'No redeem method implemented yet'
      })
    }
  },
  async mounted() {
    const {
      data: { cToken: cTokens }
    } = await axios({
      method: 'get',
      url: 'https://api.compound.finance/api/v2/ctoken',
      params: {
        network: 'mainnet'
      }
    })

    for (let cToken of cTokens) {
      const symbol = cToken.underlying_symbol
      if (symbol === this.token.debt) this.debtCToken = cToken
      if (symbol === this.token.collat) this.collatCToken = cToken
    }

    if ((this.debtCToken ?? this.collatCToken) === null) {
      this.$message({
        message: 'failed to load cToken data',
        type: 'error'
      })
    }
  }
}
</script>

<style>
#redeem-mint-buttons > button {
  @apply rounded-lg uppercase font-bold text-base;
  width: 9.3rem;
  height: 2.9rem;
}

.stat-display {
  @apply font-medium w-96 flex justify-between text-xl p-4 ml-12 mr-16 h-16;
}

.stat-display > span.label {
  @apply text-tgray-400;
}

.stat-display > span.info {
  @apply text-white;
}
</style>
