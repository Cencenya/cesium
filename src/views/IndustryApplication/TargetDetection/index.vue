<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">动态目标检测</div>
      <div class="panel-body"> 
        <button @click="targetStartRun">目标开始运动</button>
      </div>
    </div> 
  </div>
</template>

<script>  
import cesiumInit from "@/js/SampleItems/IndustryApplication/TargetDetection";
export default {
  name: "CesiumHedronPlot", 
  data() {
    return {
      
    };
  },

  mounted() {
    cesiumInit.init("cesium-container"); 

    //注册目标进入 离开事件
    cesiumInit.hedronPlotLayer.targetEnterHedronEvent.addEventListener(plot => {
      this.$message("目标进入" + plot.properties.plotCode);
    });
    cesiumInit.hedronPlotLayer.targetLeaveHedronEvent.addEventListener(plot => {
      this.$message("目标离开" + plot.properties.plotCode);
    });
  },

  beforeDestroy() { 
    cesiumInit.destroy();
  },

  methods: { 
    targetStartRun() {
      cesiumInit.initRoamLine();
    }
  }
};
</script>

 