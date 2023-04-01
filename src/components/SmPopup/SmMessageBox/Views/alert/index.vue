<!-- 警告对话框 当用户进行操作时会被触发，该对话框中断用户操作，直到用户确认知晓后才可关闭。-->
<!-- 进入对话框后 必须点击确定按钮才能关闭对话框 --> 
<template>
  <transition name="dialog-fade">
    <div v-if="show" class="sm-dialog-wrapp sm-dialog-wrapp-modal" :style="MessageStyle">
      <div class="sm-dialog-container">
        <div class="sm-dialog-header">
          <span class="sm-dialog-header-title">{{title}}</span>
        </div>
        <div class="sm-dialog-body">{{content}}</div>
        <SmDialogFooter @btnOkClick="okClick" :btnCancelShow="false"/> 
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
    }
  },

   components: {
    SmDialogFooter
  },

  computed: {
    MessageStyle() {
      return {
        zIndex: this.Index
      };
    }
  },

  methods: {
    okClick() { 
      //点击OK按钮
      if (this.confirmBtnClick) {
        this.confirmBtnClick();
      }
      this.show = false;
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
.sm-dialog-body{
  padding: 20px;
}
</style>
  