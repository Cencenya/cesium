<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">谷歌在线底图</div>
      <div class="panel-body">
        <!-- <button @click="pickCamera">视角</button> -->
        <button @click="mapClick(0)">卫星底图</button>
        <button @click="mapClick(1)">谷歌电子</button>
        <div class="tip-item">谷歌地图已失效</div>
      </div>
    </div>
  </div>
</template>

<script>  
import cesiumInit from "@/js/SampleItems/BaseMaps/GoogleMap";
export default {
  name: "CesiumGoogleMap", 
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

 