<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">天地图在线底图</div>
      <div class="panel-body">
        <!-- <button @click="pickCamera">视角</button> -->
        <button @click="mapClick(0)">卫星地图</button>
        <button @click="mapClick(1)">电子地图</button>
        <button @click="mapClick(2)">地形图</button>
      </div>
    </div>
  </div>
</template>

<script> 
import cesiumInit from "@/js/SampleItems/BaseMaps/TdtMap";
export default {
  name: "CesiumTdtMap", 
  mounted() {
    cesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: {  
    mapClick(type) {
      cesiumInit.changeBaseMap(type);
    }
  }
};
</script> 

 