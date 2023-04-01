<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">gltf模型绘制</div>
      <div class="panel-body">
        <button @click="drawActivate('fireMan')">消防员</button>
        <button @click="drawActivate('fireCar')">消防车</button>
        <button @click="drawActivate('police')">警察</button>
        <button @click="drawActivate('policeCar')">警车</button>
        <button @click="clear()">清空</button>
        <button @click="save()">保存</button>

        <div class="tip-item">点击“消防员”按钮后根据提示在场景中绘制消防员</div>
        <div class="tip-item">点击“消防车”按钮后根据提示在场景中绘制消防车</div>
        <div class="tip-item">点击“警察”按钮后根据提示在场景中绘制警察</div>
        <div class="tip-item">点击“消防车”按钮后根据提示在场景中绘制警车</div>
        <div class="tip-item">如果绘制后模型没有显示，可能是模型加载有点慢，加载时间与模型大小有关。</div>

        <br />
        <div>通过拖拽的方式绘制模型 按住图片拖动到场景中试试</div>
        <div class="symbol-container">
          <SymbolItem v-for="item in symbolList" :key="item.name" :symbolData="item" />
        </div>

        <br />
        <div>点击要编辑的模型，模型会高亮显示，此时可以鼠标左键按住模型进行移动，移动过程中模型不可见，但是有鼠标提示,释放鼠标结束编辑，可以在属性面板中编辑其他信息</div>
      </div>
    </div>
    <EditPanel v-if="selectedPlot!=undefined" :plot="selectedPlot" />
  </div>
</template>

<script> 
import EditPanel from "./EditPanel"; 
import SymbolItem from "./SymbolItem";
import CesiumInit from "@/js/SampleItems/LabelPlotting/GltfEdit";
export default {
  name: "CesiumGltfEdit",
  components: { 
    SymbolItem,
    EditPanel
  },
  data() {
    return {
      selectedPlot: undefined,
      symbolList: [
        {
          name: "警察",
          type: "Police",
          img: "../../../static/images/symbol/police.png"
        },
        {
          name: "警车",
          type: "PoliceCar",
          img: "../../../static/images/symbol/policeCar.png"
        },
        {
          name: "消防员",
          type: "FireMan",
          img: "../../../static/images/symbol/fireMan.png"
        },
        {
          name: "消防车",
          type: "FireCar",
          img: "../../../static/images/symbol/fireCar.png"
        }
      ]
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
      // CesiumInit.addPolice(position, data);
      switch (data.type) {
        case "Police":
          CesiumInit.addPolice(position);
          break;
        case "PoliceCar":
          CesiumInit.addPoliceCar(position);
          break;
        case "FireMan":
          CesiumInit.addFireMan(position);
          break;
        case "FireCar":
          CesiumInit.addFireCar(position);
          break;
      }
    };

    CesiumInit.gltfPlotLayer.selectedPlotChanged.addEventListener(
      this.selectedPlotChangedEvent,
      this
    );
  },

  beforeDestroy() {
    //注销拖拽事件
    CesiumInit.viewer.canvas.ondragover = undefined;
    CesiumInit.viewer.canvas.ondrop = undefined;

    CesiumInit.gltfPlotLayer.selectedPlotChanged.removeEventListener(
      this.selectedPlotChangedEvent,
      this
    );
    CesiumInit.destroy();
  },

  methods: {  
    drawActivate(type) {
      CesiumInit.drawActivate(type);
    },

    clear() {
      CesiumInit.clear();
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
 