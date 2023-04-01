<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">雷达遮罩扫描</div>
      <div class="panel-body">可自由设置颜色、大小等参数</div>
      <!-- <button  @click="pickCamera">视角</button> -->
    </div>
  </div>
</template>

<script> 
import { pickCamera } from "@/utils/scene";
import CesiumInit from "@/js/SampleItems/IndustryApplication/RadarsMaskScan";
export default {
  name: "CesiumRadarsMaskScan",  
  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: { 
    drawActivate(type) {
      CesiumInit.drawActivate(type);
    },

    clear() {
      CesiumInit.clear();
    },

    pickCamera() {
      console.log(pickCamera(CesiumInit.viewer.scene));
    }
  }
};
</script>

<style  scoped>
.draw-container {
  position: absolute;
  top: 90px;
  left: 20px;
}
</style>