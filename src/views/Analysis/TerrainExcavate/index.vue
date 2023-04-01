<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">地形开挖（材质）</div>
      <div class="panel-body">
        <div>
          <span>开挖深度：</span>
          <el-input v-model="depth" style="width:200px;height:30px"></el-input>
        </div>
        <button @click="drawActivate('Polygon')">绘制多边形</button>
        <button @click="clear">清除</button>
        <div class="tip-item">默认开挖深度200米，可自由设置</div>
        <div class="tip-item">目前仅支持凸多边形，如果绘制的是凹多边形，可能开挖结果不正确</div>
      </div>
    </div>
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/Analysis/TerrainExcavate";
import { pickCamera } from "@/utils/scene";
export default {
  name: "CesiumTerrainExcavate",  
  data() {
    return {
      depth: 200
    };
  },

  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: {  
    drawActivate(type) {
      CesiumInit.drawActivate(type, this.depth);
    },

    clear() {
      CesiumInit.clear();
      //console.log(pickCamera(CesiumInit.viewer.scene));
    }
  }
};
</script>

<style  scoped>
.panel-body /deep/ input {
  height: 26px;
}
</style>
 