<!-- 确认对话框 当用户进行操作时会被触发，提示用户确认其已经触发的动作，并询问是否进行此操作时会用到此对话框。-->
<!-- 进入对话框后 需点击确认或者取消按钮 点击关闭按钮等同于点击取消按钮 --> 
<!-- 应用场景 增删改确认对话框 -->
<template>
  <transition name="dialog-fade">
    <div v-if="show" class="sm-dialog-wrapp sm-dialog-wrapp-modal" :style="MessageStyle">
      <div class="sm-dialog-container">
        <div class="sm-dialog-header">
          <span class="sm-dialog-header-title">{{title}}</span>
          <div class="sm-dialog-header-button-container">
            <span class="sm-dialog-close" title="关闭" @click="handleCancel">×</span>
          </div>
        </div>
        <div class="sm-dialog-body">{{content}}</div>
        <SmDialogFooter @btnOkClick="handleOk" @btnCancelClick="handleCancel"/> 
      </div>
    </div>
  </transition>
</template>

<script>
import PopupManager from "../../../PopupManager";
import SmDialogFooter from "../../../SmDialogFooter";
export default {
  data() {
    return {
      show: false,
      Index: ""
    };
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    showClose: {
      type: Boolean,
      default: true
    }
  },
  components: {
    SmDialogFooter
  },
  methods: {
    handleOk() {
      if (this.confirmBtnClick) {
        this.confirmBtnClick();
      }
      this.show = false;
    },

    handleCancel() {
      if (this.cancelBtnClick) {
        this.cancelBtnClick();
      }
      this.show = false;
    }
  },

  computed: {
    MessageStyle() {
      return {
        zIndex: this.Index
      };
    }
  },

  watch: {
    show(val) {
      if (val) {
        this.Index = PopupManager.getIndex();
      }
    }
  }
};
</script>

<style lang="css" scoped>
.sm-dialog-container {
  height: 210px;
  width: 400px;
}
.sm-dialog-body {
  padding: 20px;
}
</style>
  