import { Viewer } from "cesium";
import { glowLine } from './line'
import { changLight } from './lighting'
import Geometry from "./geometry";
import { setAlarm } from "./alarm";
import { flyPath } from './flypath'
import { setTiles } from './settiles'
import Models from "./model"
import { Wall } from './wall'
import { radarScan } from './radarScan'
import './SkyBoxGround'
import Side1 from "../assets/image/sky/1/Side1.png"
import Side2 from "../assets/image/sky/1/Side2.png"
import Side3 from "../assets/image/sky/1/Side3.png"
import Side4 from "../assets/image/sky/1/Side4.png"
import Side5 from "../assets/image/sky/1/Side5.png"
import Side6 from "../assets/image/sky/1/Side6.png"
import nx from "../assets/image/sky/2/nx.png"
import px from "../assets/image/sky/2/px.png"
import ny from "../assets/image/sky/2/ny.png"
import py from "../assets/image/sky/2/py.png"
import nz from "../assets/image/sky/2/nz.png"
import pz from "../assets/image/sky/2/pz.png"


// @ts-ignore
export const Cesium = window['Cesium'];
export let viewer: Viewer;
// const Side1 = require("../assets/image/sky/1/Side1.png")
// const Side2 = require("../assets/image/sky/1/Side2.png")
// const Side3 = require("../assets/image/sky/1/Side3.png")
// const Side4 = require("../assets/image/sky/1/Side4.png")
// const Side5 = require("../assets/image/sky/1/Side5.png")
// const Side6 = require("../assets/image/sky/1/Side6.png")
// const px = require("../assets/image/sky/2/px.png")
// const nx = require("../assets/image/sky/2/nx.png")
// const py = require("../assets/image/sky/2/py.png")
// const ny = require("../assets/image/sky/2/ny.png")
// const pz = require("../assets/image/sky/2/pz.png")
// const nz = require("../assets/image/sky/2/nz.png")
export const CreateViewer = () => {
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5ZGJhOWZkZC03OTlmLTQzMTMtOTJmMy03MzMyNGZiZTFjMjUiLCJpZCI6NDA2OTMsImlhdCI6MTYwOTEyMTczMn0._O7tbXF8csXUfyOXQ64XloupCOjjbEPcvsPtP4Te7Dw';

  viewer = new Cesium.Viewer('cesiumContainer', {
    scene3DOnly: true,
    selectionIndicator: false,
    baseLayerPicker: true,
    shouldAnimate: true,
    // creditContainer:"credit",
    // terrainProvider: Cesium.createWorldTerrain(),
    timeline: true,
    vrButton: false,
    infoBox: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    animation: false,
    fullscreenButton: false,

  });
  viewer.scene.postProcessStages.fxaa.enabled = false;
  viewer.clock.currentTime = Cesium.JulianDate.addHours(Cesium.JulianDate.now(new Date()), 8, new Cesium.JulianDate());// 修改时区
  viewer.scene.sun.show = true;
  viewer.scene.moon.show = true;
  viewer.scene.skyBox.show = true;//关闭天空盒，否则会显示天空颜色
  viewer.scene.shadowMap.size = 10000;
  viewer.scene.globe.show = true; //不显示地球，这条和地球透明度选一个就可以
  viewer.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 1);
  viewer.imageryLayers.get(0).show = false;
  viewer.scene.globe.depthTestAgainstTerrain = true;
  // viewer.scene.globe.showGroundAtmosphere = false

  // viewer.scene.globe.dynamicAtmosphereLighting = false;
  // viewer.scene.globe.dynamicAtmosphereLightingFromSun = false;
  let baselayer = new Cesium.UrlTemplateImageryProvider({
    url: 'https://t{s}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=be8b387b76fa3e010851a08134961271',
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: 18
  });
  var scanColor = new Cesium.Color(1.0, 0.0, 0.0, 1);
  let lon1 = 119.91286417532214;
  let lat1 = 28.462863669630227;
  let lon2 = 119.9200969832958;
  let lat2 = 28.475293386217057;
  var CartographicCenter1 = new Cesium.Cartographic(
    Cesium.Math.toRadians(lon1),
    Cesium.Math.toRadians(lat1),
    0
  );
  // 地图图层的亮度
  baselayer.defaultBrightness = 0.5
  // 色调
  // baselayer.defaultHue = 240 * Math.PI / 180
  baselayer.defaultSaturation = 0.5
  viewer.imageryLayers.addImageryProvider(baselayer);



  viewer.scene.skyBox = new Cesium.SkyBox({
    sources: {
      positiveX: Side1,
      negativeX: Side2,
      positiveY: Side3,
      negativeY: Side4,
      positiveZ: Side5,
      negativeZ: Side6
    }
  })
  // const currentSkyBox = new Cesium.GroundSkyBox({
  //   sources: {
  //     positiveX: px,
  //     negativeX: nx,
  //     positiveY: py,
  //     negativeY: ny,
  //     positiveZ: pz,
  //     negativeZ: nz
  //   }
  // });
  //控制高度，在小于2500米的时候显示近景图
  // viewer.scene.postRender.addEventListener(() => {
  //   var e = viewer.camera.position
  //   // console.log('height:', Cesium.Cartographic.fromCartesian(e).height)
  //   if (Cesium.Cartographic.fromCartesian(e).height < 2500) {
  //     // 显示自定义的天空盒
  //     viewer.scene.skyBox = currentSkyBox
  //   }
  // })


  // 设置环境光
  // 开启动态交通
  // glowLine()
  // 开启抛物轨迹
  // flyPath()
  //雷达扫描
  // radarScan()
  //加载白膜
  // setTiles()
  // 标签
  // const geometry = new Geometry();
  // geometry.setPolygon();
  // geometry.setMark();
  // 扩散圆
  // setAlarm(viewer, CartographicCenter1, 200, scanColor, 1000);

  // 墙体
  // Wall(Cesium.Cartesian3.fromDegreesArrayHeights([
  //   119.92174110410446, 28.4627408439087, 50,
  //   119.92167849772021, 28.462605767390524, 50,
  //   119.92228865196599, 28.46025781857183, 50,
  //   119.92246799353285, 28.460157242202612, 50,
  //   119.92567476716196, 28.46117373327441, 50,
  //   119.92580188108182, 28.46133584315255, 50,
  //   119.9257883493644, 28.46385878933483, 50,
  //   119.92574494515367, 28.464007983649257, 50,
  //   119.92566694795825, 28.46406371653822, 50,
  //   119.92536160383271, 28.464060205076482, 50,
  //   119.92174110410446, 28.4627408439087, 50
  // ]))
  // 模型
  // Models.setCone(viewer)
  // Models.airLine();

  // Models.setModel({
  //   modelUrl: `${process.env.PUBLIC_URL}/3d/car.glb`,
  //   startPos: Cesium.Cartesian3.fromDegrees(119.91600024277844, 28.46643744731459, 13),
  //   endPos: Cesium.Cartesian3.fromDegrees(119.92133943285947, 28.468109441248263, 13),
  //   time: 50,
  //   scale: 0.5,
  //   text: '社会车辆1',
  //   showPoint: false
  // });
  // Models.setModel({
  //   modelUrl: `${process.env.PUBLIC_URL}/3d/car.glb`,
  //   startPos: Cesium.Cartesian3.fromDegrees(119.9188904573172, 28.46216016417923, 2),
  //   endPos: Cesium.Cartesian3.fromDegrees(119.91864250772069, 28.467137181698114, 2),
  //   time: 50,
  //   scale: 0.5,
  //   text: '社会车辆2',
  //   showPoint: false
  // });
  // Models.setModel({
  //   modelUrl: `${process.env.PUBLIC_URL}/3d/CesiumDrone.gltf`,
  //   startPos: Cesium.Cartesian3.fromDegrees(119.91473015267731, 28.460326843745996, 100),
  //   endPos: Cesium.Cartesian3.fromDegrees(119.92601761510215, 28.464514039671727, 100),
  //   time: 50,
  //   scale: 20,
  //   text: '无人机巡查',
  //   showPoint: false
  // });
  // Models.setModel({
  //   modelUrl: ``,
  //   startPos: Cesium.Cartesian3.fromDegrees(119.91473015267731, 28.460326843745996, 0),
  //   endPos: Cesium.Cartesian3.fromDegrees(119.92601761510215, 28.464514039671727, 0),
  //   time: 50,
  //   scale: 0,
  //   text: '',
  //   showPoint: true
  // });


  // Models.setModel({
  //   modelUrl: `${process.env.PUBLIC_URL}/3d/car.glb`,
  //   startPos: Cesium.Cartesian3.fromDegrees(119.92128537865469, 28.4682488202657, 2),
  //   endPos: Cesium.Cartesian3.fromDegrees(119.91597996475727, 28.466614067276677, 2),
  //   time: 50,
  //   scale: 0.5
  // });
  // Models.setModel({
  //   modelUrl: `${process.env.PUBLIC_URL}/3d/car.glb`,
  //   startPos: Cesium.Cartesian3.fromDegrees(119.92147141639441, 28.468284736204442, 2),
  //   endPos: Cesium.Cartesian3.fromDegrees(119.91881258596382, 28.467427990749965, 2),
  //   time: 50,
  //   scale: 0.5
  // });
  // Models.setModel({
  //   modelUrl: `${process.env.PUBLIC_URL}/3d/car.glb`,
  //   startPos: Cesium.Cartesian3.fromDegrees(119.91847285500855, 28.467055649763157, 2),
  //   endPos: Cesium.Cartesian3.fromDegrees(119.91874212772129, 28.46206043846173, 2),
  //   time: 50,
  //   scale: 0.5
  // });
  // 获取经纬度
  var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (movement: any) {
    var position = viewer.scene.pickPosition(movement.position);
    var catographic = Cesium.Cartographic.fromCartesian(position)
    var longitude = Number(Cesium.Math.toDegrees(catographic.longitude))
    var latitude = Number(Cesium.Math.toDegrees(catographic.latitude))
    console.log(longitude, latitude);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};


