<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">可视域分析</div>
      <div class="panel-body">
        <div class="tip-item">提示：单击“添加可视域”后，图上左键绘制两点即可</div> 
        <button @click="add">添加可视域</button>
        <button @click="clear">清除</button>
      </div>
    </div>
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/Analysis/ViewShedStage";
export default {
  name: "CesiumViewShedStage", 
  mounted() {
    CesiumInit.init("cesium-container");
    CesiumInit.viewShedDraw.DrawEndEvent.addEventListener(viewShedStage => {
      this.viewShedStage = viewShedStage; 
    });
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: { 
    add() {
      this.clear();
      CesiumInit.add();
    },

    clear() {
      if (this.viewShedStage) {
        this.viewShedStage.clear();
        this.viewShedStage = undefined;
      }
    }, 
  }
};
</script> 

<style   scoped>
.panel /deep/ .el-form-item__label {
  color: white;
}

.panel /deep/ .el-form-item {
  margin-bottom: 0px;
}
</style>