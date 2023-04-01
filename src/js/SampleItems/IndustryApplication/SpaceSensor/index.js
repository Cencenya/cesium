 //相控阵雷达扫描
 import appConfig from "@/js/appConfig"
 import Sensor1 from "@/components/IndustryApplication/SpaceSensor/Sensor1"
 import Sensor2 from "@/components/IndustryApplication/SpaceSensor/Sensor2"

 let cesiumInit = {
     init(el) {
         this.initViewer(el);
         this.addSensors();
         this.viewer.flyTo(this.viewer.entities);
     },

     //初始化viewer
     initViewer(el) {
         this.viewer = new Cesium.Viewer(el, {
             infoBox: false,
             selectionIndicator: false,
             navigation: false,
             animation: false,
             shouldAnimate: false,
             timeline: false,
             baseLayerPicker: false,
             geocoder: false,
             homeButton: false,
             sceneModePicker: false,
             navigationHelpButton: false,
             imageryProvider: new Cesium.UrlTemplateImageryProvider({
                 url: appConfig.imageryProvider
             }),
         });
     },

     //添加扫描效果
     addSensors() {
         this.addSensors1();
         this.addSensors2();
     },

     //效果1
     addSensors1() {
         let p = Cesium.Cartesian3.fromDegrees(108.60606, 25, 0);
         let s1 = new Sensor1(this.viewer, {
             position: p,
             color: Cesium.Color.MEDIUMTURQUOISE.withAlpha(0.5),
             radius: 600,
             heading: 0
         });

         p = Cesium.Cartesian3.fromDegrees(108.63655, 25, 0);
         s1 = new Sensor1(this.viewer, {
             position: p,
             color: Cesium.Color.DARKSEAGREEN.withAlpha(0.5),
             radius: 600,
             heading: 90
         });
     },

     //效果2
     addSensors2() {
         let p = Cesium.Cartesian3.fromDegrees(108.60606, 25.02, 0);
         let s2 = new Sensor2(this.viewer, {
             position: p,
             color: Cesium.Color.RED.withAlpha(0.2),
             radii: new Cesium.Cartesian3(500, 500, 230)
         });

         p = Cesium.Cartesian3.fromDegrees(108.63655, 25.02, 0);
         s2 = new Sensor2(this.viewer, {
             position: p,
             color: Cesium.Color.CADETBLUE.withAlpha(0.2),
             radii: new Cesium.Cartesian3(500, 500, 230)
         });
     },

     destroy() {
         this.viewer.entities.removeAll();
         this.viewer.imageryLayers.removeAll(true);
         this.viewer.destroy();
     },
 }
 export default cesiumInit;