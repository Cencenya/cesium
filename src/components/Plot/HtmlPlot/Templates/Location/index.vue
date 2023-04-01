<template>
  <div class="LocationPlot-container" @click="onClick" :class="{'is-selected':isSelected}">
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
  name: "LocationPlot", //位置标绘 标绘经纬度
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
  data() {
    return {
      isSelected: false
    };
  },
  methods: {
    onClick() {
      if (this.PlotItemClick) {
        this.PlotItemClick();
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
  padding: 5px;
  border: 1px solid #9c9944e8;
}

.LocationPlot-container::before {
  position: absolute;
  content: "";
  left: 50%;
  bottom: -20px;
  height: 18px;
  border-left: 2px dashed #c5e22770;
}

.LocationPlot-container:hover { 
   border: 1px solid rgb(9, 255, 0);
}


.is-selected {
  border: 2px solid yellow;
}

.is-selected::before {
  border-left: 2px dashed yellow !important;
}
</style>