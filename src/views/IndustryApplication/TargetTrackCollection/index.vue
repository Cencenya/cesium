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
import { pickCamera } from "@/utils/scene";

import CesiumInit from "@/js/SampleItems/IndustryApplication/TargetTrackCollection";
export default {
  name: "CesiumTargetTrackCollection", 
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
 