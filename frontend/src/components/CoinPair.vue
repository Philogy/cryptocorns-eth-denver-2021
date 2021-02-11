<template>
  <div class="token-pair relative flex">
    <img :src="tokenIconA" class="primary" />
    <img :src="tokenIconB" class="secondary" />
  </div>
</template>

<script>
import { getTokenIcon } from '@/utils/tokens'

export default {
  props: {
    tokenA: String,
    tokenB: String
  },
  computed: {
    tokenIconA() {
      return getTokenIcon(this.tokenA)
    },
    tokenIconB() {
      return getTokenIcon(this.tokenB)
    }
  }
}
</script>

<style>
.token-pair > img {
  @apply h-full absolute;
}

.token-pair > .primary {
  @apply left-0;
}

.token-pair > .secondary {
  @apply right-0;
}
</style>
