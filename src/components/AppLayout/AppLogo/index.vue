<template>
  <img class="home-icon" src="../../../../static/images/home/logo.jpg" @click="logoClick" />
</template>

<script>
export default {
  name: "AppLogoIcon",
  methods: {
    logoClick() {
      this.$emit("logoClick");
    }
  }
};
</script>

<style scoped>
.home-icon {
  position: absolute;
  left: 30px;
  top: 6px;
  height: 50px;
  width: 50px;
  cursor: pointer;
  border-radius: 50px;
}
</style>