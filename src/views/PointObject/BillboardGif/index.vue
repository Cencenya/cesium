<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
  </div>
</template>

<script> 
import CesiumInit from "@/js/SampleItems/PointObject/BillboardGif";
export default {
  name: "CesiumBillboardGif", 
  mounted() {
    CesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    CesiumInit.destroy();
  },

  methods: { 
  }
};
</script>

 