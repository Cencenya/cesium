<template>
  <div class="app-wrapp">
    <div class="cesium-container" id="cesium-container"></div> 
    <div class="panel">
      <div class="panel-header">书签管理</div>
      <div class="panel-body">
        <div class="action-container">
          <el-input v-model="bookmarkName" placeholder="输入书签名称" />
          <button class="action-add" @click="addEvent">添加</button>
        </div>
        <div class="bookmark-list">
          <BookMarkItem
            v-for="(item, index) in bookmarkList"
            :key="index"
            :bookmarkData="item"
            @bookmarkClickEvent="bookmarkClickEvent"
            @delClick="delBookMarkEvent"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>  
import BookMarkItem from "./BookMarkItem"; 
import cesiumInit from "@/js/SampleItems/Scene/BookMark";
import { pickCamera, getSceneImage } from "@/utils/scene";

export default {
  name: "CesiumBookMark", 
  components:{
    BookMarkItem
  },
  data() {
    return {
      bookmarkName: "",
      bookmarkList: []
    };
  },

  mounted() {
    cesiumInit.init("cesium-container");
  },

  beforeDestroy() {
    cesiumInit.destroy();
  },

  methods: { 
    addEvent() {
      if (this.bookmarkName == "") {
        this.$message.error("请输入正确的书签名称！！！");
        return;
      }

      getSceneImage(cesiumInit.viewer.scene, 200, 300).then(img => {
        let c = pickCamera(cesiumInit.viewer.scene);
        this.bookmarkList.push({
          guid: new Date().getTime(),
          name: this.bookmarkName,
          camera: c,
          img: img
        });
      });
    },

    bookmarkClickEvent(bookmarkData) {
      let flyToOpts = {
        destination: {
          x: bookmarkData.camera.x,
          y: bookmarkData.camera.y,
          z: bookmarkData.camera.z
        },
        orientation: {
          heading: bookmarkData.camera.heading,
          pitch: bookmarkData.camera.pitch,
          roll: bookmarkData.camera.roll
        }
      };
      cesiumInit.viewer.scene.camera.flyTo(flyToOpts);
    },

    delBookMarkEvent(bookmarkData) {
      this.delBookMarkFromList(bookmarkData);
    },

    delBookMarkFromList(bookmarkData) {
      for (let i = 0; i < this.bookmarkList.length; i++) {
        const item = this.bookmarkList[i];
        if (item.guid == bookmarkData.guid) {
          this.bookmarkList.splice(i, 1);
          return;
        }
      }
    }
  }
};
</script> 

<style scoped>
.bookmark-list {
  min-height: 200px;
  max-height: 800px;
  margin-top: 10px;
  overflow: auto;
}
.panel-body /deep/ input {
  height: 34px;
}

.action-container {
  display: flex;
  align-items: center;
}

.panel-body button {
  width: 80px;
  margin-left: 10px;
}
</style>