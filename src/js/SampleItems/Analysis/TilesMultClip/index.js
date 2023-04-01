 // 3dtiles裁剪实例 
 import EntityDraw from "@/components/CesiumTools/EntityDraw"
 import TilesMultClip from "@/components/Analysis/TilesMultClip"

 let cesiumInit = {
     init(el) {
         this.initViewer(el);
         this.initEntityDraw();
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
     },

     //初始化绘制
     initEntityDraw() {
         this.entityDraw = new EntityDraw(this.viewer);
         this.entityDraw.DrawEndEvent.addEventListener((result, positions) => {
             result.remove();
             console.log(positions);
             //绘制完成后进行裁剪
             this.tilesMultClip.add(positions);
         })
     },

     //激活绘制
     drawActivate(type, excavateDepth) {
         this.entityDraw.activate(type);
         // this.clear();
     },

     //清空
     clear() {
         this.tilesMultClip.clear();
     },

     //默认裁剪
     initClip() {
         let positions = [{ x: -1715372.1104364456, y: 4993210.382459393, z: 3566564.5427094135 }, { x: -1715365.4040908897, y: 4993183.085313424, z: 3566613.924048169 }, { x: -1715311.96887019, y: 4993199.615407809, z: 3566615.753193611 }, { x: -1715319.2569736778, y: 4993227.467114703, z: 3566565.2857384873 }]
         this.tilesMultClip.add(positions, this.tileset);
     },

     //加载三维模型
     load3dtiles() {
         var tileset = this.viewer.scene.primitives.add(
             new Cesium.Cesium3DTileset({
                 url: "http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json",
             })
         );

         tileset.readyPromise
             .then(tileset => {
                 this.tileset = tileset;
                 this.viewer.zoomTo(
                     tileset,
                 );
                 this.tilesMultClip = new TilesMultClip(this.viewer, this.tileset);
                 this.initClip();
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
             cartographic.latitude, 20
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