<template>
  <div>
    <el-table v-if="myTokens.length > 0" id="token-list" :data="myTokens" highlight-current-row="true" sortable="true">
      <el-table-column width="120">
        <template slot-scope="{ row }">
          <div class="token-pair relative flex h-12">
            <img :src="row.urls.primary" class="primary" />
            <img :src="row.urls.secondary" class="secondary" />
          </div>
        </template>
      </el-table-column>
      <el-table-column property="pair" label="Token Pair"> </el-table-column>
      <el-table-column property="type" label="Type"></el-table-column>
      <el-table-column property="leverage" label="Leverage Factor"></el-table-column>
      <el-table-column property="balance" label="Balance"></el-table-column>
    </el-table>
    <p class="no-tokens" v-else>No tokens</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['myTokens'])
  }
}
</script>

<style scoped>
#token-list {
  min-width: 555px !important;
}
.el-table__empty-block {
  display: none!important;
}
.no-tokens {
  text-align: center;
  margin-top: 18px;
}
</style>
