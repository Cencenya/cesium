<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">视频墙（含编辑）</div>
      <div class="panel-body">
        <button @click="drawActivate('wall')">绘制视频墙</button>   
        <button @click="save()">保存</button>
        <button @click="clear()">清空</button>
         <div class="tip-item">
          点击“绘制视频墙”按钮，根据提示在场景中绘制视频墙
        </div>
        <div class="tip-item">
          选中墙体，显示属性面板，调整视频墙的属性，拖动相关节点进行位置节点移动
        </div>
      </div>
    </div>
    <EditPanel :plot="selectedPlot" v-if="selectedPlot" />
  </div>
</template>

<script> 
import EditPanel from "./EditPanel"; 
import cesiumInit from "@/js/SampleItems/IndustryApplication/VideoWall";
import { pickCamera } from "@/utils/scene";
export default {
  name: "CesiumVideoWall",
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
    cesiumInit.plotLayer.selectedPlotChanged.addEventListener(
      this.selectedPlotChangedEvent,
      this
    );
  },

  beforeDestroy() {
    cesiumInit.plotLayer.selectedPlotChanged.removeEventListener(
      this.selectedPlotChangedEvent,
      this
    );
    cesiumInit.destroy();
  },

  methods: { 
    selectedPlotChangedEvent(selectedPlot) {
      this.selectedPlot = selectedPlot;
    },

    drawActivate(type) {
      cesiumInit.drawActivate(type);
    },

    clear() {
       cesiumInit.clear();
      //console.log(pickCamera(cesiumInit.viewer.scene));
    },

    save() {
      cesiumInit.savePlots();
    }
  }
};
</script>
 