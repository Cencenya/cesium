import { Cartesian3, Entity, IonResource, PositionProperty, Viewer } from "cesium";
import { viewer, Cesium } from "./create";
import { handlerFun, showLabel } from "./marker";
import circle from '../assets/image/redCircle2.png'
import line from '../assets/image/strmingLine.png'

export default class Models {

  // 纸飞机移动效果
  static airLine() {
    const czml = [
      {
        id: "document",
        name: "CZML Path",
        version: "1.0",
        clock: {
          interval: "2020-08-04T10:00:00Z/2020-08-04T10:03:00Z",
          currentTime: "2020-08-04T10:00:00Z",
          multiplier: 10,
        },
      },
      {
        id: "path",
        name: "说明文本",
        description:
          "<p>说明文本说明文本说明文本</p>",
        availability: "2020-08-04T10:00:00Z/2020-08-04T10:03:00Z",
        path: {
          material: {
            polylineOutline: {
              color: {
                rgba: [255, 152, 0, 255],
              },
              outlineColor: {
                rgba: [255, 84, 34, 255],
              },
              outlineWidth: 5,
            },
          },
          width: 8,
          leadTime: 10,
          trailTime: 1000,
          resolution: 5,
        },
        billboard: {
          image:
            "data:image/png;base64,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",
          scale: 1.5,
          eyeOffset: {
            cartesian: [0.0, 0.0, 10.0],
          },
        },
        position: {
          epoch: "2020-08-04T10:00:00Z",
          cartographicDegrees: [
            0,
            119.91288, 28.44592, 20,
            10,
            119.91299, 28.44592, 20,
            20,
            119.91300, 28.44592, 20,
            30,
            119.91311, 28.44592, 20,
            40,
            119.91322, 28.44592, 20,
            50,
            119.91333, 28.44592, 20,
            60,
            119.91344, 28.44592, 20,
            70,
            119.91355, 28.44592, 20,
            80,
            119.91366, 28.44592, 20,
            90,
            119.91377, 28.44592, 20,
            100,
            119.91388, 28.44592, 20,
            110,
            119.91399, 28.44592, 20,
            120,
            119.91400, 28.44592, 20,
            130,
            119.91411, 28.44592, 20,
            140,
            119.91422, 28.44592, 20,
            150,
            119.91433, 28.44592, 20,
            160,
            119.91444, 28.44592, 20,
            170,
            119.91455, 28.44592, 20,
            180,
            119.91466, 28.44592, 20,
            190,
          ]
        },
      },
    ];

    viewer.dataSources
      .add(Cesium.CzmlDataSource.load(czml))
      .then(function (ds) {
        // viewer.trackedEntity = ds.entities.getById("path");
      });


  }
  // 移动模型
  static moveModel() {
    //旋转角度
    let radian = Cesium.Math.toRadians(90.0);
    //速度
    let speed = 60;
    // 速度矢量
    let speedVector = new Cesium.Cartesian3();
    let scene = viewer.scene;
    // 起始位置
    let position = Cesium.Cartesian3.fromDegrees(119.91288, 28.44592, 20);

    // 用于设置方向
    let hpRoll = new Cesium.HeadingPitchRoll();
    let fixedFrameTransforms = Cesium.Transforms.localFrameToFixedFrameGenerator('north', 'west');
    // 添加模型
    let carPrimitive = scene.primitives.add(Cesium.Model.fromGltf({
      url: `${process.env.PUBLIC_URL}/3d/Air.glb`,
      modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(position, hpRoll, Cesium.Ellipsoid.WGS84, fixedFrameTransforms),
      minimumPixelSize: 128
    }));
    // 状态标志
    let flag = {
      pitch: false,
      roll: false,
      heading: false,
      moveUp: false,
      moveDown: false,
      moveLeft: false,
      moveRight: false
    };
    document.addEventListener('keydown', (e) => {
      setFlagStatus(e, true);
    });

    document.addEventListener('keyup', (e) => {
      setFlagStatus(e, false);
    });

    // 根据键盘按键返回标志
    function setFlagStatus(key: any, value: boolean) {
      switch (key.keyCode) {
        case 37:
          // 左
          flag.moveLeft = value;
          break;
        case 38:
          // 上
          flag.moveUp = value;
          break;
        case 39:
          // 右
          flag.moveRight = value;
          break;
        case 40:
          flag.moveDown = value;
          // 下
          break;
      }
    }

    viewer.clock.onTick.addEventListener((clock) => {
      if (flag.moveUp) {

        if (flag.moveLeft) {
          // hpRoll.heading -= radian;
          hpRoll.pitch -= radian;
        }

        if (flag.moveRight) {
          // hpRoll.heading += radian;
          hpRoll.pitch += radian;
        }
        moveCar(true);
      }

      if (flag.moveDown) {
        if (flag.moveLeft) {
          hpRoll.roll -= radian;
        }
        if (flag.moveRight) {
          hpRoll.roll += radian;
        }
        moveCar(false);
      }
    });

    // 移动
    function moveCar(isUp: boolean) {
      if (isUp) {
        speedVector = Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.UNIT_X, speed, speedVector);
      } else {
        speedVector = Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.UNIT_X, -speed, speedVector);
      }

      // 根据速度计算出下一个位置的坐标
      position = Cesium.Matrix4.multiplyByPoint(carPrimitive.modelMatrix, speedVector, position);
      // 移动
      Cesium.Transforms.headingPitchRollToFixedFrame(position, hpRoll, Cesium.Ellipsoid.WGS84, fixedFrameTransforms, carPrimitive.modelMatrix);
      // console.log(hpRoll);
    }

  }
  // 添加模型
  static setModel({ modelUrl, startPos, endPos, time, scale = 1, text, showPoint, airPlane }) {
    //Set the random number seed for consistent results.
    // Cesium.Math.setRandomNumberSeed(3);

    //Set bounds of our simulation time
    const start = Cesium.JulianDate.fromDate(new Date());
    // 将秒 添加进start实例
    const stop = Cesium.JulianDate.addSeconds(
      start,
      time,
      new Cesium.JulianDate()
    );

    //Make sure viewer is at the desired time.
    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
    // 速率
    viewer.clock.multiplier = 10;
    viewer.clock.shouldAnimate = true;

    //Set timeline to simulation bounds
    viewer.timeline.zoomTo(start, stop);

    const position = new Cesium.SampledPositionProperty();
    var position1 = computeCirclularFlight(119.91388098940308, 28.463157258190098, 0.0015);

    position.addSample(start, startPos);
    position.addSample(stop, endPos);
    // viewer.trackedEntity = 
    const model = viewer.entities.add({
      availability: new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({
          start: start,
          stop: stop,
        }),
      ]),
      model: {
        uri: modelUrl,
        show: showPoint ? false : true,
        scale,
      },
      ellipse: {
        show: showPoint ? true : false,
        semiMinorAxis: 200,
        semiMajorAxis: 200,
        fill: true,
        material: new Cesium.ImageMaterialProperty({
          image: circle
        }),
      },
      label: {
        text,
        show: showPoint ? false : true,
        font: "8px  MicroSoft YaHei",// 格式要求字号 字体 '32px MicroSoft YaHei',
        fillColor: Cesium.Color.LIGHTBLUE,
        // outlineColor:Cesium.Color.RED,
        style: Cesium.LabelStyle.FILL,
        outlineWidth: 1,
        //verticalOrigin : Cesium.VerticalOrigin.BUTTON,
        pixelOffset: new Cesium.Cartesian2(0, -60)
      },
      viewFrom: new Cesium.Cartesian3(-100.0, 0.0, 100.0),
      position: airPlane ? position1 : position,
      orientation: new Cesium.VelocityOrientationProperty(airPlane ? position1 : position),
    });
    function computeCirclularFlight(lon, lat, radius) {
      var property = new Cesium.SampledPositionProperty();
      for (var i = 0; i <= 360; i += 45) {
        var radians = Cesium.Math.toRadians(i);
        var time = Cesium.JulianDate.addSeconds(
          start,
          i,
          new Cesium.JulianDate()
        );
        var position = Cesium.Cartesian3.fromDegrees(
          lon + radius * 1.5 * Math.cos(radians),
          lat + radius * Math.sin(radians),
          200
        );
        property.addSample(time, position);
        property.setInterpolationOptions({
          interpolationDegree: 2,
          interpolationAlgorithm: Cesium.HermitePolynomialApproximation,
        });

        // //Also create a point for each sample we generate.
        // viewer.entities.add({
        //   position: position,
        //   point: {
        //     pixelSize: 8,
        //     color: Cesium.Color.TRANSPARENT,
        //     outlineColor: Cesium.Color.YELLOW,
        //     outlineWidth: 3,
        //   },
        // });
      }

      return property;
    }


    // var entity = viewer.entities.add({
    //   //Set the entity availability to the same interval as the simulation time.
    //   availability: new Cesium.TimeIntervalCollection([
    //     new Cesium.TimeInterval({
    //       start: start,
    //       stop: stop,
    //     }),
    //   ]),

    //   //Use our computed positions
    //   position: position1,

    //   //Automatically compute orientation based on position movement.
    //   orientation: new Cesium.VelocityOrientationProperty(position1),

    //   //Load the Cesium plane model to represent the entity
    //   model: {
    //     uri: modelUrl,
    //     minimumPixelSize: 10,
    //     scale: 0.25
    //   },

    //   //Show the path as a pink line sampled in 1 second increments.
    //   // path: {
    //   //   resolution: 1,
    //   //   material: new Cesium.PolylineGlowMaterialProperty({
    //   //     glowPower: 0.1,
    //   //     color: Cesium.Color.YELLOW,
    //   //   }),
    //   //   width: 10,
    //   // },
    // });
  }

  // 旋转锥
  static setCone(viewer: any, lon: number, lat: number, height: number, text: string, description: string, url: string) {
    // 119.92288031584074, 28.470939553526446, 140
    const position = new Cesium.Cartesian3.fromDegrees(lon, lat, height);
    let aY = Cesium.Cartesian3.UNIT_Y;
    let angle = 1;
    const rotationProperty = new Cesium.CallbackProperty(function (time, result) {
      angle += 0.01;
      return Cesium.Quaternion.fromAxisAngle(aY, angle, result);
    }, false);
    const transformation = new Cesium.NodeTransformationProperty({
      rotation: rotationProperty
    });
    const nodeTransformations = {
      "Pyramid002": transformation,
      "??001": transformation
    }
    const Cone = viewer.entities.add({
      position,
      model: {
        uri: url,
        scale: 128,
        nodeTransformations: nodeTransformations
      },
      label: {
        text,
        font: "14px  MicroSoft YaHei 700",// 格式要求字号 字体 '32px MicroSoft YaHei',
        fillColor: Cesium.Color.HOTPINK,
        // outlineColor:Cesium.Color.RED,
        style: Cesium.LabelStyle.FILL,
        outlineWidth: 1,
        //verticalOrigin : Cesium.VerticalOrigin.BUTTON,
        pixelOffset: new Cesium.Cartesian2(0, -30)
      },
    })
    handlerFun(Cesium.ScreenSpaceEventType.LEFT_CLICK, Cone, (position, pickEntity) => {
      showLabel(Cone.id, lon, lat, 80, description)
    });

  }
}