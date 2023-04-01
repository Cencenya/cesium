<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">Arcgis在线底图</div>
      <div class="panel-body">
        <!-- <button @click="pickCamera">视角</button> -->
        <button @click="mapClick(0)">卫星底图</button>
        <button @click="mapClick(1)">电子街道</button>
        <button @click="mapClick(2)">蓝色底图</button>
        <button @click="mapClick(3)">灰色底图</button>
      </div>
    </div>
  </div>
</template>

<script> 
import cesiumInit from "@/js/SampleItems/BaseMaps/ArcgisMap";
export default {
  name: "CesiumArcgisMap",  
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

 