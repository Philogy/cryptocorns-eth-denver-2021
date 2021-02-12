<template>
  <div>
    <el-table
      :data="tokens"
      @current-change="onRowSelect"
      class="token-list
      h-full w-full"
    >
      <el-table-column width="180">
        <template slot-scope="{ row }">
          <coin-pair :tokenA="row.primary" :tokenB="row.secondary"></coin-pair>
        </template>
      </el-table-column>
      <el-table-column property="pair" label="Token Pair" width="250"> </el-table-column>
      <el-table-column property="type" label="Type" width="250">
        <template slot-scope="{ row }">
          <span :class="typeColor(row.type)">
            {{ row.type }}
          </span>
        </template>
      </el-table-column>
      <el-table-column property="leverage" label="Leverage Factor" width="200"></el-table-column>
      <el-table-column label="Trade" width="550">
        <template slot-scope="{ row }">
          <div class="flex">
            <el-button
              class="bg-tgreen-200 border-tgreen-200 text-white
              text-md mr-8"
              @click="goToBuy(row)"
              >BUY</el-button
            >
            <el-button class="bg-tred-200 border-tred-200 text-white text-md" @click="goToSell(row)"
              >SELL</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <p class="text-2xl font-normal text-center mt-4">More tokens coming soon...</p>
  </div>
</template>

<script>
import CoinPair from '@/components/CoinPair'
import { getLeverTokens, makeDisp } from '@/utils/tokens'

export default {
  components: { CoinPair },
  data: () => ({
    tokenData: getLeverTokens(),
    cancelRedirect: false
  }),
  computed: {
    tokens() {
      return makeDisp(this.tokenData)
    },
    typeColor: () => type => {
      return type === 'Long' ? 'text-tgreen-200' : 'text-tred-200'
    }
  },
  methods: {
    onRowSelect({ address }) {
      setTimeout(() => {
        if (!this.cancelRedirect) {
          this.$router.push({ path: `/manage/tokens/token/${address}` })
        } else {
          this.cancelRedirect = false
        }
      }, 10)
    },
    goToBuy({ address }) {
      this.cancelRedirect = true
      window.open(`https://app.uniswap.org/#/swap?outputCurrency=${address}`)
    },
    goToSell({ address }) {
      this.cancelRedirect = true
      window.open(`https://app.uniswap.org/#/swap?inputCurrency=${address}`)
    }
  }
}
</script>

<style>
.token-list {
  @apply overflow-auto;
}

.token-list tr {
  @apply text-white;
}

.token-list .el-table__header tr {
  @apply text-lg font-medium;
}

.token-list .el-table__header-wrapper tr {
  @apply bg-tgray-700 !important;
}

.token-list .el-table__body tr {
  @apply text-xl font-normal bg-tgray-600 hover:bg-tgray-500 cursor-pointer h-24;
}

.token-list.el-table .el-table__body-wrapper table {
  border-spacing: 0 1rem;
}

.token-list .token-pair {
  @apply w-20 h-12 ml-4;
}
</style>
