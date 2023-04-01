 // 所有HedronPlot标绘类的基类  
 export default class HedronPlotBase {
     constructor(viewer, geoFeature) {
         this.viewer = viewer;

         this.properties = geoFeature.properties; //相关属性 如plotCode  plotType
         this.properties.plotBase = "HedronPlot"; //基础类型
         this.properties.attr = this.properties.attr || {
             name: "未命名"
         }; //存储相关属性
         this.geometry = geoFeature.geometry;
         this.coordinates = geoFeature.geometry.coordinates; //坐标信息 格式与geojson polygon 一个标准
         this.style = this.properties.style || {}; //样式信息存储在properties中 引用对象 

         this.generatePositions();
     }

     //构造坐标点串
     generatePositions() {
         this.positions = [];
         let coordinates;
         switch (this.geometry.type) {
             case "Point":
                 coordinates = [this.coordinates];
                 break;
             case "LineString":
                 coordinates = this.coordinates;
                 break;
             case "Polygon":
                 coordinates = this.coordinates[0];
                 break;
         }
         //从经纬度转为笛卡尔坐标
         coordinates.forEach(item => {
             this.positions.push(Cesium.Cartesian3.fromDegrees(item[0], item[1], item[2]));
         })
     }

     //设置坐标点串
     setPositions(value) {
         this.positions = value ? value : [];
         this.coordinates = [];
         switch (this.geometry.type) {
             case "Point":
                 this.setPointCoordinates();
                 break;
             case "LineString":
                 this.setLineStringCoordinates();
                 break;
             case "Polygon":
                 this.setPolygonCoordinates();
                 break;
         }

         if (this.updatePositionAction) {
             this.updatePositionAction();
         }
     }

     //设置点的坐标
     setPointCoordinates() {
         const c = Cesium.Cartographic.fromCartesian(this.positions[0]);
         this.coordinates = [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude), c.height];
     }

     //设置线的坐标
     setLineStringCoordinates() {
         this.positions.forEach(item => {
             const c = Cesium.Cartographic.fromCartesian(item);
             const coordinate = [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude), c.height];
             this.coordinates.push(coordinate);
         })
     }

     //设置面的坐标
     setPolygonCoordinates() {
         this.coordinates.push([]);
         this.positions.forEach(item => {
             const c = Cesium.Cartographic.fromCartesian(item);
             const coordinate = [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude), c.height];
             this.coordinates[0].push(coordinate);
         })
     }

     getPositions() {
         return this.positions.slice(0);
     }

     getPositionCount() {
         return this.positions.length;
     }

     setSelected(selected) {

     }

     //开启编辑模式
     openEditMode(isEdit) {

     }

     //删除标绘
     remove() {

     }
 }