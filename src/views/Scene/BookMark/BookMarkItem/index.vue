<template>
  <div class="bookmark-container">
    <img class="bookmark-img" :src="bookmarkData.img" @click="itemClick" />
    <div class="bookmark-text">{{bookmarkData.name}}</div>
    <i class="el-icon-delete" @click.stop="delClick" title="删除书签"></i>
  </div>
</template>

<script>
export default {
  props: {
    bookmarkData: {
      type: Object
    }
  },

  methods: {
    itemClick() {
      this.$emit("bookmarkClickEvent", this.bookmarkData);
    },

    delClick() {
      this.$emit("delClick", this.bookmarkData);
    }
  }
};
</script>

<style   scoped>
.bookmark-container {
  position: relative;
  border: 1px solid rgb(246, 246, 248);
  border-radius: 5px;
  margin-top: 5px;
  cursor: pointer;
}
.bookmark-img {
  height: 200px;
  width: 300px;
}
.bookmark-text {
  position: absolute;
  bottom: 0px;
  background: #2b3c9e8a;
  color: white;
  width: 100%;
  text-align: center;
}

.el-icon-delete {
  position: absolute;
  right: 20px;
  bottom: 4px;
  cursor: pointer;
}
</style>