<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">倾斜模型动态分层单体化</div>
      <div class="panel-body">
        <div class="tip-item">鼠标左键点击楼栋，获取分层数据。</div>
        <div class="tip-item">获取分层数据后，鼠标点击每一层会高亮显示该层并展示该层相关信息</div>
        <div class="tip-item">默认手动加载了第某一栋的分层数据</div>
        <div class="tip-item">该实例有详细的数据制作教程和代码逻辑说明，目前只有几栋楼做了单体化数据哟，楼层颜色是随机生成的，所以看起来可能会有点花哨</div>
        <br />
        <button @click="getGuide">获取教程</button>
      </div>
    </div>

    <FloorInfoPanel v-if="feature" :feature="feature" />
  </div>
</template>

<script> 
import FloorInfoPanel from "./FloorInfoPanel"  
import cesiumInit from "@/js/SampleItems/DTH/FCDTH" 
import { pickCamera } from "@/utils/scene"

export default {
  name: "CesiumFCDTH", 
  components:{
    FloorInfoPanel
  },
  data() {
    return {
      feature: undefined //分层数据
    };
  },

  mounted() {
    cesiumInit.init("cesium-container");
    cesiumInit.FloorSelectedEvent.addEventListener(
      this.floorSelectedEventHandle,
      this
    ); //注册楼层选中事件
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: {  
    getCamera() {
        let p = pickCamera(cesiumInit.viewer.scene);
        console.log(p)
    },

    floorSelectedEventHandle(feature) {
      this.feature = feature;
      console.log(feature);
    },

    getGuide(){
      this.$message.info("先获取源码哟(＾Ｕ＾)ノ~ＹＯ");
    }
  }
};
</script>

 