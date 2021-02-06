<template>
  <div id="app">
    <router-view></router-view>
    <p>counter: {{ counter }}</p>
    <el-button class="focus:outline-none m-4" @click="doubleCounter">double</el-button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState(['counter'])
  },
  methods: {
    ...mapMutations(['doubleCounter'])
  }
}
</script>
