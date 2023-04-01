 import * as olExtent from 'ol/extent';

 export default class CesiumOLSyncUtils {
     constructor(viewer, map) {
         this.viewer = viewer;
         this.map = map;
         this.activateContainer = undefined;
         this.initEvent();
         this.activate();
     }

     initEvent() {
         this.map.getView().on("change:center", e => {
             if (this.activateContainer == "map") {
                 let rec = this.map.getView().calculateExtent(this.map.getSize());
                 this.viewer.camera.setView({
                     destination: Cesium.Rectangle.fromDegrees(rec[0], rec[1], rec[2], rec[3])
                 });
             }
         });

         this.viewer.scene.postRender.addEventListener(e => {
             if (this.activateContainer != "viewer") return;
             // this.map.getView().setRotation(-this.viewer.camera.heading);
             let rec = this.viewer.camera.computeViewRectangle();
             if (!rec) {
                 console.log("rec is undefined");
                 this.setMapCenterByCameraPosition();
                 return;
             }
             let extent = [Cesium.Math.toDegrees(rec.west),
                 Cesium.Math.toDegrees(rec.south),
                 Cesium.Math.toDegrees(rec.east),
                 Cesium.Math.toDegrees(rec.north),
             ]
             if (olExtent.isEmpty(extent)) {
                 console.log("extent is empty");
                 this.setMapCenterByCameraPosition();
                 return;
             }
             this.map.getView().fit(extent);
         });
     }

     activate() {
         this.viewer.container.onmouseenter = (e) => {
             this.activateContainer = "viewer";
         };
         this.map.getViewport().onmouseenter = (e) => {
             this.activateContainer = "map";
         };
     }

     deactivate() {
         this.viewer.container.onmouseenter = undefined;
         this.map.getViewport().onmouseenter = undefined;
         this.activateContainer = undefined;
     }

     setMapCenterByCameraPosition() {
         let position = this.viewer.camera.position;
         const cartographic = Cesium.Cartographic.fromCartesian(position);
         const lon = Cesium.Math.toDegrees(cartographic.longitude);
         const lat = Cesium.Math.toDegrees(cartographic.latitude);
         this.map.getView().setCenter([lon, lat]);
     }

 }