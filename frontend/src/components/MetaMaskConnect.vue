<template>
  <div>
    <el-button @click="connect">
      Connect to MetaMask
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
