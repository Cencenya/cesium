<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
  </div>
</template>

<script> 
import CesiumInit from "../../../js/SampleItems/MapV/LineForceEdgeBunding";
export default {
  name: "CesiumMapVLineForceEdgeBunding",  
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
 