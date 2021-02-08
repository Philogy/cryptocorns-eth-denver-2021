<template>
  <el-container>
    <el-header class="flex justify-between">
      <div id="token-submenu">
        <router-link to="/manage/tokens/all">All</router-link>
        <router-link to="/manage/tokens/personal">My Tokens</router-link>
      </div>
      <account-display></account-display>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import AccountDisplay from '@/components/AccountDisplay'

export default {
  components: { AccountDisplay }
}
</script>

<style>
#token-submenu > .router-link-active {
  @apply text-blue-500 border-b-3 pb-1 border-blue-500;
}

#token-submenu > a {
  @apply mx-1 text-xl font-bold px-4 text-tgray-300;
}
</style>
