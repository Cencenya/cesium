 import appConfig from "@/js/appConfig"
 import MeasureHeight from "@/components/CesiumTools/MeasureTools/Height"
 import MeasureDistance from "@/components/CesiumTools/MeasureTools/Distance"
 import MeasureArea from "@/components/CesiumTools/MeasureTools/Area"

 let cesiumInit = {
     init(el) {
         this.initViewer(el);
         this.initMeasureTools();
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
             imageryProvider: new Cesium.UrlTemplateImageryProvider({
                 url: appConfig.imageryProvider
             })
         });
         this.viewer.scene.globe.depthTestAgainstTerrain = true;
         //是否开启抗锯齿
         this.viewer.scene.fxaa = true;
         this.viewer.scene.postProcessStages.fxaa.enabled = true;
     },

     //初始化测量工具
     initMeasureTools() {
         //测距工具
         this.mdTool = new MeasureDistance(this.viewer);
         //测高工具
         this.mhTool = new MeasureHeight(this.viewer);
         //测面
         this.maTool = new MeasureArea(this.viewer);

     },

     //开始测量
     measure(type) {
         switch (type) {
             case "height":
                 this.measureHeight();
                 break;
             case "distance":
                 this.measureDistance();
                 break;
             case "area":
                 this.measureAera();
                 break;
             case "clear":
                 this.clear();
                 break;
         }
     },

     //测距
     measureDistance() {
         this.clear();
         this.mdTool.activate();
     },

     //测面
     measureAera() {
         this.clear();
         this.maTool.activate();
     },

     //测高
     measureHeight() {
         this.clear();
         this.mhTool.activate();
     },

     //清除
     clear() {
         this.mhTool.deactivate();
         this.mhTool.clear();

         this.mdTool.deactivate();
         this.mdTool.clear();

         this.maTool.deactivate();
         this.maTool.clear();
     },

     //加载3dtiles数据
     load3dtiles() {
         var tileset = this.viewer.scene.primitives.add(
             new Cesium.Cesium3DTileset({
                 url: appConfig.zy3dtiles,
             })
         );

         tileset.readyPromise
             .then(tileset => {
                 this.viewer.zoomTo(
                     tileset,
                 );
                 this.setTilesetHeight(tileset);
             })
             .otherwise(function(error) {
                 console.log(error);
             });
     },

     //调整3dtiles的高度位置
     setTilesetHeight(tileset) {
         var cartographic = Cesium.Cartographic.fromCartesian(
             tileset.boundingSphere.center
         );
         var surface = Cesium.Cartesian3.fromRadians(
             cartographic.longitude,
             cartographic.latitude,
             cartographic.height
         );
         var offset = Cesium.Cartesian3.fromRadians(
             cartographic.longitude,
             cartographic.latitude, 55
         );
         var translation = Cesium.Cartesian3.subtract(
             offset,
             surface,
             new Cesium.Cartesian3()
         );
         tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
     },

     destroy() {
         this.viewer.entities.removeAll();
         this.viewer.imageryLayers.removeAll(true);
         this.viewer.destroy();
     },
 }

 export default cesiumInit;