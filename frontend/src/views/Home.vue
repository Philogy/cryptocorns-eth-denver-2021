<template>
  <div class="bg-tgray-800">
    <div class="bg-landing-page bg-no-repeat bg-cover h-screen">
      <el-container id="main-container" class="py-12 pb-0">
        <el-aside class="flex flex-col text-white">
          <div class="flex items-center justify-center opacity-90">
            <img src="../assets/icons/lever logo.svg" class="h-16" />
            <span class="text-2xl">VERAGER</span>
          </div>
        </el-aside>
        <el-container class="flex flex-col justify-center">
          <div class="w-full px-8 flex items-center">
            <div class="w-full flex justify-end items-center space-x-16">
              <nav>
                <ul class="flex items-end gap-12">
                  <li>
                    <button type="text" @click="faqVisible = true" class="nav-btn">
                      <span>FAQ</span>
                    </button>
                  </li>
                  <li>
                    <button type="text" @click="aboutVisible = true" class="nav-btn">
                      About
                    </button>
                  </li>
                </ul>
              </nav>
              <meta-mask-connect @connected="goToManagePanel" />
            </div>
          </div>
        </el-container>
      </el-container>

      <div>
        <el-dialog title="FAQ" :visible.sync="faqVisible" top="35vh" width="790px">
          <div v-for="i in faq" :key="i.question" class="my-6">
            <h3 class="text-xl break-words">{{ i.question }}</h3>
            <p class="break-words">{{i.answer}}</p>
          </div>
        </el-dialog>

        <el-dialog title="About" :visible.sync="aboutVisible" top="35vh" width="790px">
          <!-- About text here -->
        </el-dialog>
      </div>

      <main
        id="landing-info"
        class="el-container flex flex-col items-center text-center justify-center"
      >
        <div class="flex flex-col justify-around items-center" id="landing-info-container">
          <div>
            <h1 class="text-5xl">
              The trustless protocol for issuing and redeeming leveraged tokens
            </h1>
          </div>
          <div>
            <h2 id="landing-info-h2" class="font-normal">
              Enjoy increased leverage without risk of liquidation. With leveraged tokens, you don't
              have to worry about margin, collateral, liquidation prices and funding rates.
            </h2>
          </div>

          <el-button
            type="primary"
            @click="goToManagePanel"
            class="w-72 h-16 text-base font-bold rounded-2xl bg-tblue-200
          hover:bg-tblue-200 transform hover:scale-110"
          >
            TRADE NOW
            <i class="el-icon-right"></i>
          </el-button>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import MetaMaskConnect from '@/components/MetaMaskConnect.vue'
import faq from './faq'
// import about from "./about"

export default {
  components: { MetaMaskConnect },
  methods: {
    goToManagePanel() {
      this.$router.push({ path: 'manage' })
    }
  },
  data() {
    return {
      faqVisible: false,
      aboutVisible: false,
      faq
    }
  }
}
</script>

<style scoped>
#main-container {
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
}
div > h1 {
  max-width: 790px;
}
div > h2 {
  max-width: 780px;
}
#landing-info {
  height: calc(100% - 160px);
}
#landing-info-container {
  height: 380px;
}
.nav-btn:hover {
  color: #2c75d8;
}
</style>
