<template>
  <div id="wallet-connect" class="relative rounded-lg margin-0" v-if="!connected">
    <el-button
      @click="connect"
      class="uppercase border-2 font-bold text-white
      bg-transparent border-tblue-200
      hover:bg-tblue-200 hover:border-tblue-200 hover:text-white"
      :loading="loading"
      :disabled="loading"
    >
      Connect Wallet
    </el-button>
    <div
      v-if="loading"
      class="absolute bg-white top-0 left-0 w-full h-full
      opacity-20 cursor-not-allowed"
    ></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    loading: false
  }),
  computed: {
    ...mapGetters(['connected'])
  },
  methods: {
    connect() {
      this.loading = true
      setTimeout(async () => {
        try {
          await this.$store.dispatch('connect', this.$message)
          this.$emit('connected')
        } catch (err) {
          this.$message({
            message: `Unexpected error occured: ${err}`,
            duration: 10000,
            type: 'error'
          })
        }

        this.loading = false
      }, 200)
    }
  }
}
</script>

<style>
#wallet-connect button.el-button:disabled {
  @apply bg-transparent border-tblue-200 text-white;
}
</style>
