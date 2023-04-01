2<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">场景出图</div>
      <div class="panel-body" id="dd">
        <button @click="downLoad1()">下载场景出图</button>
        <button @click="downLoad2()">下载场景缩略图</button>
      </div>
    </div>
  </div>
</template>

<script>  
import CesiumInit from "@/js/SampleItems/Scene/SceneToFile";
export default {
  name: "CesiumSceneToFile",  
  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: {  
    downLoad1() {
      CesiumInit.downLoad1();
    },

    downLoad2() {
       CesiumInit.downLoad2(); 
    }
  }
};
</script>