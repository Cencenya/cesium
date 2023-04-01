<template>
  <div class="LocationPlot-container">
    <div class="info-item info-item-close">
      <span class="info-close" title="关闭" @click="closeClick">×</span>
    </div>
    <div class="info-item">
      <span class="info-label">经度：</span>
      <span class="info-label">{{ point.x.toFixed(10)}}</span>
    </div>
    <div class="info-item">
      <span class="info-label">纬度：</span>
      <span class="info-label">{{point.y.toFixed(10)}}</span>
    </div>
    <div class="info-item">
      <span class="info-label">高度：</span>
      <span class="info-label">{{point.z.toFixed(10)}}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "PositionPick", // 标绘经纬度
  props: {
    point: {
      type: Object,
      default() {
        return {
          x: 0,
          y: 0,
          z: 0
        };
      }
    }
  },
  methods: {
    closeClick() {
      if (this.closeEvent) {
        this.closeEvent();
      }
    }
  }
};
</script>

<style   scoped>
.LocationPlot-container {
  min-height: 65px;
  min-width: 186px;
  background: #e3eee59e;
  position: absolute;
  left: 0px;
  bottom: 0px;
  cursor: default;
  padding: 0px 2px 5px 5px;
  border: 1px solid #9c9944e8;
}

.LocationPlot-container::before {
  position: absolute;
  content: "";
  left: 50%;
  bottom: -50px;
  height: 48px;
  border-left: 2px dashed #c5e22770;
  pointer-events: none;
}

.info-item-close {
  position: relative;
  height: 15px;
}

.info-close {
  display: block;
  height: 15px;
  width: 15px;
  position: absolute;
  right: 0px;
  background: #dc9e9e4d;
  line-height: 15px;
  text-align: center;
}

.info-close:hover {
  background: #e01c1c88;
}
</style>