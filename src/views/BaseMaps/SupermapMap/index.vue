<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">超图在线底图</div>
      <div class="panel-body">
        <!-- <button @click="pickCamera">视角</button> -->
        <button @click="mapClick(0)">街道地图</button>
        <button @click="mapClick(1)">灰色底图</button> 
      </div>
    </div>
  </div>
</template>

<script>  
import cesiumInit from "@/js/SampleItems/BaseMaps/SupermapMap";
export default {
  name: "CesiumSupermapMap", 
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

 