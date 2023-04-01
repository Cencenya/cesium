<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">自定义天空盒</div>
      <div class="panel-body">
        <div class="tip-item">含3套近景天空盒1套远景天空盒</div>
        <div class="tip-item">
          <button @click="clickEvent(0)">近景1</button>
          <button @click="clickEvent(1)">近景2</button>
          <button @click="clickEvent(2)">近景3</button>
          <button @click="clickEvent1()">远景</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/Scene/SkyBox"; 
export default {
  name: "CesiumSkyBox",  
  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: {  
    clickEvent(index) {
      CesiumInit.changeSkyBox(index);
    },

    clickEvent1() {
      CesiumInit.flyToHome();
    }
  }
};
</script>
 