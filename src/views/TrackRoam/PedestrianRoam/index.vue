<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <!-- <div class="panel">
      <div class="panel-header">跟随视角漫游</div>
      <div class="panel-body">
        <button @click="start">开始</button>
        <div class="tip-item">点击“开始”按钮开漫游</div>
      </div>
    </div> -->
  </div>
</template>

<script>  
import CesiumInit from "@/js/SampleItems/TrackRoam/PedestrianRoam";
export default {
  name: "CesiumPedestrianRoam",  
  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: { 
    start() {
      CesiumInit.initRoamLine();
    }, 
  }
};
</script>

 