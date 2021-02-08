<template>
  <div>
    <el-table id="token-list" :data="tokens">
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
import { capitalize } from '@/utils/general'
import { getTokenIcon } from '@/utils/tokens'

export default {
  data: () => ({
    rawTokenData: tokens
  }),
  computed: {
    tokens() {
      return this.rawTokenData.map(({ collat, debt, type, leverage }) => {
        const [primary, secondary] = type === 'LONG' ? [collat, debt] : [debt, collat]
        return {
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

#token-list .el-table__body tr {
  @apply text-xl font-normal;
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
