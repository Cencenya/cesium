<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
  </div>
</template>

<script> 
import CesiumInit from "../../../js/SampleItems/MapV/QianXiTime";
export default {
  name: "CesiumMapVQianXiTime",  
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
 