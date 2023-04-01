<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">点线面编辑扩展</div>
      <div class="panel-body">
        <button @click="drawActivate('marker')">点</button>
        <button @click="drawActivate('text')">文本</button>
        <button @click="drawActivate('polyline')">线</button>
        <button @click="drawActivate('polygon')">面</button>
        <button @click="drawActivate('circle')">圆</button>
        <button @click="drawActivate('rectangle')">矩形</button>
        <button @click="clearDraw">清空</button>
        <button @click="save()">保存</button>
        <div class="tip-item">除了简单点线面外，新增文本、圆、矩形等对象，并能够保存为json文件，从json文件加载</div>
      </div>
    </div>

    <EditPanel v-if="selectedPlot!=undefined" :plot="selectedPlot" />
  </div>
</template>

<script>  
import CesiumInit from "@/js/SampleItems/DrawEdit/EntityEditExt"; 
import EditPanel from "./EditPanel"; 
export default {
  name: "CesiumEntityEditExt", 
  components:{
    EditPanel
  },
  data() {
    return {
      selectedPlot: undefined
    };
  },

  mounted() {
    CesiumInit.init("cesium-container");
    CesiumInit.plotLayer.selectedPlotChanged.addEventListener(
      this.selectedPlotChangedEvent,
      this
    );
  },

  beforeDestroy() {
    CesiumInit.plotLayer.selectedPlotChanged.removeEventListener(
      this.selectedPlotChangedEvent,
      this
    );
    CesiumInit.destroy();
  },

  methods: { 
    drawActivate(type) {
      CesiumInit.drawActivate(type);
    },

    clearDraw() {
      CesiumInit.clearDraw();
    },

    save() {
      CesiumInit.savePlots();
    },

    selectedPlotChangedEvent(selectedPlot) {
      if (selectedPlot && selectedPlot.properties.plotType == "text") {
        this.selectedPlot = selectedPlot;
      } else {
        this.selectedPlot = undefined;
      }
    }
  }
};
</script>
 