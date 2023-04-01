<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <!-- <div class="panel">
      <div class="panel-header">动态立体墙（升级）</div>
      <div class="panel-body">
        <button @click="pickCamera">视角</button>
      </div>
    </div> -->
  </div>
</template>

<script>  
import cesiumInit from "@/js/SampleItems/SpecialEffects/RegularWall"; 
import { pickCamera } from "@/utils/scene";

export default {
  name: "CesiumRegularWall",  
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
 