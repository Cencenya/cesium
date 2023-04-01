 // Gltf 标绘实例
 import appConfig from "@/js/appConfig"
 import GltfDraw from "@/components/Plot/GltfPlot/PlotDraw"
 import GltfEdit from "@/components/Plot/GltfPlot/PlotEdit"
 import { getPlotCode } from "@/components/Plot/PlotBase/PlotBaseUtils"
 import GltfPlotLayer from "@/components/Plot/PlotLayer/GltfPlot"
 import { cartesian3ToCoordinates } from '@/utils/coordinate';

 let cesiumInit = {
     init(el) {
         this.initViewer(el);
         this.initGltfDraw();
         this.initGltfEdit();
         this.load3dtiles();
         this.initDatas();
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
             shouldAnimate: true,
             imageryProvider: new Cesium.UrlTemplateImageryProvider({
                 url: appConfig.imageryProvider
             })
         });
     },

     //加载数据
     initDatas() {
         fetch("../../static/data/1602600681304.json").then(res => {
             return res.json();
         }).then(res => {
             let features = res.features;
             features.forEach(feature => {
                 this.gltfPlotLayer.addPlot(feature);
             })
         }).catch(err => {
             console.log(err)
         })
     },

     //初始化绘制
     initGltfDraw() {
         this.gltfPlotLayer = new GltfPlotLayer(this.viewer);
         this.gltfPlotLayer.setPlotSelectable(true);

         this.gltfDraw = new GltfDraw(this.viewer);
         this.gltfDraw.DrawEndEvent.addEventListener((position) => {
             this.handleDrawEnd(position);
         })
     },

     //初始化编辑
     initGltfEdit() {
         this.gltfPlotEdit = new GltfEdit(
             this.viewer,
             this.gltfPlotLayer
         );
     },

     //绘制结束事件
     handleDrawEnd(position) {
         switch (this.drawPlotType) {
             case "police":
                 this.addPolice(position);
                 break;
             case "policeCar":
                 this.addPoliceCar(position);
                 break;
             case "fireMan":
                 this.addFireMan(position);
                 break;
             case "fireCar":
                 this.addFireCar(position);
                 break;
         }
     },

     addPolice(position) {
         var geoFeature = {
             type: "Feature",
             properties: {
                 plotCode: getPlotCode(),
                 modelUrl: "../../../static/gltf/police.gltf",
                 style: {
                     width: 1,
                     height: 1.6,
                     scale: 2,
                     heading: 0
                 },
                 attr: {}
             },
             geometry: {
                 type: "Point",
                 coordinates: cartesian3ToCoordinates(position)
             }
         };
         this.gltfPlotLayer.addPlot(geoFeature);
     },

     addPoliceCar(position) {
         var geoFeature = {
             type: "Feature",
             properties: {
                 plotCode: getPlotCode(),
                 modelUrl: "../../../static/gltf/police_car.gltf",
                 style: {
                     width: 1.4,
                     height: 1.8,
                     scale: 1.5,
                     heading: 0
                 },
                 attr: {}
             },
             geometry: {
                 type: "Point",
                 coordinates: cartesian3ToCoordinates(position)
             }
         };
         this.gltfPlotLayer.addPlot(geoFeature);
     },

     addFireMan(position) {
         var geoFeature = {
             type: "Feature",
             properties: {
                 plotCode: getPlotCode(),
                 modelUrl: "../../../static/glb/xiaofangyuan.glb",
                 style: {
                     width: 1,
                     height: 1.6,
                     scale: 1,
                     heading: 0
                 },
                 attr: {}
             },
             geometry: {
                 type: "Point",
                 coordinates: cartesian3ToCoordinates(position)
             }
         };
         this.gltfPlotLayer.addPlot(geoFeature);
     },

     addFireCar(position) {
         var geoFeature = {
             type: "Feature",
             properties: {
                 plotCode: getPlotCode(),
                 modelUrl: "../../../static/gltf/xiaofangche.gltf",
                 style: {
                     width: 1,
                     height: 1.6,
                     scale: 1,
                     heading: 0
                 },
                 attr: {}
             },
             geometry: {
                 type: "Point",
                 coordinates: cartesian3ToCoordinates(position)
             }
         };
         this.gltfPlotLayer.addPlot(geoFeature);
     },

     //激活绘制工具
     drawActivate(type) {
         this.drawPlotType = type;
         this.gltfDraw.activate();
     },

     //保存文件
     savePlots() {
         const features = [];
         this.gltfPlotLayer.plots.forEach(plot => {
             features.push(plot.toGeoJson());
         })
         let geojson = {
             "type": "FeatureCollection",
             "features": features
         }
         let data = JSON.stringify(geojson);

         var blob = new Blob([data], { type: 'text/json' });
         var e = document.createEvent('MouseEvents');
         var a = document.createElement('a');
         a.download = new Date().getTime() + ".json";
         a.href = window.URL.createObjectURL(blob);
         a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
         e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
         a.dispatchEvent(e);
     },

     //清空
     clear() {
         this.gltfPlotLayer.clear();
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
         if (this.Window1) {
             this.Window1.windowClose();
             this.Window1 = undefined;
         }
         this.viewer.entities.removeAll();
         this.viewer.imageryLayers.removeAll(true);
         this.viewer.destroy();
     },
 }

 export default cesiumInit;