import { viewer, Cesium } from "./create";
import { Entity } from "cesium";
import { handlerFun, showLabel } from "./marker";
import img from '../assets/image/strmingLine.png';
import mark from '../assets/image/mark.png'

export default class Geometry {

  setPolygon = () => {
    // viewer.entities.add({
    //     id: "szf",
    //     name: "polygon1",
    //     polygon: {
    //         hierarchy: Cesium.Cartesian3.fromDegreesArray([
    //             119.921045, 28.46817,
    //             119.924891, 28.468764,
    //             119.925293, 28.466991,
    //             119.921347, 28.466821,
    //         ]),
    //         material: Cesium.Color.BLUE.withAlpha(0.5),
    //     },
    // });

    // const polygon2 = viewer.entities.add({
    //     name: "polygon2",
    //     position: Cesium.Cartesian3.fromDegrees(119.905559, 28.4650),
    //     label: {
    //         text: "面"
    //     },
    //     polygon: {
    //         hierarchy: Cesium.Cartesian3.fromDegreesArray([
    //             119.904559, 28.466293,
    //             119.907026, 28.466245,
    //             119.907241, 28.463987,
    //             119.903936, 28.463953
    //         ]),
    //         material: Cesium.Color.BLUE.withAlpha(0.5),
    //     },
    // });


    // viewer.zoomTo(viewer.entities);

  }
  setMark = (id, lon: number, lat: number, height: number, text: string, description: string) => {
    const labels = viewer.entities.add(new Cesium.Entity());
    setProperties(labels);
    // setHazard(labels)
    // isolate(labels)
    labels.show = true;

    function setProperties(parent: Entity) {
      const label = viewer.entities.add({
        id,
        name: "文本标签",
        position: Cesium.Cartesian3.fromDegrees(lon, lat, height),
        //点样式
        // point: {
        //     pixelSize: 5,
        //     color: Cesium.Color.RED,
        //     outlineColor: Cesium.Color.WHITE,
        //     outlineWidth: 1
        // },
        parent,
        polyline: {//竖线
          show: true,
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            lon, lat, 0,
            lon, lat, height
          ]),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 2500),//高于多少m的时候，不可见
          width: 2,
          material: new Cesium.CustomMaterialLine({
            image: img,
            color: new Cesium.Color(77 / 255, 201 / 255, 255 / 255, 1),
            duration: 10000
          }),
        },
        //立广告牌
        billboard: {
          image: mark,
          width: 40,
          height: 40,
          pixelOffset: new Cesium.Cartesian2(0, -10)

        },
        //字体标签样式
        label: {
          text,
          font: "16px  MicroSoft YaHei",// 格式要求字号 字体 '32px MicroSoft YaHei',
          fillColor: Cesium.Color.LIGHTCORAL,
          // outlineColor:Cesium.Color.RED,
          style: Cesium.LabelStyle.FILL,
          outlineWidth: 1,
          //垂直位置
          //verticalOrigin : Cesium.VerticalOrigin.BUTTON,
          //中心位置
          pixelOffset: new Cesium.Cartesian2(0, -40)
        }
      });

      handlerFun(Cesium.ScreenSpaceEventType.LEFT_CLICK, label, (position, pickEntity) => {
        showLabel(label.id, lon, lat, 80, description)
      });
      // handler(Cesium.ScreenSpaceEventType.LEFT_CLICK, label);
    }
    function setHazard(parent: Entity) {
      const label = viewer.entities.add({
        id: "label-2",
        name: "文本标签",
        position: Cesium.Cartesian3.fromDegrees(119.91286417532214, 28.462863669630227, 140),
        //点样式
        // point: {
        //     pixelSize: 5,
        //     color: Cesium.Color.RED,
        //     outlineColor: Cesium.Color.WHITE,
        //     outlineWidth: 1
        // },
        parent,
        polyline: {//竖线
          show: true,
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            119.91286417532214, 28.462863669630227, 0,
            119.91286417532214, 28.462863669630227, 140
          ]),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1500),//高于多少m的时候，不可见
          width: 2,
          material: Cesium.Color.fromCssColorString('#fdeb13'),
        },
        //立广告牌
        billboard: {
          image: `${process.env.PUBLIC_URL}/危险 (1).png`,
          width: 40,
          height: 40,
          pixelOffset: new Cesium.Cartesian2(0, -10)

        },
        //字体标签样式
        label: {
          text: "危险源",
          font: "16px  MicroSoft YaHei",// 格式要求字号 字体 '32px MicroSoft YaHei',
          fillColor: Cesium.Color.WHITE,
          // outlineColor:Cesium.Color.RED,
          style: Cesium.LabelStyle.FILL,
          outlineWidth: 1,
          //垂直位置
          //verticalOrigin : Cesium.VerticalOrigin.BUTTON,
          //中心位置
          pixelOffset: new Cesium.Cartesian2(0, -40)
        }
      });

      handlerFun(Cesium.ScreenSpaceEventType.LEFT_CLICK, label, (position, pickEntity) => {
        showLabel(label.id, 119.91286417532214, 28.462863669630227, 80, "危险区域")
      });
      // handler(Cesium.ScreenSpaceEventType.LEFT_CLICK, label);
    }
    function isolate(parent: Entity) {
      const label = viewer.entities.add({
        id: "label-3",
        name: "文本标签",
        position: Cesium.Cartesian3.fromDegrees(119.92400321458236, 28.46212632105087, 140),
        //点样式
        // point: {
        //     pixelSize: 5,
        //     color: Cesium.Color.RED,
        //     outlineColor: Cesium.Color.WHITE,
        //     outlineWidth: 1
        // },
        parent,
        polyline: {//竖线
          show: true,
          positions: Cesium.Cartesian3.fromDegreesArrayHeights([
            119.92400321458236, 28.46212632105087, 0,
            119.92400321458236, 28.46212632105087, 140
          ]),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1500),//高于多少m的时候，不可见
          width: 2,
          material: Cesium.Color.fromCssColorString('#fdeb13'),
        },
        //立广告牌
        billboard: {
          image: `${process.env.PUBLIC_URL}/隔离.png`,
          width: 40,
          height: 40,
          pixelOffset: new Cesium.Cartesian2(0, -10)

        },
        //字体标签样式
        label: {
          text: "隔离区",
          font: "16px  MicroSoft YaHei",// 格式要求字号 字体 '32px MicroSoft YaHei',
          fillColor: Cesium.Color.WHITE,
          // outlineColor:Cesium.Color.RED,
          style: Cesium.LabelStyle.FILL,
          outlineWidth: 1,
          //垂直位置
          //verticalOrigin : Cesium.VerticalOrigin.BUTTON,
          //中心位置
          pixelOffset: new Cesium.Cartesian2(0, -40)
        }
      });

      handlerFun(Cesium.ScreenSpaceEventType.LEFT_CLICK, label, (position, pickEntity) => {
        showLabel(label.id, 119.92400321458236, 28.46212632105087, 80, "隔离地区")
      });
      // handler(Cesium.ScreenSpaceEventType.LEFT_CLICK, label);
    }
  }
}