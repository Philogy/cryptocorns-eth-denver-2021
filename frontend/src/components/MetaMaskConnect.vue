<template>
  <div>
    <el-button
      @click="connect"
      class="font-bold uppercase bg-transparent text-white border-2
      border-tblue-200 rounded-lg"
    >
      Connect Wallet
    </el-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions(['connect'])
  }
}
</script>

<style></style>
