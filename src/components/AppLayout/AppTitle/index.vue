<template>
  <div class="app-title">{{appTitle}}</div>
</template>
<script>
export default {
  name: "AppTitle",
  props: {
    appTitle: {
      type: String,
      default: ""
    }
  }
};
</script>

<style  scoped>
.app-title {
  position: absolute;
  left: 91px;
  top: 16px;
  font-size: 20px;
  color: white;
}
</style>