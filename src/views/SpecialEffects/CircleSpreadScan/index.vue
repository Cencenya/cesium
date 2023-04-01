<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
  </div>
</template>

<script>  
import cesiumInit from "@/js/SampleItems/SpecialEffects/CircleSpreadScan";
import { pickCamera } from "@/utils/scene";

export default {
  name: "CesiumCircleSpreadScan",  
  mounted() {
    cesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: { 
    pickCamera() {
      console.log(pickCamera(cesiumInit.viewer.scene));
    }
  }
};
</script>
 