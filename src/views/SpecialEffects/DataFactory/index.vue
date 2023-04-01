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
import CesiumInit from "@/js/SampleItems/SpecialEffects/DataFactory";
import { pickCamera } from "@/utils/scene";
export default {
  name: "CesiumDataFactory", 
  data() {
    return {};
  },

  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: {  
    pickCamera() {
      console.log(pickCamera(CesiumInit.viewer.scene));
    }
  }
};
</script>

 