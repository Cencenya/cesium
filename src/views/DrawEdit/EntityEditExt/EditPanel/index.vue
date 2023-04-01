<template>
  <div class="attr-panel">
    <div class="attr-panel-header">
      <span class="attr-panel-header-title">属性编辑</span>
    </div>
    <div class="attr-panel-body">
      <el-form ref="form" :model="plot" label-width="80px" size="mini">
        <el-form-item label="文本内容">
          <el-input v-model="plot.properties.attr.text" @input="changeText"></el-input>
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
    changeText() {
      this.plot.updateText();
    }
  }
};
</script>