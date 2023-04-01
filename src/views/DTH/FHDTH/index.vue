<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">倾斜模型动态分户单体化</div>
      <div class="panel-body">
        <div class="tip-item">鼠标左键点击想要查看的某一层会加载该层对应的分户数据，加载分户数据后点击某一户室高亮显示并展示信息</div>
        <div class="tip-item">默认加载了某一层的户室信息，可以点击其他楼层看看</div>
        <br />
        <button @click="getGuide">获取教程</button>
      </div>
    </div>

    <HouseInfoPanel v-if="feature" :feature="feature" />
  </div>
</template>

<script> 
import HouseInfoPanel from "./HouseInfoPanel"; 
import cesiumInit from "@/js/SampleItems/DTH/FHDTH";
import { pickCamera } from "@/utils/scene"
export default {
  name: "CesiumFHDTH", 
  components:{
    HouseInfoPanel
  } ,
  data() {
    return {
      feature: undefined //分层数据
    };
  },

  mounted() {
    cesiumInit.init("cesium-container");
    //注册户室选中事件 选中时展示户室对应的属性数据
    cesiumInit.HouseSelectedEvent.addEventListener(
      this.houseSelectedEvent,
      this
    );
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: {  
    getCamera() {
      let p = pickCamera(cesiumInit.viewer.scene);
      console.log(p);
    },

    houseSelectedEvent(feature) {
      this.feature = feature;
    },

    getGuide() {
      this.$message.info("先获取源码哟(＾Ｕ＾)ノ~ＹＯ");
    }
  }
};
</script> 