<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
  </div>
</template>

<script> 
import CesiumInit from "../../../js/SampleItems/MapV/HeatMap";
export default {
  name: "CesiumMapVHeatMap",  
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
 