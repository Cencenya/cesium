<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">体标绘</div>
      <div class="panel-body">
        <button @click="drawActivate('polyhedron')">多边体</button>
        <button @click="drawActivate('hemisphere')">半球体</button>
        <button @click="drawActivate('cylinder')">圆柱体</button>
        <button @click="clear">清空</button>
        <button @click="save">保存</button>
        <br />
        <div class="tip-item">点击对应按钮，根据提示在场景中绘制体对象</div>
        <div class="tip-item">选中已经绘制的体对象进行编辑，选中体对象高亮后，按住体对象进行移动，或者按住节点进行移动</div>
        <!-- <button @click="pickCamera">视角</button> -->
      </div>
    </div>

    <EditPanel v-if="selectedPlot!=undefined" :plot="selectedPlot" />
  </div>
</template>

<script> 
import EditPanel from "./EditPanel"; 
import cesiumInit from "@/js/SampleItems/LabelPlotting/HedronPlot";
import { pickCamera } from "@/utils/scene";
export default {
  name: "CesiumHedronPlot",
  components: { 
    EditPanel
  },

  data() {
    return {
      selectedPlot: undefined
    };
  },

  mounted() {
    cesiumInit.init("cesium-container");

    cesiumInit.hedronPlotLayer.selectedPlotChanged.addEventListener(
      this.selectedPlotChangedEvent,
      this
    );

    //注册目标进入 离开事件
    cesiumInit.hedronPlotLayer.targetEnterHedronEvent.addEventListener(plot => {
      this.$message("目标进入" + plot.properties.plotCode);
    });
    cesiumInit.hedronPlotLayer.targetLeaveHedronEvent.addEventListener(plot => {
      this.$message("目标离开" + plot.properties.plotCode);
    });
  },

  beforeDestroy() {
    cesiumInit.hedronPlotLayer.selectedPlotChanged.removeEventListener(
      this.selectedPlotChangedEvent,
      this
    );
    cesiumInit.destroy();
  },

  methods: { 
    drawActivate(type) {
      cesiumInit.drawActivate(type);
    },

    clear() {
      cesiumInit.clear();
    },

    save() {
      cesiumInit.savePlots();
    },

    selectedPlotChangedEvent(selectedPlot) {
      this.selectedPlot = selectedPlot;
    },

    targetStartRun() {
      cesiumInit.initRoamLine();
    },

    pickCamera() {
      console.log(pickCamera(cesiumInit.viewer.scene));
    }
  }
};
</script>

 