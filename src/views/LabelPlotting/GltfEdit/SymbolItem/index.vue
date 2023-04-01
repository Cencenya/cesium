<template>
  <div class="symbol-item" @dragstart="dragStartEvent($event)">
    <img class="symbol-img"   :src="symbolData.img" />
    <span class="symbol-name" >{{symbolData.name}}</span>
  </div>
</template>
<script>
 
export default {
  props: {
    symbolData: {
      type: Object
    }
  },

  data() {
    return {
      
    };
  },

  computed: {
    
  },

  mounted() {  
   
  }, 

  methods: {
    dragStartEvent($event) { 
      $event.dataTransfer.setData("symbolData", JSON.stringify(this.symbolData));
    }
  }
};
</script>

<style   scoped>

.symbol-item {
  margin: 2px;
  height: 134px;
  width: 134px;
  display: inline-block;
  position: relative;
}
.symbol-img {
  height: 134px;
  width: 134px;
}

.symbol-name {
  display: inline-block;
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 100%;
  text-align: center;
  background: #14549e;
  color: white;
}

.symbol-name-disabled {
  background: #ff000094;
}
</style>