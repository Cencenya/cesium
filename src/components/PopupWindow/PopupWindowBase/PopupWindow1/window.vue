<template>
  <div class="popup3d-container" v-if="show">
    <div class="popup3d-header">
      <span class="popup3d-header-title">气泡弹框1</span>
      <span class="popup3d-close" @click="handleClose" title="关闭">×</span>
    </div>
    <div class="popup3d-body">弹框内容</div>
  </div>
</template>
<script>
export default {
  name: "PopupWindow1",
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
  height: 200px;
  width: 350px;
  background: #3183bdb0;
  position: absolute;
  left: 0px;
  bottom: 0px;
  cursor: default;
}
.popup3d-container::before {
  position: absolute;
  content: "";
  top: 100%;
  left: calc(50% - 20px);
  border: 20px solid transparent;
  border-top: 40px solid #3183bdb0;
}

.popup3d-header {
  color: white;
  background: #2152bb;
  height: 30px;
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