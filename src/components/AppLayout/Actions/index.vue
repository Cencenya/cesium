<template>
  <div class="action-container">
    <!-- <div class="action-link" @click="orderlistEvent" v-if="$route.path=='/categorylist'">顺序浏览</div>
    <div class="action-link" @click="categorylistEvent" v-else>分类浏览</div>
    <div class="action-link" @click="sourcecodeEvent">获取源码</div>
    <div class="action-link" @click="sourceEvent">相关资源</div> -->
  </div>
</template>
<script>
export default {
  methods: {
    orderlistEvent() {
      this.$router.push("orderlist");
    },
    categorylistEvent() {
      this.$router.push("categorylist");
    },
    sourcecodeEvent() {
      window.open("/sourcecode");
    },
    sourceEvent() {
      window.open("/studyresource");
    }
  }
};
</script>

<style scoped>
.action-container {
  position: absolute;
  right: 20px;
  top: 15px;
  display: flex;
}

.action-link {
  color: white;
  font-size: 24px;
  cursor: pointer;
  margin-left: 20px;
}

.action-link:hover {
  color: yellow;
}
</style>