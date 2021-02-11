<template>
  <div>
    <el-table id="token-list" :data="tokens" @current-change="onRowSelect">
      <el-table-column width="120">
        <template slot-scope="{ row }">
          <coin-pair
            :tokenA="row.primary"
            :tokenB="row.secondary"
            class="w-20 h-12 ml-4"
          ></coin-pair>
        </template>
      </el-table-column>
      <el-table-column property="pair" label="Token Pair" width="250"> </el-table-column>
      <el-table-column property="type" label="Type" width="200"></el-table-column>
      <el-table-column property="leverage" label="Leverage Factor"></el-table-column>
    </el-table>
    <p class="text-2xl font-normal text-center mt-4">More tokens coming soon...</p>
  </div>
</template>

<script>
import CoinPair from '@/components/CoinPair'
import { capitalize } from '@/utils/misc'
import { getLeverTokens } from '@/utils/tokens'

export default {
  components: { CoinPair },
  data: () => ({
    tokenData: getLeverTokens()
  }),
  computed: {
    tokens() {
      return this.tokenData.map(({ type, leverage, ...other }) => {
        return {
          ...other,
          type: capitalize(type),
          leverage: `${leverage}x`
        }
      })
    }
  },
  methods: {
    onRowSelect({ address }) {
      this.$router.push({ path: `/manage/tokens/token/${address}` })
    }
  }
}
</script>

<style>
#token-list tr {
  @apply text-white;
}

#token-list .el-table__header tr {
  @apply text-lg font-medium;
}

#token-list .el-table__header-wrapper tr {
  @apply bg-tgray-700 !important;
}

#token-list .el-table__body tr {
  @apply text-xl font-normal bg-tgray-600 hover:bg-tgray-500 cursor-pointer h-24;
}

#token-list.el-table .el-table__body-wrapper table {
  border-spacing: 0 1rem;
}
</style>
