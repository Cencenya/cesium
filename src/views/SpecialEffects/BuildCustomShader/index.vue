<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
  </div>
</template>

<script>  
import CesiumInit from "@/js/SampleItems/SpecialEffects/BuildCustomShader";
import {pickCamera} from "@/utils/scene"
export default {
  name: "CesiumBuildCustomShader", 
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

 