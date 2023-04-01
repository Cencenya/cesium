<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">旋转的地球</div>
      <div class="panel-body">
        <!-- <button @click="pickCamera">视角</button> -->
        <button @click="start">开始</button>
        <button @click="stop">结束</button>
      </div>
    </div>
  </div>
</template>

<script> 
import cesiumInit from "@/js/SampleItems/Scene/GlobeRotate";
import { pickCamera } from "@/utils/scene";
export default {
  name: "CesiumGlobeRotate", 
  mounted() {
    cesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: { 
    start() {
      cesiumInit.globeRotate.startRotate();
    },

    stop() {
      cesiumInit.globeRotate.stopRotate();
    },

    pickCamera() {
      console.log(pickCamera(cesiumInit.viewer.scene));
    }
  }
};
</script> 