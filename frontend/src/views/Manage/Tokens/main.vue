<template>
  <el-container>
    <el-header>
      <div id="token-submenu" class="h-1/4">
        <router-link to="/manage/tokens/all">All</router-link>
        <router-link to="/manage/tokens/personal">My Tokens</router-link>
      </div>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {}
</script>

<style>
#token-submenu > .router-link-active {
  @apply text-blue-500 border-b-4 pb-1 border-blue-500;
}

#token-submenu > a {
  @apply mx-2 text-xl font-bold px-4;
}
</style>
