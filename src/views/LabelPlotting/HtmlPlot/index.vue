<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">html标注图层</div>
      <div class="panel-body">
        <button @click="drawActivate(0)">简单文本</button>
        <button @click="drawActivate(1)">渐变文本</button>
        <button @click="clear">清空</button>
        <button @click="save">保存</button>

        <div class="tip-item">点击“简单文本”按钮后在场景中鼠标左键点击添加标注对象</div>
        <div class="tip-item">点击“渐变文本”按钮后在场景中鼠标左键点击添加渐变色标注对象</div>

        <div class="tip-item">选中对象后按钮底部的小圆点进行位置的拖动</div>

        <div class="tip-item">点击“清空”按钮删除所有标注</div>
        <div class="tip-item">点击“保存”按钮将所有标注保存到json文件（支持从json文件导入）</div>
      </div>
    </div>
    <EditPanel v-if="selectedPlot!=undefined" :plot="selectedPlot" />
  </div>
</template>

<script> 
import EditPanel from "./EditPanel"; 
import CesiumInit from "@/js/SampleItems/LabelPlotting/HtmlPlot";
export default {
  name: "CesiumHtmlPlot",  
  components:{
    EditPanel
  },
  data(){
    return{
      selectedPlot:undefined
    }
  },

  mounted() {
    CesiumInit.init("cesium-container");
    CesiumInit.labelLayer.selectedPlotChanged.addEventListener(
      this.selectedPlotChangedEvent,
      this
    );
  },

  beforeDestroy() {
    CesiumInit.labelLayer.selectedPlotChanged.removeEventListener(
      this.selectedPlotChangedEvent,
      this
    );
    CesiumInit.destroy();
  },

  methods: {  
    drawActivate(labelType) {
      CesiumInit.drawActivate(labelType);
    },

    selectedPlotChangedEvent(selectedPlot) {
      this.selectedPlot = selectedPlot;
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

 