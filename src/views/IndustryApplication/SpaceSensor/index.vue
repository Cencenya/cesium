<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
  </div>
</template>

<script>  
import CesiumInit from "@/js/SampleItems/IndustryApplication/SpaceSensor";
import {pickCamera} from "@/utils/scene"
export default {
  name: "CesiumSpaceSensor", 
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

 