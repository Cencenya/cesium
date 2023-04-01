<template>
  <div class="sm-dialog-footer">
    <div class="sm-dialog-btn sm-dialog-btn-sur" @click="handleOk">确定</div>
    <div v-if="btnCancelShow" class="sm-dialog-btn sm-dialog-btn-cancel" @click="handleCancel">取消</div>
  </div>
</template>

<script>
export default {
  name: "SmDialogFooter",
  props: {
    btnCancelShow: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleCancel() { 
      this.$emit("btnCancelClick");
    },

    handleOk() {
      this.$emit("btnOkClick");
    }
  }
};
</script>

<style>
</style>