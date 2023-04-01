<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">围墙扩散动画</div>
      <div class="panel-body">
        <!-- <button @click="pickCamera">视角</button> -->
        <div class="tip-item">规则多边形支持任意多个边，支持任意颜色</div>
      </div>
    </div>
  </div>
</template>

<script>  
import cesiumInit from "@/js/SampleItems/SpecialEffects/WallSpread";
import { pickCamera } from "@/utils/scene";

export default {
  name: "CesiumWallSpread", 
  mounted() {
    cesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: { 
    pickCamera() {
      console.log(pickCamera(cesiumInit.viewer.scene));
    }
  }
};
</script>
 