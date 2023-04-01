<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">军事标绘编辑</div>
      <div class="panel-body">
        <button @click="activateDraw('polygon')">面</button>
        <button @click="activateDraw('circle')">正圆</button>
        <button @click="activateDraw('ellipse')">椭圆</button>
        <button @click="activateDraw('sector')">扇形</button>
        <button @click="activateDraw('rectangle')">矩形</button>
        <button @click="activateDraw('closedcurve')">曲线面</button>
        <button @click="activateDraw('finearrow')">直箭头</button>
        <button @click="activateDraw('assaultdirection')">突击方向</button>
        <button @click="activateDraw('attackarrow')">进攻方向</button>
        <button @click="activateDraw('tailedattackarrow')">进攻方向尾</button>
        <button @click="activateDraw('gatheringplace')">集结地</button>
        <button @click="activateDraw('doublearrow')">钳击</button>
        <button @click="activateDraw('squadcombat')">分队战斗</button>
        <button @click="activateDraw('tailedsquadcombat')">分队战斗尾</button>
        <div>
          <button @click="clear">清空</button>
          <button @click="save">保存</button>
          <div class="tip-item">点击选中要编辑的对象，即可开始编辑，点击空白处结束编辑</div>
          <div class="tip-item">绘制或者编辑结束后点击“保存”按钮将绘制的内容保存到json文件（支持从json文件加载标绘内容）</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>  
import cesiumInit from "@/js/SampleItems/LabelPlotting/MilitaryPlotEdit";
export default {
  name: "CesiumMilitaryPlot",  
  mounted() {
    cesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    cesiumInit.destroy(); //销毁Cesium资源
  },
  methods: {
    activateDraw(plotType) {
      cesiumInit.activateDraw(plotType);
    }, 
    save() {
      cesiumInit.savePlots();
    },
    clear() {
      cesiumInit.clear();
    }
  }
};
</script>
 

 