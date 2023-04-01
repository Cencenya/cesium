<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/EchartLayer/scatter.js";
export default {
  name: "CesiumEchartLayer", 
  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: {
    
  }
};
</script> 