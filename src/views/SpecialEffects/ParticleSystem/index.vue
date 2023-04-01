<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">Cesium粒子系统</div>
      <div class="panel-body">
        <div class="symbol-container">
          <SymbolItem v-for="item in symbolList" :key="item.name" :symbolData="item" />
        </div>
        <div class="tip-item">按住图片拖放到场景中进行添加</div>
        <div class="tip-item">选中粒子对象在属性面板中可以修改属性或者删除粒子对象</div>
        <div class="tip-item">点击保存按钮将粒子对象数据保存到json文件中，支持从文件中加载</div>
        <br />
        <button @click="clear()">清空</button>
        <button @click="save()">保存</button>
      </div>
    </div>

    <EditPanel v-if="selectedPlot!=undefined" :plot="selectedPlot" @delClickEvent="delClickEvent" />
  </div>
</template>

<script>  
import SymbolItem from "./SymbolItem";
import EditPanel from "./EditPanel";

import CesiumInit from "@/js/SampleItems/SpecialEffects/ParticelSystem";
import { pickCamera } from "@/utils/scene";
export default {
  name: "CesiumParticelSystem",
  components: { 
    SymbolItem,
    EditPanel
  },
  data() {
    return {
      symbolList: [
        {
          name: "火焰",
          type: "fire",
          symbolImage: "../../../static/images/symbol/fire.jpg"
        },
        {
          name: "喷泉",
          type: "fountain",
          symbolImage: "../../../static/images/symbol/fountain.jpg"
        }
        // {
        //   name: "水枪",
        //   type: "waterGun",
        //   symbolImage: "../../../static/images/symbol/waterGun.png"
        // },
      ],
      selectedPlot: undefined
    };
  },

  mounted() {
    CesiumInit.init("cesium-container");

    //注册拖拽结束事件
    CesiumInit.viewer.canvas.ondragover = event => {
      event.preventDefault();
    };

    CesiumInit.viewer.canvas.ondrop = event => {
      event.preventDefault();
      var data = JSON.parse(event.dataTransfer.getData("symbolData"));
      if (!data) return;
      let c2 = new Cesium.Cartesian2(event.offsetX, event.offsetY);
      let position = CesiumInit.viewer.scene.pickPosition(c2);
      switch (data.type) {
        case "fire":
          CesiumInit.addFire(position);
          break;
        case "fountain":
          CesiumInit.addFountain(position);
          break;
      }
    };

    CesiumInit.particlePlotLayer.selectedPlotChanged.addEventListener(
      this.selectedPlotChangedEvent,
      this
    );
  },

  beforeDestroy() {
    //注销拖拽事件
    CesiumInit.viewer.canvas.ondragover = undefined;
    CesiumInit.viewer.canvas.ondrop = undefined;

    CesiumInit.particlePlotLayer.selectedPlotChanged.removeEventListener(
      this.selectedPlotChangedEvent,
      this
    );
    CesiumInit.destroy();
  },

  methods: {  
    clear() {
      CesiumInit.clear();
    },

    delClickEvent(plotCode) {
      CesiumInit.particlePlotLayer.removeByPlotCode(plotCode);
      this.selectedPlot = undefined;
    },

    save() {
      CesiumInit.savePlots();
    },

    selectedPlotChangedEvent(selectedPlot) {
      this.selectedPlot = selectedPlot;
    }
  }
};
</script>

<style   scoped>
.symbol-container {
  text-align: center;
}
</style>
 