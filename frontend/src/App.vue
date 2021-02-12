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

<style src="./assets/scrollbar.css"></style>
<style src="./assets/index.css"></style>
<style>
body * {
  font-family: 'Work Sans';
}
#app {
  min-width: 650px;
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

.el-table,
.el-table th,
.el-table .el-table__body tr:hover > td {
  @apply bg-transparent;
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

.el-table tr td,
.el-table .el-table__header-wrapper th {
  @apply border-none;
}

.el-table::before {
  @apply hidden;
}

.el-button.is-loading::before {
  @apply hidden;
}

.el-button.el-button--primary {
  @apply bg-tblue-200 border-tblue-200 outline-none;
}

.el-button.el-button--primary:active {
  @apply transform scale-110;
}

button.el-dialog__headerbtn i.el-icon:focus {
  outline: none;
}

button.el-dialog__headerbtn:focus {
  outline: none;
}
</style>
