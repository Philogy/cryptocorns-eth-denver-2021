<template>
  <div>
    <h1 class="text-black">Home</h1>
    <el-button type="primary" @click="goToManagePanel">
      Trade now
      <i class="el-icon-right"></i>
    </el-button>
  </div>
</template>

<script>
export default {
  methods: {
    goToManagePanel() {
      this.$router.push({ path: 'manage' })
    }
  }
}
</script>
