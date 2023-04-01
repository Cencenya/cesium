<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
  </div>
</template>

<script>  
import cesiumInit from "@/js/SampleItems/SpecialEffects/HexagonSpreadScan";
import { pickCamera } from "@/utils/scene";

export default {
  name: "CesiumHexagonSpreadScan", 
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
 