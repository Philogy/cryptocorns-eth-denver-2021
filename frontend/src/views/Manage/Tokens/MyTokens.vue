<template>
  <div class="w-full h-full">
    <el-table
      v-if="connected && tokens.length > 0"
      :data="tokens"
      @current-change="onRowSelect"
      class="token-list"
    >
      <el-table-column width="120">
        <template slot-scope="{ row }">
          <coin-pair :tokenA="row.primary" :tokenB="row.secondary" class=""></coin-pair>
        </template>
      </el-table-column>
      <el-table-column property="pair" label="Token Pair"> </el-table-column>
      <el-table-column property="type" label="Type">
        <template slot-scope="{ row }">
          <span :class="typeColor(row.type)">
            {{ row.type }}
          </span>
        </template>
      </el-table-column>
      <el-table-column property="leverage" label="Leverage Factor"></el-table-column>
      <el-table-column property="balance" label="Balance">
        <template slot-scope="{ row }">
          <span>{{ fromAtomicUnits(row.balance, 18) | fullNumber }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div
      v-else-if="tokens.length === 0"
      class="w-full h-full flex justify-center items-center text-2xl
      text-tgray-500"
    >
      <p>You don't own any tokens yet</p>
    </div>
    <div v-else class="h-full w-full flex flex-col justify-center items-center">
      <div
        class="w-32 h-32 bg-tgray-500 flex justify-center items-center
        rounded-xl mb-8"
      >
        <img src="@/assets/icons/metamask.png" />
      </div>
      <p class="text-tgray-500">
        <span class="text-tblue-200 cursor-pointer" @click="connect">
          Connect your wallet
        </span>
        to view your leveraged tokens
      </p>
    </div>
  </div>
</template>

<script>
import BN from 'bn.js'
import CoinPair from '@/components/CoinPair'
import { mapGetters, mapState } from 'vuex'
import { makeDisp, fromAtomicUnits } from '@/utils/tokens'

export default {
  components: { CoinPair },
  computed: {
    ...mapGetters(['connected']),
    ...mapState(['tokenData']),
    tokens() {
      const allCurrentTokens = this.tokenData ?? []

      const ZERO = new BN('0')
      return makeDisp(allCurrentTokens).filter(({ balance }) => !balance.eq(ZERO))
    },
    typeColor: () => type => {
      return type === 'Long' ? 'text-tgreen-200' : 'text-tred-200'
    }
  },
  methods: {
    connect() {
      this.$store.dispatch('connect', this.$message)
    },
    fromAtomicUnits,
    onRowSelect({ address }) {
      this.$router.push({ path: `/manage/tokens/token/${address}` })
    }
  }
}
</script>
