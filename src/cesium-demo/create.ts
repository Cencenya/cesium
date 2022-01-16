import {setScene} from "./Scene"
import Models from "./model";
import {Viewer} from "cesium";
import Geometry from "./geometry";

// @ts-ignore
export const Cesium = window['Cesium'];
export let viewer: Viewer;
export const CreateViewer = () => {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYjBjN2M1NS1kODI0LTQxZDMtODEzOS01YWZiZDA5ZDNmYTUiLCJpZCI6NDA3NjEsImlhdCI6MTYwOTIwODI1N30.9VWjwVjlxD1X9Dh51E9MxVovVg-mPltcZo8lcQPh7lU';

    // ////////////////////////////////////////////////////////////////////////
    // Creating the Viewer
    // ////////////////////////////////////////////////////////////////////////

    viewer = new Cesium.Viewer('cesiumContainer', {
        scene3DOnly: true,
        selectionIndicator: false,
        baseLayerPicker: true,
        shouldAnimate: true,
        // creditContainer:"credit",
        // terrainProvider: Cesium.createWorldTerrain(),
        timeline: true,
        vrButton: false,
        // imageryProvider: new Cesium.UrlTemplateImageryProvider({
        //     url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
        //     // url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
        // }),
    });
    viewer.scene.postProcessStages.fxaa.enabled = false;
    viewer.clock.currentTime = Cesium.JulianDate.addHours(Cesium.JulianDate.now(new Date()), 8, new Cesium.JulianDate());// 修改时区
    viewer.scene.sun.show = true;
    viewer.scene.moon.show = true;
    viewer.scene.skyBox.show = true;//关闭天空盒，否则会显示天空颜色

    viewer.scene.globe.show = true; //不显示地球，这条和地球透明度选一个就可以
    viewer.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 1);

    // const blueEllipse = viewer.entities.add({
    //     position: Cesium.Cartesian3.fromDegrees(-95.0, 40.0, 100000.0),
    //     name: 'Blue translucent, rotated, and extruded ellipse with outline',
    //     ellipse: {
    //         semiMinorAxis: 150000.0,
    //         semiMajorAxis: 300000.0,
    //         extrudedHeight: 200000.0,
    //         rotation: Cesium.Math.toRadians(45),
    //         material: Cesium.Color.BLUE.withAlpha(0.5),
    //         outline: true
    //     }
    // });

    //
    // var czml = [{
    //     "id": "document",
    //     "name": "box",
    //     "version": "1.0"
    // }, {
    //     "id": "shape2",
    //     "name": "Red box with black outline",
    //     "position": {
    //         "cartographicDegrees": [-107.0, 40.0, 300000.0]
    //     },
    //     "box": {
    //         "dimensions": {
    //             "cartesian": [400000.0, 300000.0, 500000.0]
    //         },
    //         "material": {
    //             "solidColor": {
    //                 "color": {
    //                     "rgba": [255, 0, 0, 128]
    //                 }
    //             }
    //         },
    //         "outline": true,
    //         "outlineColor": {
    //             "rgba": [0, 0, 0, 255]
    //         }
    //     }
    // }];
    //
    // var dataSourcePromise = Cesium.CzmlDataSource.load(czml);
    // viewer.dataSources.add(dataSourcePromise);
    // viewer.zoomTo(dataSourcePromise)
    // setScene(viewer);
    Models.setModel();
    const geometry = new Geometry();
    geometry.setPolygon();

};


