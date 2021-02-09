<template>
  <div>
    <el-container id="main-container" class="h-screen">
      <el-aside class="flex flex-col h-screen bg-tgray-800 text-white">
        <div
          @click="returnHome"
          class="cursor-pointer h-1/6 flex items-center
        justify-center opacity-90"
        >
          <img src="../assets/icons/lever logo.svg" class="h-16" />
          <span class="text-2xl">VERAGER</span>
        </div>
      </el-aside>
      <el-container class="bg-tgray-800 h-screen flex flex-col">
        <div class="w-full h-1/6 px-8 flex items-center">
          <div class="w-full flex justify-end items-center space-x-16">
            <MetaMaskConnect />
          </div>
        </div>
      </el-container>
    </el-container>

    <el-container id="landing-info">
      <div id="landing-info-h1">
        <h1>Leverage Tokens For Optimal Liquidity Value</h1>
      </div>
      <h2 id="landing-info-h2">
        Enjoy increased leverage without risk of liquidation. With leveraged tokens, you don't have
        to worry about margin, collateral, liquidation prices and funding rates.
      </h2>

      <el-button id="trade-now" type="primary" @click="goToManagePanel" class="w-52 h-16">
        TRADE NOW
        <i class="el-icon-right"></i>
      </el-button>
    </el-container>
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
MetaMaskConnect {
  color: #fff;
  float: right;
}
#trade-now {
  font-size: 17px;
}
#main-container {
  max-height: 160px;
  background-image: url('../assets/landing-bg.svg');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
}
#landing-info {
  display: flex;
  flex-direction: column;
  height: 100%;
}
#landing-info-h1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100px;
  font-size: 58px;
}
#landing-info-h2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100px;
}
</style>
