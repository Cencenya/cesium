<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
  </div>
</template>

<script> 
import cesiumInit from "@/js/SampleItems/SpecialEffects/TilesHeatMap";
export default {
  name: "CesiumTilesHeatMap", 
  data() {
    return {
      
    };
  },

  mounted() {
    cesiumInit.init("cesium-container");  
  },

  beforeDestroy() { 
    cesiumInit.destroy();
  },

  methods: {
    
  }
};
</script>

 