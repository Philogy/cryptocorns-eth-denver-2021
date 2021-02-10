<template>
  <div v-if="connected" class="flex flex-col items-end">
    <div class="border border-tred-100 rounded-lg border-opacity-20 flex">
      <div
        class="border-r px-2 py-1 border-tred-100 border-opacity-20 flex
      items-center"
        :class="networkColor"
      >
        <wallet-icon class="fill-current mr-2"></wallet-icon>
        <p v-if="networkName">{{ networkName }}</p>
      </div>
      <div class="flex items-center px-2 py-1">
        <p class="text-tgray-400">{{ shortenedAccount }}</p>
      </div>
      <div
        class="border px-2 py-1 rounded-lg border-tred-100 border-opacity-20
      flex items-center cursor-pointer active:text-green-300"
        @click="copyAddress"
      >
        <i class="el-icon-copy-document text-tgray-300 font-bold transform scale-150"></i>
      </div>
    </div>
    <p class="text-xs m-1 text-tgray-400 font-medium flex items-center" v-if="isCommon">
      <i class="el-icon-error pr-1 text-tred-100"></i>
      Unsupported chain, please switch to another
    </p>
    <p class="text-xs m-1 text-tgray-400 font-medium flex items-center" v-else-if="isTestnet">
      <i class="el-icon-warning pr-1 text-yellow-400"></i>
      <span>
        You are connected to a
        <router-link class="underline text-blue-400" to="#">testnet chain</router-link>
      </span>
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { copyToClipboard } from '@/utils/misc'

export default {
  computed: {
    ...mapGetters(['mainAccount', 'connected', 'network']),
    shortenedAccount() {
      if (this.mainAccount === null) return '<not connected>'
      return this.shorten(this.mainAccount, 6)
    },
    networkName() {
      return this.network?.name
    },
    networkColor() {
      switch (this.network?.type) {
        case 'MAIN':
          return 'text-tblue-200'
        case 'TESTNET':
          return 'text-yellow-400'
        case 'COMMON':
          return 'text-tred-100'
        default:
          return 'text-tred-100'
      }
    },
    isCommon() {
      return this.network?.type === 'COMMON'
    },
    isTestnet() {
      return this.network?.type === 'TESTNET'
    }
  },
  methods: {
    shorten(addr, digits) {
      const front = addr.slice(0, digits + 2)
      const end = addr.slice(addr.length - digits)
      return `${front}...${end}`
    },
    copyAddress() {
      copyToClipboard(this.mainAccount)
      this.$message({
        message: 'Address has been copied to clipboard',
        type: 'info'
      })
    }
  }
}
</script>
