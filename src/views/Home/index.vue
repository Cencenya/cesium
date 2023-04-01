<template>
  <div class="app-home">
    <AppHeader />
    <AppLogo @logoClick="logoClick" />
    <AppTitle appTitle="Cesium 实战  （基于原生Cesium 1.72）" />
    <Actions />
    <div class="sample-items">
      <div class="items" id="sample-items">
        <Item
          v-for="item  in samples"
          :key="item.path"
          :sampleItem="item"
          :activePath="activePath"
          @itemClick="itemClick"
        />
      </div>
    </div>
  </div>
</template>
<script>
import AppHeader from "@/components/AppLayout/AppHeader";
import AppTitle from "@/components/AppLayout/AppTitle";
import AppLogo from "@/components/AppLayout/AppLogo";
import Item from "./ExampleItemCard";
import Actions from "@/components/AppLayout/Actions";
import samples from "@/router/routers";

export default {
  name: "OrderList",
  components: {
    AppHeader,
    AppLogo,
    AppTitle,
    Item,
    Actions
  },

  data() {
    return {
      samples,
      activePath: ""
    };
  },

  methods: {
    itemClick(item) {
      // this.$router.push(item.path);
      window.open(item.path);
      this.activePath = item.path;
    },

    logoClick() {
      SmMessageBox.alert(
        "作者联系方式",
        "QQ1911074953 备注 cesium实战源码"
      ).then(() => {});
    },

    sourceClickEvent() {
      window.open("/studyresource");
    }
  }
};
</script>

<style   scoped>
.app-home {
  width: 100%;
  height: 100%;
}

.sample-items {
  padding-top: 70px;
  height: calc(100% - 70px);
  background: black;
}

.items {
  height: 100%;
  overflow: auto;
  text-align: center;
}
</style>