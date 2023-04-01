<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <!-- <div class="panel">
      <div class="panel-body"></div>
    </div> -->
  </div>
</template>

<script> 
import cesiumInit from "@/js/SampleItems/Scene/Cloud";

export default {
  name: "CesiumCloud", 
  data() {
    return {};
  },

  mounted() {
    cesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: { 
  }
};
</script>

 