<template>
  <div>
    <el-button @click="connect">
      CONNECT WALLET
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
