<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
  </div>
</template>

<script> 
import cesiumInit from "@/js/SampleItems/SpecialEffects/PolylineEnergyTrans";
export default {
  name: "CesiumPolylineEnergyTrans", 
  mounted() {
    cesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: {
    drawActivate(type) {
      cesiumInit.drawActivate(type);
    },
     
    clear() {
      cesiumInit.clear();
    }
  }
};
</script> 
 