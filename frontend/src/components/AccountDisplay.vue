<template>
  <div v-if="connected" class="border border-tred-100 rounded-lg border-opacity-20 flex">
    <div class="flex items-center px-2 py-1">
      <img src="@/assets/icons/wallet-icon.svg" />
      <p class="ml-2 text-tred-100">{{ shortenedAccount }}</p>
    </div>
    <div
      class="border px-2 py-1 rounded-lg border-tred-100 border-opacity-20
      flex items-center cursor-pointer active:text-green-300"
      @click="copyAddress"
    >
      <i class="el-icon-copy-document text-tred-100 font-bold transform scale-150"></i>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { copyToClipboard } from '@/utils/misc'

export default {
  computed: {
    ...mapGetters(['mainAccount', 'connected']),
    shortenedAccount() {
      if (this.mainAccount === null) return '<not connected>'
      return this.shorten(this.mainAccount, 6)
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
