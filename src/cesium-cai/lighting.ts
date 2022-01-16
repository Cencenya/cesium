import { viewer, Cesium } from "./create";
import nx from "../assets/image/sky/2/nx.png"
import px from "../assets/image/sky/2/px.png"
import ny from "../assets/image/sky/2/ny.png"
import py from "../assets/image/sky/2/py.png"
import nz from "../assets/image/sky/2/nz.png"
import pz from "../assets/image/sky/2/pz.png"

export const changLight = (value: string) => {
  let scene = viewer.scene
  // 3×3矩阵
  let scratchIcrfToFixed = new Cesium.Matrix3();
  // 笛卡尔坐标系
  let scratchMoonPosition = new Cesium.Cartesian3();
  let scratchMoonDirection = new Cesium.Cartesian3();

  scene.globe.enableLighting = true;
  //获取月亮的位置
  function getMoonDirection(result?: any) {
    result = Cesium.defined(result) ? result : new Cesium.Cartesian3();
    let icrfToFixed = scratchIcrfToFixed;
    let date = viewer.clock.currentTime;
    if (!Cesium.defined(
      Cesium.Transforms.computeIcrfToFixedMatrix(date, icrfToFixed)
    )) {
      Cesium.Transforms.computeTemeToPseudoFixedMatrix(date, icrfToFixed);
    }
    let moonPosition = Cesium.Simon1994PlanetaryPositions.computeMoonPositionInEarthInertialFrame(
      date,
      scratchMoonPosition
    );
    Cesium.Matrix3.multiplyByVector(
      icrfToFixed,
      moonPosition,
      moonPosition
    );
    let moonDirection = Cesium.Cartesian3.normalize(
      moonPosition,
      scratchMoonDirection
    );
    return Cesium.Cartesian3.negate(moonDirection, result);
  }

  let directionalLight = new Cesium.DirectionalLight({
    direction: new Cesium.Cartesian3(
      111.5652101, 38.70350851, 100.500143
    ),
  });

  let flashlight = new Cesium.DirectionalLight({
    direction: scene.camera.directionWC, // Updated every frame
  });

  let moonLight = new Cesium.DirectionalLight({
    direction: getMoonDirection(), // Updated every frame
    color: new Cesium.Color(0.9, 0.925, 1.0),
    intensity: 0.25,
  });

  let sunLight = new Cesium.SunLight();

  let customColorLight = new Cesium.DirectionalLight({
    direction: new Cesium.Cartesian3(
      -111.5652101, 38.70350851, 100.500143
    ),
    color: Cesium.Color.fromCssColorString("#deca7c"),
  });

  // scene.preRender.addEventListener(function (scene: any, time: any) {
  //   if (scene.light === flashlight) {
  //     scene.light.direction = Cesium.Cartesian3.clone(
  //       scene.camera.directionWC,
  //       scene.light.direction
  //     );
  //   } else if (scene.light === moonLight) {
  //     scene.light.direction = getMoonDirection(scene.light.direction);
  //   }
  // });

  // viewer.entities.add({
  //   position: Cesium.Cartesian3.fromRadians(
  //     -2.1463332294173365,
  //     0.6677959755384729,
  //     26.2876064083145
  //   ),
  //   ellipsoid: {
  //     radii: new Cesium.Cartesian3(2.5, 2.5, 2.5),
  //     material: Cesium.Color.WHITE.withAlpha(0.5),
  //   },
  // });
  function reset() {
    // Set scene defaults
    scene.light = sunLight;
    scene.globe.dynamicAtmosphereLighting = true;
    scene.globe.dynamicAtmosphereLightingFromSun = false;

  }
  function skyBox() {
    viewer.scene.skyBox = new Cesium.GroundSkyBox({
      sources: {
        positiveX: px,
        negativeX: nx,
        positiveY: py,
        negativeY: ny,
        positiveZ: pz,
        negativeZ: nz
      }
    });
    //控制高度，在小于2500米的时候显示近景图
    // viewer.scene.postRender.addEventListener(() => {
    //   var e = viewer.camera.position
    //   // console.log('height:', Cesium.Cartographic.fromCartesian(e).height)
    //   if (Cesium.Cartographic.fromCartesian(e).height < 2500) {
    //     // 显示自定义的天空盒
    //     viewer.scene.skyBox = currentSkyBox
    //   }
    // })
  }
  switch (value) {
    case 'lighting':
      console.log('lighting');
      reset();
      scene.light = directionalLight;
      break
    case 'Flashlight':
      console.log('Flashlight');
      reset();
      scene.light = flashlight;
      scene.globe.dynamicAtmosphereLighting = false;
      break
    case 'Moonlight':
      console.log('Moonlight');
      skyBox();
      reset();
      scene.light = moonLight;
      scene.globe.dynamicAtmosphereLightingFromSun = false;
      break;
    case 'Sunlight':
      console.log('Sunlight');
      reset();
      scene.globe.dynamicAtmosphereLighting = false;
      break
    case 'Custom':
      console.log('Custom');
      reset();
      scene.light = customColorLight;
      break


  }

}