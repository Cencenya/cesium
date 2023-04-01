<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">图标点+文字(primitive方式) </div>
      <div class="panel-body">
        <div class="tip-item">放大后才能看到文字</div>
        <!-- <button @click="pickCamera">视角</button> -->
      </div>
    </div>
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/PointObject/LabelBillboardCol";
import {pickCamera} from "@/utils/scene"
export default {
  name: "CesiumLabelBillboardCol",  
  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: { 
    pickCamera(){
      console.log(pickCamera(CesiumInit.viewer.scene))
    }
  }
};
</script>

 