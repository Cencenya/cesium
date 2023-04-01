<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
  </div>
</template>

<script>  
import CesiumInit from "@/js/SampleItems/IndustryApplication/RadarRadiationWave";
export default {
  name: "CesiumRadarRadiationWave",  
  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: {  
    drawActivate(type) {
      CesiumInit.drawActivate(type);
    },

    clear() {
      CesiumInit.clear();
    }
  }
};
</script> 