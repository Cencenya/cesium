<template>
  <div class="attr-panel">
    <div class="attr-panel-header">
      <span class="attr-panel-header-title">Gltf模型编辑</span>
    </div>
    <div class="attr-panel-body">
      <el-form ref="form" :model="plot" label-width="80px" size="mini">
        <el-form-item label="模型名称">
          <el-input v-model="plot.properties.attr.name" readonly></el-input>
        </el-form-item>
        <el-form-item label="模型角度">
          <el-slider
            @input="updateHeading"
            :min="0"
            :max="360"
            v-model="plot.properties.style.heading"
          ></el-slider>
        </el-form-item>
        <el-form-item label="模型比例">
          <el-slider
            @input="updateScale"
            :step="0.2"
            :min="0.5"
            :max="10"
            v-model="plot.properties.style.scale"
          ></el-slider>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    plot: {
      type: Object
    }
  },
  methods: {
    updateHeading(value) {
      this.plot.updateHeading(value);
    },

    updateScale(value) {
      this.plot.setScale(value);
    }
  }
};
</script>