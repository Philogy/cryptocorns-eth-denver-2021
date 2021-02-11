<template>
  <el-container class="flex flex-col h-full">
    <router-link
      to="/manage/tokens/all"
      class="font-medium flex items-center text-lg text-tgray-200 mb-4"
    >
      <i
        class="el-icon-arrow-left transform scale-110 mr-1 font-black
          text-tgray-300"
      ></i>
      All
    </router-link>
    <router-view></router-view>
  </el-container>
</template>
