<template>
  <div class="app-wrapp">
    <div class="map-container">
      <div class="cesium-container" id="cesium-container"></div>
      <div class="ol-map-container" id="ol-map-container"></div>
    </div> 
  </div>
</template>

<script> 
import cesiumOLInit from "@/js/SampleItems/Analysis/CesiumOLSync";
import { pickCamera } from "@/utils/scene";
import "ol/ol.css";
export default {
  name: "CesiumOLSync", 
  data() {
    return {};
  },

  mounted() {
    cesiumOLInit.init("cesium-container", "ol-map-container");
  },

  beforeDestroy() {
    cesiumOLInit.destroy();
  },

  methods: {  
    getCamera() {
      console.log(pickCamera(cesiumOLInit.viewer.scene));
    }
  }
};
</script> 

<style   scoped>
.map-container {
  height: 100%;
  width: 100%;
  display: flex; 
}
.cesium-container {
  width: 50%;
}
.ol-map-container {
  width: 50%;
  height: 100%;
}
</style>