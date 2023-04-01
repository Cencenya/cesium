 import appConfig from "@/js/appConfig"

 let cesiumInit = {
     init(el) {
         this.initViewer(el);
         this.createW_MaskRegion();
         this.createE_MaskRegion();
         this.setView();
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
             })
         });
         this.viewer._cesiumWidget._creditContainer.style.display = "none";
     },

     //设置视角
     setView() {
         let flyToOpts = {
             destination: {
                 x: -2237214.8859175337,
                 y: 6769153.613605461,
                 z: 4107943.5609134007
             },
             orientation: {
                 heading: 0.465325219539797,
                 pitch: -1.569241787554542,
                 roll: 0
             }
         };
         this.viewer.scene.camera.flyTo(flyToOpts);
     },

     //西半球遮罩面
     createW_MaskRegion() {
         let wDs = [-0.00001, 60, -0.00001, -60, -180, -60, -180, 60, -0.00001, 60];
         this.viewer.entities.add({
             polygon: {
                 hierarchy: {
                     positions: Cesium.Cartesian3.fromDegreesArray(wDs),
                 },
                 material: Cesium.Color.BLUE.withAlpha(0.5), // Cesium.Color.BLACK.withAlpha(0.8),
             }
         });
     },

     //东半球遮罩面
     createE_MaskRegion() {
         let eDs = [0.00001, 60, 0.00001, -60, 180, -60, 180, 60, 0.00001, 60];
         let boundary = this.getBoundary();
         this.viewer.entities.add({
             polygon: {
                 hierarchy: {
                     positions: Cesium.Cartesian3.fromDegreesArray(eDs),
                     holes: [{
                         positions: boundary
                     }]
                 },
                 material: Cesium.Color.BLUE.withAlpha(0.5),
             },
             polyline: {
                 positions: boundary,
                 width: 3,
                 material: Cesium.Color.AQUA.withAlpha(0.7)
             }
         });
     },

     //边界
     getBoundary() {
         let boundary = [
             [108.5449, 31.6846],
             [108.2813, 31.9043],
             [108.3691, 32.168],
             [108.5449, 32.2119],
             [109.0723, 31.9482],
             [109.248, 31.7285],
             [109.5996, 31.7285],
             [109.7754, 31.6846],
             [109.6875, 31.5527],
             [110.127, 31.377],
             [110.2148, 31.1572],
             [110.0391, 30.8057],
             [109.8633, 30.8936],
             [109.4238, 30.542],
             [109.248, 30.6299],
             [109.1602, 30.542],
             [109.0723, 30.6299],
             [108.8086, 30.498],
             [108.6328, 30.5859],
             [108.457, 30.4102],
             [108.5449, 30.2344],
             [108.457, 29.7949],
             [108.6328, 29.8389],
             [108.9844, 29.3115],
             [109.0723, 29.3555],
             [109.248, 29.1357],
             [109.248, 28.4766],
             [109.0723, 28.2129],
             [108.7207, 28.2129],
             [108.7207, 28.4766],
             [108.5449, 28.3887],
             [108.5449, 28.6523],
             [108.3691, 28.6523],
             [108.2813, 29.0918],
             [107.8418, 29.0039],
             [107.8418, 29.1357],
             [107.5781, 29.2236],
             [107.4023, 29.1797],
             [107.4023, 28.8721],
             [106.875, 28.7842],
             [106.6992, 28.4766],
             [106.6113, 28.5205],
             [106.6113, 28.6523],
             [106.5234, 28.7842],
             [106.4355, 28.7842],
             [106.5234, 28.5645],
             [106.3477, 28.5205],
             [106.2598, 28.8721],
             [105.8203, 28.96],
             [105.7324, 29.2676],
             [105.4688, 29.3115],
             [105.293, 29.5313],
             [105.7324, 29.8828],
             [105.5566, 30.1025],
             [105.6445, 30.2783],
             [105.8203, 30.4541],
             [106.2598, 30.1904],
             [106.6113, 30.3223],
             [106.7871, 30.0146],
             [107.0508, 30.0146],
             [107.4902, 30.6299],
             [107.4023, 30.7617],
             [107.4902, 30.8496],
             [107.9297, 30.8496],
             [108.1934, 31.5088],
             [108.5449, 31.6846]
         ];
         let positions = [];
         boundary.map(c => {
             positions.push(Cesium.Cartesian3.fromDegrees(c[0], c[1], 0));
         });
         return positions;
     },

     destroy() {
         this.viewer.entities.removeAll();
         this.viewer.imageryLayers.removeAll(true);
         this.viewer.destroy();
     },
 }
 export default cesiumInit;