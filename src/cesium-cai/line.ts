import { viewer, Cesium } from "./create";
import img from '../assets/image/strmingLine.png';
// import data from '../json/2_-.geojson'
const lsuData = require("../json/丽水交通.json")

export const glowLine = () => {

  // 流动的图片
  // let promise1 = Cesium.IonResource.fromAssetId(246176)
  //   .then(function (resource: any) {
  //     return Cesium.GeoJsonDataSource.load(resource);
  //   })
  //   .then(function (dataSource: any) {
  //     return viewer.dataSources.add(dataSource);
  //   })
  //   .then(function (dataSource: any) {
  //     // console.log(dataSource)

  //     let entities = dataSource.entities.values;
  //     let colorHash = {};

  //     for (let o = 0; o < entities.length; o++) {
  //       let r = entities[o];
  //       r.nameID = o;   //给每条线添加一个编号，方便之后对线修改样式
  //       r.polyline.width = 10;  //添加默认样式
  //       r.polyline.material = new Cesium.CustomMaterialLine({
  //         image: img,
  //         color: new Cesium.Color(77 / 255, 201 / 255, 255 / 255, 1),
  //         duration: 2000
  //       })

  //     }
  //     return viewer.zoomTo(dataSource)

  //   })
  //   .otherwise(function (error: any) {
  //     console.log(error);
  //   });
  // 发光的线条
  // let promise = Cesium.IonResource.fromAssetId(246176)
  //   .then(function (resource: any) {
  //     return Cesium.GeoJsonDataSource.load(resource);
  //   })
  //   .then(function (dataSource: any) {
  //     return viewer.dataSources.add(dataSource);
  //   })
  //   .then(function (dataSource: any) {
  //     // console.log(dataSource)

  //     let entities = dataSource.entities.values;
  //     let colorHash = {};

  //     for (let o = 0; o < entities.length; o++) {
  //       let r = entities[o];
  //       r.nameID = o;   //给每条线添加一个编号，方便之后对线修改样式
  //       r.polyline.width = 10;  //添加默认样式
  //       r.polyline.material = new Cesium.PolylineGlowMaterialProperty({
  //         glowPower: .1, //一个数字属性，指定发光强度，占总线宽的百分比。
  //         color: Cesium.Color.ORANGERED.withAlpha(.5)
  //       })

  //     }
  //     return viewer.zoomTo(dataSource)

  //   })
  //   .otherwise(function (error: any) {
  //     console.log(error);
  //   });

  /* 
   不用ion处理数据
  */


  const lineData = new Cesium.GeoJsonDataSource.load(lsuData)
    .then(function (lineData: any) {
      viewer.dataSources.add(lineData);
      let entities = lineData.entities.values;
      for (let o = 0; o < entities.length; o++) {
        let r = entities[o];
        // 每一个entity的笛卡尔坐标系数组
        r.nameID = o;   //给每条线添加一个编号，方便之后对线修改样式
        r.polyline.width = 6;  //添加默认样式
        r.polyline.material = new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.2, //一个数字属性，指定发光强度，占总线宽的百分比。
          color: Cesium.Color.ORANGERED.withAlpha(.6)
        })
        let cartesian3Arr = r.polyline.positions._value
        for (let i = 0; i < cartesian3Arr.length; i++) {
          let ellipsoid = viewer.scene.globe.ellipsoid;
          let cartographic = ellipsoid.cartesianToCartographic(cartesian3Arr[i]);
          cartographic.height = 2
          let cartesian3 = ellipsoid.cartographicToCartesian(cartographic);
          cartesian3Arr[i] = cartesian3
        }

      }

    })

  // 流动的线条

  Cesium.GeoJsonDataSource.load(lsuData)
    .then(function (dataSource: any) {
      return viewer.dataSources.add(dataSource);
    })
    .then(function (dataSource: any) {
      // console.log(dataSource)
      let entities = dataSource.entities.values;
      for (let j = 0; j < entities.length; j++) {
        let r = entities[j];
        r.nameID = j;   //给每条线添加一个编号，方便之后对线修改样式
        r.polyline.width = 15;  //添加默认样式
        r.polyline.material = new Cesium.CustomMaterialLine({
          image: img,
          color: new Cesium.Color(77 / 255, 201 / 255, 255 / 255, 1),
          duration: 10000
        })
        let cartesian3Arr = r.polyline.positions._value
        for (let i = 0; i < cartesian3Arr.length; i++) {
          let ellipsoid = viewer.scene.globe.ellipsoid;
          let cartographic = ellipsoid.cartesianToCartographic(cartesian3Arr[i]);
          cartographic.height = 2
          let cartesian3 = ellipsoid.cartographicToCartesian(cartographic);
          cartesian3Arr[i] = cartesian3
        }
      }
      return viewer.flyTo(dataSource)
    })
    .otherwise(function (error: any) {
      console.log(error);
    });




}