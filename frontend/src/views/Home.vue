<template>
  <div class="bg-tgray-800">
    <div class="bg-landing-page bg-no-repeat bg-cover">
      <el-container id="main-container" class="h-screen">
        <el-aside class="flex flex-col h-screen text-white">
          <div class="h-1/6 flex items-center justify-center opacity-90">
            <img src="../assets/icons/lever logo.svg" class="h-16" />
            <span class="text-2xl">VERAGER</span>
          </div>
        </el-aside>
        <el-container class="h-screen flex flex-col">
          <div class="w-full h-1/6 px-8 flex items-center">
            <div class="w-full flex justify-end items-center space-x-16">
              <meta-mask-connect @connected="goToManagePanel" />
            </div>
          </div>
        </el-container>
      </el-container>

      <main id="landing-info" class="el-container flex flex-col items-center text-center">
        <h1 class="text-5xl">The trustless protocol for issuing and redeeming leveraged tokens</h1>

        <h2 id="landing-info-h2" class="font-normal">
          Enjoy increased leverage without risk of liquidation. With leveraged tokens, you don't
          have to worry about margin, collateral, liquidation prices and funding rates.
        </h2>

        <el-button
          type="primary"
          @click="goToManagePanel"
          class="w-72 h-16 text-base font-bold rounded-2xl bg-tblue-200
          hover:bg-tblue-200 transform hover:scale-110"
        >
          TRADE NOW
          <i class="el-icon-right"></i>
        </el-button>
      </main>
    </div>
  </div>
</template>

<script>
import MetaMaskConnect from '@/components/MetaMaskConnect.vue'

export default {
  components: { MetaMaskConnect },
  methods: {
    goToManagePanel() {
      this.$router.push({ path: 'manage' })
    }
  }
}
</script>

<style scoped>
main {
  height: calc(100vh - 210px) !important;
}
#main-container {
  max-height: 210px;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
}
#landing-info > h1 {
  max-width: 780px;
  flex-basis: 205px;
}
#landing-info > h2 {
  max-width: 762px;
  font-size: 18px;
  flex-basis: 140px;
}
</style>
