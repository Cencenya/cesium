<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div>
    <div class="map-container" id="map-container"></div> 
  </div>
</template>

<script>  
import cesiumInit from "@/js/SampleItems/Scene/OverviewMap";
import "ol/ol.css";

export default {
  name: "CesiumOverviewMap", 
  mounted() {
    cesiumInit.init("cesium-container", "map-container");
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: { 
  }
};
</script>

<style   scoped>
.map-container {
  position: absolute;
  bottom: 10px;
  right: 30px;
  height: 280px;
  width: 300px; 
  border-radius: 8px;
  padding: 5px;
  border: 2px solid rgba(255, 255, 255, 0.637);
}
</style>
 