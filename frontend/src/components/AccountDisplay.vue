<template>
  <div>
    <p>My account: {{ shortenedAccount }}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['mainAccount']),
    shortenedAccount() {
      return this.shorten(this.mainAccount, 4)
    }
  },
  methods: {
    shorten(addr, digits) {
      const front = addr.slice(0, digits + 2)
      const end = addr.slice(addr.length - digits)
      return `${front}...${end}`
    }
  }
}
</script>
