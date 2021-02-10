<template>
  <div id="app" class="m-0 text-white font-serif font-semibold">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('initWeb3', this.$message)
  }
}
</script>

<style src="./assets/index.css"></style>
<style>
body * {
  font-family: 'Work Sans';
}

.el-popper {
  @apply bg-tgray-700 border-none;
}
.el-popper > .popper__arrow {
  border-bottom-color: #1f2025 !important;
}
.el-popper > .popper__arrow::after {
  border-bottom-color: #1f2025 !important;
}

.el-autocomplete-suggestion li {
  @apply hover:bg-tgray-800 mx-1 rounded-lg;
}

.el-table {
  @apply bg-tgray-800;
}

.el-table .el-table__header tr,
.el-table tr.el-table__row,
.el-table td {
  @apply bg-tgray-600 border-none !important;
}

.el-table td {
  @apply h-24;
}

.el-table td:first-child {
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}

.el-table td:last-child {
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.el-table .el-table__header-wrapper {
  @apply rounded-lg;
}

.el-table thead > tr > th {
  @apply bg-tgray-700 border-none !important;
}

.el-table::before {
  @apply hidden;
}

.el-table .el-table__body-wrapper table {
  border-spacing: 0 1rem;
}

.el-button.is-loading::before {
  @apply hidden;
}
</style>
