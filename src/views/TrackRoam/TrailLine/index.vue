<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">Cesium轨迹回放</div>
      <div class="panel-body">
        <button @click="start">开始</button>
        <div class="tip-item">可以自由设置轨迹播放速度，监听站点达到事件，展示站点相关信息</div>
      </div>
    </div>
  </div>
</template>

<script>  
import CesiumInit from "@/js/SampleItems/TrackRoam/TrailLine";
export default {
  name: "CesiumTrailLine",  
  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: { 
    start() {
      CesiumInit.initTrackLine();
    }
  }
};
</script>

 