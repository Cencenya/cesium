<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <!-- <div class="panel">
      <div class="panel-body">
        <button @click="pickCamera">视角</button>
      </div>
    </div> -->
  </div>
</template>

<script> 
import   "@/assets/css/label3d.css"
import cesiumInit from "@/js/SampleItems/Unclassified/CesiumHeatMap"; 
import { pickCamera } from "@/utils/scene";

export default {
  name: "CesiumHeatMap", 
  data() {
    return {
      form: {
        value1: false
      }
    };
  },

  mounted() {
    cesiumInit.init ("cesium-container"); 
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