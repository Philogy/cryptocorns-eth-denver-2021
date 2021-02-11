<template>
  <el-container id="main-container" class="h-screen">
    <el-aside class="flex flex-col bg-tgray-700 text-white">
      <div
        @click="returnHome"
        class="cursor-pointer h-1/6 flex items-center
        justify-center opacity-90"
      >
        <img src="../../assets/icons/lever logo.svg" class="h-16" />
        <span class="text-2xl">VERAGER</span>
      </div>
      <div
        id="manage-nav"
        class="h-2/3 mt-20 flex flex-col pl-16 pr-8 text-left
        border-none bg-tgray-700"
        router
      >
        <router-link
          v-for="menuPath in menuPaths"
          :key="menuPath.dest"
          :to="`/manage/${menuPath.dest}`"
          class="flex my-4 items-center transform hover:bg-tgray-600 h-16 p-4
          rounded-lg"
        >
          <div
            class="w-7 h-7 bg-tgray-500 p-1 flex justify-center items-center
            rounded-lg mr-4"
          >
            <i :class="menuPath.icon" class="transform scale-110"></i>
          </div>
          <span class="text-xl font-medium">{{ menuPath.text }}</span>
        </router-link>
      </div>
    </el-aside>
    <el-container class="bg-tgray-800 h-screen flex flex-col">
      <div class="w-full h-1/6 px-8 flex items-center">
        <div class="w-full flex justify-between items-center space-x-16">
          <el-autocomplete
            class="w-full flex"
            placeholder="Search Leveraged Tokens"
            :fetch-suggestions="findTokens"
            v-model="tokenSearchText"
            @select="handleSearchSelect"
          >
            <i
              slot="prefix"
              class="el-input__icon el-icon-close cursor-pointer"
              @click="clearSearch"
            ></i>
            <i
              slot="suffix"
              class="el-input__icon el-icon-search transform
              scale-125"
            ></i>
            <template slot-scope="{ item }">
              <div class="flex items-center space-x-2">
                <coin-pair
                  :tokenA="item.token.primary"
                  :tokenB="item.token.secondary"
                  class="w-8 h-5"
                ></coin-pair>
                <span>{{ item.value }}</span>
              </div>
            </template>
          </el-autocomplete>
          <meta-mask-connect></meta-mask-connect>
        </div>
      </div>
      <el-container>
        <el-header class="flex justify-between items-center">
          <div id="token-submenu">
            <router-link v-for="subRoute in subRoutes" :key="subRoute.path" :to="subRoute.path">
              {{ subRoute.label }}
            </router-link>
          </div>
          <account-display></account-display>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import MetaMaskConnect from '@/components/MetaMaskConnect'
import AccountDisplay from '@/components/AccountDisplay'
import CoinPair from '@/components/CoinPair'
import { compToSign, getRouteMeta } from '@/utils/misc'
import { getLeverTokens } from '@/utils/tokens'

export default {
  components: { MetaMaskConnect, AccountDisplay, CoinPair },
  data: () => ({
    tokenSearchText: '',
    menuPaths: [
      { text: 'Leveraged Tokens', icon: 'el-icon-coin', dest: 'tokens' },
      { text: 'Buy / Sell Tokens', icon: 'el-icon-sort', dest: 'trade' },
      { text: 'Rebalance', icon: 'el-icon-setting', dest: 'rebalance' }
    ],
    tokens: getLeverTokens(),
    filterOutNoMatch: true
  }),
  methods: {
    returnHome() {
      this.$router.push({ path: '/home' })
    },
    findTokens(queryString, cb) {
      const tokens = this.tokens.map(token => {
        const index = token.desc.toLowerCase().indexOf(queryString.toLowerCase())

        return { value: token.desc, index: index !== -1 ? index : null, token }
      })

      tokens.sort(({ index: a }, { index: b }) => {
        if ((a === null) !== (b === null)) {
          return a === null ? 1 : -1
        }
        return compToSign(a, b)
      })
      if (this.filterOutNoMatch) {
        cb(tokens.filter(({ index }) => index !== null))
      } else {
        cb(tokens)
      }
    },
    handleSearchSelect({ token }) {
      this.clearSearch()
      this.$router.push({ path: `/manage/tokens/token/${token.address}` })
    },
    clearSearch() {
      this.tokenSearchText = ''
    }
  },
  computed: {
    subRoutes() {
      return getRouteMeta(this.$route)?.subMenuRoutes ?? null
    }
  }
}
</script>

<style>
#manage-nav > .router-link-active > span {
  @apply text-tblue-200;
}

#manage-nav > .router-link-active > div {
  @apply bg-tblue-200;
}

.el-input > input.el-input__inner {
  @apply bg-gray-800 border-none h-12 rounded-lg;
}
.el-input > input.el-input__inner::placeholder {
  @apply text-base text-tgray-100 text-opacity-60;
}

#token-submenu > .router-link-active {
  @apply text-blue-500 border-b-3 pb-1 border-blue-500;
}

#token-submenu > a {
  @apply mx-1 text-xl font-bold px-4 text-tgray-200 text-center;
}
</style>
