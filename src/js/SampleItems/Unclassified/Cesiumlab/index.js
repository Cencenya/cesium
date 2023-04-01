 // cesiumlab 矢量面拉伸实例 面数据具有高度字段
 import appConfig from "@/js/appConfig"

 let cesiumInit = {
     init(el) {
         this.initViewer(el);
         this.load3dtiles();
     },

     //初始化viewer
     initViewer(el) {
         this.viewer = new Cesium.Viewer(el, {
             infoBox: false,
             selectionIndicator: false,
             navigation: false,
             animation: false,
             timeline: false,
             baseLayerPicker: false,
             geocoder: false,
             homeButton: false,
             sceneModePicker: false,
             navigationHelpButton: false,
             shouldAnimate: false,
             imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                 url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
             })
         });
         // 亮度设置
         var stages = this.viewer.scene.postProcessStages;
         this.viewer.scene.brightness = this.viewer.scene.brightness || stages.add(Cesium.PostProcessStageLibrary.createBrightnessStage());
         this.viewer.scene.brightness.enabled = true;
         this.viewer.scene.brightness.uniforms.brightness = 2;
     },

     //加载三维模型
     load3dtiles() {
         var tileset = this.viewer.scene.primitives.add(
             new Cesium.Cesium3DTileset({
                 url: appConfig.build3dtiles,
             })
         );

         tileset.readyPromise
             .then(tileset => {
                 this.tileset = tileset;
                 this.viewer.zoomTo(
                     tileset,
                 );
                 this.setTilesetHeight(55);
             })
             .otherwise(function(error) {
                 console.log(error);
             });
     },

     //设置模型高度
     setTilesetHeight(height) {
         if (!this.tileset) return;
         var cartographic = Cesium.Cartographic.fromCartesian(
             this.tileset.boundingSphere.center
         );
         var surface = Cesium.Cartesian3.fromRadians(
             cartographic.longitude,
             cartographic.latitude,
             //cartographic.height
             0
         );
         var offset = Cesium.Cartesian3.fromRadians(
             cartographic.longitude,
             cartographic.latitude, height
         );
         var translation = Cesium.Cartesian3.subtract(
             offset,
             surface,
             new Cesium.Cartesian3()
         );
         this.tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
     },

     destroy() {
         this.viewer.entities.removeAll();
         this.viewer.imageryLayers.removeAll(true);
         this.viewer.destroy();
     },
 }
 export default cesiumInit;