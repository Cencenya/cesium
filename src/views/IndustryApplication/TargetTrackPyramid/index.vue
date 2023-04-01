<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">雷达追踪四棱锥体</div>
      <div class="panel-body">
        <div class="tip-item">给定雷达点与目标点位置，自动计算目标点方向，生成追踪四棱锥体</div>
        <!-- <button @click="pickCamera">视角</button> -->
      </div>
    </div>
  </div>
</template>

<script>  
import { pickCamera } from "@/utils/scene"; 
import CesiumInit from "@/js/SampleItems/IndustryApplication/TargetTrackPyramid";
export default {
  name: "CesiumTargetTrackCone", 
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
 