<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">线段等分</div>
      <div class="panel-body">
        <label>分段数：</label>
        <input type="text" v-model="count" />
        <button @click="drawActivate('Point')">绘制起点或终点</button>
      </div>
    </div>
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/Analysis/BisectionLine";
export default {
  name: "CesiumBisectionLine",  
  data() {
    return {
      count: 10
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
      CesiumInit.drawActivate(type, this.count);
    }
  }
};
</script>

 