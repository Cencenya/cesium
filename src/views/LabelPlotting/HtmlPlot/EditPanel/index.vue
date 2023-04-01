<template>
  <div class="attr-panel">
    <div class="attr-panel-header">
      <span class="attr-panel-header-title">标注信息</span>
    </div>
    <div class="attr-panel-body">
      <el-form ref="form" :model="plot" label-width="80px" size="mini">
        <el-form-item label="标绘内容">
          <el-input v-model="plot.properties.attr.label" @input="updateLabel"></el-input>
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
    updateLabel(value) {
      this.plot.updateLabel(value);
    }
  }
};
</script>