 /*
  * 动态立体墙类
  */
 export default class Fence {
     constructor(viewer, positions, fenceHeight, cesiumColor) {
         this.viewer = viewer;
         this.fenceHeight = fenceHeight;
         this.cesiumColor = cesiumColor;
         this.setPositions(positions);
         this.createEntity();
     }

     setPositions(value) {
         this.positions = value ? value : [];
         this.initHeights();
     }

     initHeights() {
         let minimumHeights = [];
         this.positions.forEach(position => {
             const cartographic = Cesium.Cartographic.fromCartesian(position);
             minimumHeights.push(cartographic.height);
         });

         let maximumHeights = []; //最大高度集合
         let dayMaximumHeights = []; //动态最大高度集合 长度与最大高度对应
         for (let i = 0; i < minimumHeights.length; i++) {
             maximumHeights.push(minimumHeights[i] + this.fenceHeight);
             dayMaximumHeights.push(minimumHeights[i]);
         }

         this.minimumHeights = minimumHeights;
         this.maximumHeights = maximumHeights;
         this.dayMaximumHeights = dayMaximumHeights;
     }

     createEntity() {
         this.initFence();
         this.initDynamicFence();
     }

     initFence() {
         this.fenceEntity = this.viewer.entities.add({
             wall: {
                 positions: new Cesium.CallbackProperty(e => {
                     return this.positions
                 }, false),
                 minimumHeights: new Cesium.CallbackProperty(e => {
                     return this.minimumHeights
                 }, false),
                 maximumHeights: new Cesium.CallbackProperty(e => {
                     return this.maximumHeights
                 }, false),
                 material: new Cesium.ImageMaterialProperty({
                     image: "data:image/png;base64,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",
                     transparent: true,
                     color: this.cesiumColor || Cesium.Color.RED
                 })
             }
         });
     }

     initDynamicFence() {
         this.dynamicFenceEntity = this.viewer.entities.add({
             wall: {
                 positions: new Cesium.CallbackProperty(e => {
                     return this.positions
                 }, false),
                 minimumHeights: new Cesium.CallbackProperty(e => {
                     return this.minimumHeights;
                 }, false),
                 maximumHeights: new Cesium.CallbackProperty(e => {
                     for (let i = 0; i < this.minimumHeights.length; i++) {
                         this.dayMaximumHeights[i] += this.fenceHeight * 0.004;
                         if (this.dayMaximumHeights[i] > this.maximumHeights[i]) {
                             this.dayMaximumHeights[i] = this.minimumHeights[i];
                         }
                     }
                     return this.dayMaximumHeights;
                 }, false),
                 material: new Cesium.ImageMaterialProperty({
                     image: "data:image/png;base64,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",
                     transparent: true,
                     color: this.cesiumColor || Cesium.Color.RED
                 })
             }
         });

         this.viewer.flyTo(this.fenceEntity)
     }

     //移除动态墙体对象
     remove() {
         this.viewer.entities.remove(this.fenceEntity);
         this.viewer.entities.remove(this.dynamicFenceEntity);
     }
 }