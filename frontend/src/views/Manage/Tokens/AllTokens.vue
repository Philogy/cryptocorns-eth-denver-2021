<template>
  <div>
    <el-table id="token-list" :data="tokens" @current-change="onRowSelect">
      <el-table-column width="120">
        <template slot-scope="{ row }">
          <div class="token-pair relative flex h-12">
            <img :src="row.urls.primary" class="primary" />
            <img :src="row.urls.secondary" class="secondary" />
          </div>
        </template>
      </el-table-column>
      <el-table-column property="pair" label="Token Pair" width="250"> </el-table-column>
      <el-table-column property="type" label="Type" width="200"></el-table-column>
      <el-table-column property="leverage" label="Leverage Factor"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import tokens from '@/eth/tokens'
import { capitalize } from '@/utils/misc'
import { getTokenIcon } from '@/utils/tokens'

export default {
  data: () => ({
    rawTokenData: tokens
  }),
  computed: {
    tokens() {
      return this.rawTokenData.map(({ collat, debt, type, leverage, ...other }) => {
        const [primary, secondary] = type === 'LONG' ? [collat, debt] : [debt, collat]
        return {
          ...other,
          pair: `${primary}-${secondary}`,
          collat,
          debt,
          type: capitalize(type),
          leverage: `${leverage}x`,
          urls: {
            primary: getTokenIcon(primary),
            secondary: getTokenIcon(secondary)
          }
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

#token-list .token-pair img {
  @apply h-full;
}

#token-list .primary {
  @apply z-10;
}

#token-list .secondary {
  @apply absolute left-8;
}
</style>
