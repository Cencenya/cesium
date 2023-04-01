<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">MapBox在线底图</div>
      <div class="panel-body">
        <!-- <button @click="pickCamera">视角</button> -->
        <button @click="mapClick(0)">影像地图</button>
        <button @click="mapClick(1)">街道地图</button> 
      </div>
    </div>
  </div>
</template>

<script>  
import cesiumInit from "@/js/SampleItems/BaseMaps/MapBoxMap";
export default {
  name: "CesiumMapBoxMap", 
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

 