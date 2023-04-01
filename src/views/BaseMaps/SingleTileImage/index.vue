<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">本地单张图片</div>
      <div class="panel-body">
        <!-- <button @click="pickCamera">视角</button> -->
        <button @click="mapClick('earth4')">图片1</button>
        <button @click="mapClick('earth_atmos_4096')">图片2</button>
      </div>
    </div>-->
  </div>
</template>

<script> 
import cesiumInit from "@/js/SampleItems/BaseMaps/SingleTileImage";
export default {
  name: "CesiumSingleTileImage", 
  mounted() {
    cesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: { 
    mapClick(name) {
      cesiumInit.changeBaseMap(name);
    }
  }
};
</script> 

 