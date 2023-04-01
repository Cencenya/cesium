<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <!-- <div class="panel">
      <div class="panel-body">
        <button @click="pickCamera()">视角</button>
      </div>
    </div> -->
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/SpecialEffects/GlowLine";
import { pickCamera } from "@/utils/scene";
export default {
  name: "CesiumGlowLine",  
  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: {
    drawActivate(type) {
      CesiumInit.drawActivate(type);
    },
    
    pickCamera() {
      console.log(pickCamera(CesiumInit.viewer.scene));
    },
    clear() {
      CesiumInit.clear();
    }
  }
};
</script> 
 