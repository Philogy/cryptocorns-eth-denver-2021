<template>
  <el-container id="main-container" class="h-screen">
    <el-aside class="flex flex-col bg-gray-800 text-white">
      <div @click="returnHome" class="cursor-pointer h-1/6">
        <h1>Logo</h1>
      </div>
      <div
        id="manage-nav"
        class="h-2/3 mt-20 flex flex-col px-8 text-left
        border-none bg-gray-800"
        router
      >
        <router-link to="/manage/tokens">Leveraged Tokens</router-link>
        <router-link to="/manage/trade">Buy / Sell Tokens</router-link>
        <router-link to="/manage/rebalance">Rebalance</router-link>
      </div>
    </el-aside>
    <el-container class="bg-gray-900 h-screen flex flex-col">
      <div class="w-full flex h-1/6 px-8 items-center">
        <div class="w-full flex justify-between ">
          <el-autocomplete
            placeholder="Search Leveraged Tokens"
            :fetch-suggestions="findTokens"
            suffix-icon="el-icon-search"
            v-model="tokenSearchText"
          ></el-autocomplete>
          <meta-mask-connect></meta-mask-connect>
        </div>
      </div>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import MetaMaskConnect from '../../components/MetaMaskConnect'
import { compToSign } from '../../utils/general'

export default {
  components: { MetaMaskConnect },
  data: () => ({
    tokenSearchText: '',
    tokens: [{ collat: 'ETH', debt: 'DAI', leverage: 3, type: 'LONG' }],
    filterOutNoMatch: true
  }),
  methods: {
    returnHome() {
      this.$router.push({ path: '/home' })
    },
    createDesc({ collat, debt, leverage, type }) {
      return `${leverage}x ${debt}-${collat} ${type[0]}${type.slice(1).toLowerCase()}`
    },
    findTokens(queryString, cb) {
      const tokens = this.tokens.map(token => {
        const desc = this.createDesc(token)
        const index = desc.toLowerCase().indexOf(queryString.toLowerCase())

        return { value: desc, index: index !== -1 ? index : null, token }
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
    }
  }
}
</script>

<style>
#manage-nav > a {
  @apply my-2 text-lg text-white;
}

#manage-nav .router-link-active {
  @apply text-blue-500;
}
.el-input > input.el-input__inner {
  @apply bg-black border-none placeholder-gray-500;
}
</style>
