<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">文字贴图</div>
      <div class="panel-body">
        <button @click="drawActivate('wall')">立体墙文字贴图</button>
        <button @click="drawActivate('polygon')">贴地多边形文字贴图</button>
        <div class="tip-item">点击对应的按钮后可以在场景中绘制对应的文字贴图对象，贴地多边形文字贴图绘制完整后点击面对象，修改文字的方向</div>
        <div class="tip-item">点击选中文字贴图对象后可以编辑几何信息和属性信息（调整文字字体大小能够改变清晰度）</div>
        <button @click="save()">保存</button>
        <button @click="clear()">清空</button>
      </div>
    </div>
    <EditPanel :plot="selectedPlot" v-if="selectedPlot" />
  </div>
</template>

<script> 
import EditPanel from "./EditPanel"; 
import CesiumInit from "@/js/SampleItems/Unclassified/TextMap";
export default {
  name: "CesiumTextMap",
  components: { 
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
    selectedPlotChangedEvent(selectedPlot) {
      this.selectedPlot = selectedPlot;
    },

    drawActivate(type) {
      CesiumInit.drawActivate(type);
    },

    clear() {
      CesiumInit.clear();
    },

    save() {
      CesiumInit.savePlots();
    }
  }
};
</script>
 