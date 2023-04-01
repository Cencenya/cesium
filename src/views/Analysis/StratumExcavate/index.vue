<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">矿区岩层效果</div>
      <div class="panel-body"> 
        <button @click="drawActivate('Polygon')">绘制多边形</button>
        <button @click="clear">清除</button>
        <div class="tip-item">默认开挖深度200米，可自由设置</div>
        <div class="tip-item">目前仅支持凸多边形，如果绘制的是凹多边形，可能开挖结果不正确</div>
        <br />
        <div class="tip-item">非真实数据，仅体现岩层效果</div>
      </div>
    </div>
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/Analysis/StratumExcavate";
export default {
  name: "CesiumStratumExcavate", 
  data() {
    return {
      
    };
  },

  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: {  
    drawActivate(type) {
      CesiumInit.drawActivate(type );
    },

    clear() {
      CesiumInit.clear();
    }
  }
};
</script>

<style  scoped>
.panel-body /deep/ input {
  height: 26px;
}
</style>
 