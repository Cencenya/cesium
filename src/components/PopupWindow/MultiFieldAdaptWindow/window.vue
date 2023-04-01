<template>
  <div class="window-container" v-if="show">
    <div class="window-header">
      <span class="window-title">{{title}}</span>
      <span class="window-close" title="关闭" @click="closeClick">×</span>
    </div>
    <div class="window-body">
      <div v-for="(field,index) in fields" :key="index" class="window-info-item">
        <span class="window-ifno-label" :style="getFieldStyle()">{{field}}：</span>
        <span class="window-ifno-text">{{formatValue(values[index])}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "MultiFieldAdaptWindow",
  data(){
    return {
      show:true
    }
  },
  props: {
    title: {
      type: String,
      default: "标题"
    },
    values: {
      type: Array,
      default() {
        return [];
      }
    },
    fields: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  methods: {
    formatValue(val) {
      if (val.length > 30) {
        return val.substr(0, 30);
      }

      return val;
    },

    getFieldWidth() {
      return this.fields.length * 20; //按一个字符20像素处理
    },

    getFieldStyle() {
      return {
        width: this.getFieldWidth() + "px"
      };
    },

    closeClick() {
      if (this.closeEvent) {
        this.closeEvent();
      }
    }
  }
};
</script>

<style lang="css" scoped>
.window-container {
  position: absolute;
  left: 0px;
  bottom: 0px;
  min-width: 350px;
  min-height: 200px;
  color: white;
  background-color: rgba(18, 93, 120, 0.65);
}

.window-container::before {
  position: absolute;
  content: "";
  top: 100%;
  left: calc(50% - 20px);
  border: 20px solid transparent;
  border-top: 40px solid rgba(18, 93, 120, 0.65);
}

.window-header {
  height: 30px;
  line-height: 30px;
  color: white;
  min-width: 200px;
  padding: 0px 10px;
  background: #00adff7d;
  position: relative;
  user-select: none;
}

.window-close {
  position: absolute;
  right: 1px;
  font-size: 25px;
  cursor: pointer;
  width: 29px;
  text-align: center;
}

.window-close:hover {
  background: #dc2929b9;
}

.window-body {
  padding: 5px;
}

.window-info-item {
  margin: 14px 0px;
  max-width: 350px;
}

.window-ifno-label {
  display: inline-block;
  min-width: 60px;
  text-align: justify;
  text-align-last: justify;
}
</style>