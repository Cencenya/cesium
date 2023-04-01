<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">绕点旋转</div>
      <div class="panel-body">
        <!-- <button @click="pickCamera">视角</button> -->
        <button @click="start">开始</button>
        <button @click="stop">结束</button>
      </div>
    </div>
  </div>
</template>

<script>  
import cesiumInit from "@/js/SampleItems/Scene/AroundPoint";
import { pickCamera } from "@/utils/scene";
export default {
  name: "CesiumAroundPoint", 
  mounted() {
    cesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: { 
    start() {
      cesiumInit.aroundPoint.startRotate(cesiumInit.center);
    },

    stop() {
      cesiumInit.aroundPoint.stopRotate();
    },

    pickCamera() {
      console.log(pickCamera(cesiumInit.viewer.scene));
    }
  }
};
</script> 