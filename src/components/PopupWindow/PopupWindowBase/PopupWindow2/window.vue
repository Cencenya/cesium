<template>
  <div class="popup3d-container" v-if="show">
    <div class="popup3d-header">
      <span class="popup3d-header-title">气泡弹框2</span>
      <span class="popup3d-close" @click="handleClose" title="关闭">×</span>
    </div>
    <div class="popup3d-body">窗口内容</div>
  </div>
</template>
<script>
export default {
  name: "PopupWindow2",
  data() {
    return {
      show: true
    };
  },
  props: {
    id: {
      type: Number,
      default: -1
    }
  },
  methods: {
    handleClose() {
      if (this.closeEvent) {
        this.closeEvent();
      }
    }
  }
};
</script>

<style   scoped>
.popup3d-container {
  width: 350px;
  height: 200px;
  background: #14193399;
  position: absolute;
  left: 0px;
  bottom: 0px;
  cursor: default;
}

.popup3d-container::before {
  content: "";
  width: calc(100% + 22px);
  height: 39px;
  position: absolute;
  bottom: -39px;
  left: -22px;
  background: url(../../../../../static/images/popup3d/popup3d.png) 0px 0px
    no-repeat;
  background-position: 0px 0px;
}

.popup3d-header {
  height: 30px;
  color: white;
  background: #1f3f8e;
  line-height: 30px;
}

.popup3d-header-title {
  display: inline-block;
  height: 100%;
  margin-left: 5px;
}

.popup3d-close {
  position: absolute;
  right: 1px;
  font-size: 25px;
  cursor: pointer;
  width: 29px;
  text-align: center;
}

.popup3d-close:hover {
  background: #dc2929b9;
}

.popup3d-body {
  padding: 10px;
  color:white;
}
</style>