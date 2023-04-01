<template>
  <div class="attr-panel">
    <div class="attr-panel-header">
      <span class="attr-panel-header-title">属性编辑</span>
    </div>
    <div class="attr-panel-body">
      <el-form ref="form" :model="plot" label-width="100px" size="mini">
        <el-form-item label="粒子名称">
          <el-input v-model="plot.properties.attr.name" readonly></el-input>
        </el-form-item>

        <el-form-item label="粒子编号">
          <el-input v-model="plot.properties.plotCode" readonly></el-input>
        </el-form-item>

        <el-form-item label="粒子数量">
          <el-slider
            @change="updateStyle"
            :min="0"
            :max="1000"
            v-model="plot.properties.style.emissionRate"
          ></el-slider>
        </el-form-item>

        <el-form-item label="粒子大小">
          <el-slider
            @change="updateStyle"
            :min="0"
            :max="60.0"
            :step="1"
            v-model="plot.properties.style.particleSize"
          ></el-slider>
        </el-form-item>

        <el-form-item label="最小生命周期">
          <el-slider
            @change="updateStyle"
            :min="0.1"
            :max="5.0"
            :step="0.2"
            v-model="plot.properties.style.minimumParticleLife"
          ></el-slider>
        </el-form-item>

        <el-form-item label="最大生命周期">
          <el-slider
            @change="updateStyle"
            :min="0.1"
            :max="5.0"
            :step="0.2"
            v-model="plot.properties.style.maximumParticleLife"
          ></el-slider>
        </el-form-item>

        <el-form-item label="最小速度">
          <el-slider
            @change="updateStyle"
            :min="0.0"
            :max="30.0"
            :step="1"
            v-model="plot.properties.style.minimumSpeed"
          ></el-slider>
        </el-form-item>

        <el-form-item label="最大速度">
          <el-slider
            @change="updateStyle"
            :min="0.0"
            :max="30.0"
            :step="1"
            v-model="plot.properties.style.maximumSpeed"
          ></el-slider>
        </el-form-item>

        <el-form-item label="初始比例">
          <el-slider
            @change="updateStyle"
            :min="0.0"
            :max="10.0"
            :step="1"
            v-model="plot.properties.style.startScale"
          ></el-slider>
        </el-form-item>

        <el-form-item label="终止比例">
          <el-slider
            @change="updateStyle"
            :min="0.0"
            :max="10.0"
            :step="1"
            v-model="plot.properties.style.endScale"
          ></el-slider>
        </el-form-item>

        <el-form-item label="重力">
          <el-slider
            @change="updateStyle"
            :min="-20"
            :max="20"
            :step="1"
            v-model="plot.properties.style.gravity"
          ></el-slider>
        </el-form-item>

        <el-form-item>
          <div style=" text-align: right">
            <el-button type="danger" @click="delClickEvent">删除粒子</el-button>
          </div>
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
    updateStyle() {
      //console.log(this.plot.properties.style);
      this.plot.updateStyle();
    },

    delClickEvent() {
      this.$emit("delClickEvent", this.plot.properties.plotCode);
    }
  }
};
</script>

<style   scoped>
.attr-panel-body /deep/ .el-form-item--mini.el-form-item,
.attr-panel-body /deep/ .el-form-item--small.el-form-item {
  margin-bottom: 0px;
}
</style>