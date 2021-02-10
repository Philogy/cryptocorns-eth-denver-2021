<template>
  <el-container id="main-container" class="h-screen">
    <el-aside class="flex flex-col bg-tgray-600 text-white">
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
        border-none bg-tgray-600"
        router
      >
        <router-link
          v-for="menuPath in menuPaths"
          :key="menuPath.dest"
          :to="`/manage/${menuPath.dest}`"
          class="flex my-4 items-center transform hover:bg-tgray-500 h-16 p-4
          rounded-lg"
        >
          <div
            class="w-7 h-7 bg-tgray-400 p-1 flex justify-center items-center
            rounded-lg mr-4"
          >
            <i :class="menuPath.icon" class="transform scale-110"></i>
          </div>
          <span class="text-xl font-medium">{{ menuPath.text }}</span>
        </router-link>
      </div>

      <footer>
        <div>
          <button type="text" @click="emailVisible = true">
            <img
              :src="hovered === 'email' ? icons.email.hover : icons.email.default"
              @mouseover="hovered = 'email'"
              @mouseleave="hovered = null"
              class="icon"
              alt="Email"
            />
          </button>
          <button type="text" @click="telegramVisible = true">
            <img
              :src="hovered === 'telegram' ? icons.telegram.hover : icons.telegram.default"
              @mouseover="hovered = 'telegram'"
              @mouseleave="hovered = null"
              class="icon"
              alt="Telegram"
            />
          </button>
          <button type="text" @click="twitterVisible = true">
            <img
              :src="hovered === 'twitter' ? icons.twitter.hover : icons.twitter.default"
              @mouseover="hovered = 'twitter'"
              @mouseleave="hovered = null"
              class="icon"
              alt="Twitter"
            />
          </button>
          <button
            type="text"
            @click="githubVisible = true"
           
            @mouseover="hovered = 'github'"
            @mouseleave="hovered = null"
          >
            <img
              :src="hovered === 'github' ? icons.github.hover : icons.github.default"
              class="icon"
              alt="Github"
            />
          </button>
        </div>
      </footer>
    </el-aside>

    <div>
      <el-dialog
        title="Tips"
        :visible.sync="emailVisible"
        width="30%"
        :before-close="handleClose"
        class="modal"
      >
        <span>Email</span>
        <span slot="footer" class="dialog-footer">
          <!-- TODO: Add details -->
        </span>
      </el-dialog>
      <el-dialog
        title="Tips"
        :visible.sync="telegramVisible"
        width="30%"
        :before-close="handleClose"
        class="modal"
      >
        <span>Telegram</span>
        <span slot="footer" class="dialog-footer">
          <!-- TODO: Add details -->
        </span>
      </el-dialog>
      <el-dialog
        title="Tips"
        :visible.sync="twitterVisible"
        width="30%"
        :before-close="handleClose"
        class="modal"
      >
        <span>Twitter</span>
        <span slot="footer" class="dialog-footer">
          <!-- TODO: Add details -->
        </span>
      </el-dialog>
      <el-dialog
        title="Tips"
        :visible.sync="githubVisible"
        width="30%"
        :before-close="handleClose"
        class="modal"
      >
        <span>Github</span>
        <span slot="footer" class="dialog-footer">
          <!-- TODO: Add details -->
        </span>
      </el-dialog>
    </div>

    <el-container class="bg-tgray-800 h-screen flex flex-col">
      <div class="w-full h-1/6 px-8 flex items-center">
        <div class="w-full flex justify-between items-center space-x-16">
          <el-autocomplete
            class="w-full flex"
            placeholder="Search Leveraged Tokens"
            :fetch-suggestions="findTokens"
            v-model="tokenSearchText"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search transform
              scale-125"
            ></i>
            <template slot-scope="{ item }">
              <span>{{ item.value }}</span>
            </template>
          </el-autocomplete>
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
import { compToSign } from '@/utils/misc'
import tokens from '../../eth/tokens'

export default {
  components: { MetaMaskConnect },
  data: () => ({
    tokenSearchText: '',
    menuPaths: [
      { text: 'Leveraged Tokens', icon: 'el-icon-coin', dest: 'tokens' },
      { text: 'Buy / Sell Tokens', icon: 'el-icon-sort', dest: 'trade' },
      { text: 'Rebalance', icon: 'el-icon-setting', dest: 'rebalance' }
    ],
    tokens,
    filterOutNoMatch: true,
    emailVisible: false,
    telegramVisible: false,
    twitterVisible: false,
    githubVisible: false,
    hovered: null,
    icons: {
      email: {
        default: require('../../assets/icons/email.svg'),
        hover: require('../../assets/icons/email-highlight.svg')
      },
      telegram: {
        default: require('../../assets/icons/telegram.svg'),
        hover: require('../../assets/icons/telegram-highlight.svg')
      },
      twitter: {
        default: require('../../assets/icons/twitter.svg'),
        hover: require('../../assets/icons/twitter-highlight.svg')
      },
      github: {
        default: require('../../assets/icons/github.svg'),
        hover: require('../../assets/icons/github-highlight.svg')
      }
    }
  }),
  methods: {
    returnHome() {
      this.$router.push({ path: '/home' })
    },
    createDesc({ collat, debt, leverage, type }) {
      const [primary, secondary] = type === 'LONG' ? [collat, debt] : [debt, collat]
      return `${primary}-${secondary} ${leverage}x ${type[0]}${type.slice(1).toLowerCase()}`
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
    },
    handleClose(done) {
      done()
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
  @apply text-base text-tgray-200 text-opacity-60;
}

footer {
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: row;
  width: 300px;
  margin-bottom: 17px;
  justify-content: center;
}
footer > div {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 204px;
  margin-bottom: 6px;
}
.icon {
  width: 19px;
}
.modal {
  left: 0;
  margin: auto;
  z-index: 3;
}
</style>
