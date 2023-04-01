<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div>
    <!-- <div class="panel">
      <div class="panel-header"></div>
      <div class="panel-body">
        <button @click="pickCamera">视角</button>
      </div>
    </div> -->
  </div>
</template>

<script>
import cesiumInit from "@/js/SampleItems/SpecialEffects/PolylineDynamic";
import { pickCamera } from "@/utils/scene";

export default {
  name: "CesiumPolylineDynamic",
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
 