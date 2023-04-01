<template>
  <transition name="dialog-fade">
    <div v-show="visible" class="sm-dialog-wrapp" :class="{'sm-dialog-wrapp-modal':modal}">
      <div class="sm-dialog-container" :style="dialogStyle">
        <div class="sm-dialog-header">
          <span class="sm-dialog-header-title">{{title}}</span>
          <div class="sm-dialog-header-button-container">
            <span class="sm-dialog-close" v-if="showClose" title="关闭" @click="btnCloseClick">×</span>
          </div>
        </div>
        <div class="sm-dialog-body">
          <slot></slot>
        </div>
        <slot name="footer" />
      </div>
    </div>
  </transition>
</template>

<script>
import PopupManager from "../PopupManager";

export default {
  name: "SmDialog",
  data() {
    return {};
  },
  props: {
    modal: {
      type: Boolean,
      default: true
    },

    title: {
      type: String,
      default: ""
    },

    height: {
      type: Number
    },

    width: {
      type: Number
    },

    visible: {
      type: Boolean,
      default: false
    },

    showClose: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    dialogStyle() {
      return {
        height: (this.height || 300) + "px",
        width: (this.width || 400) + "px"
      };
    }
  },

  methods: {
    btnCloseClick() {
      this.$emit("beforClose");
      this.$emit("update:visible", false);
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.$el.style.zIndex = PopupManager.getIndex();
      }
    }
  }
};
</script> 