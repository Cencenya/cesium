import GeoPlotBase from "../PlotBase";
import { unifiedHeight } from "../../PlotBase/PlotBaseUtils"

import PlotTypes from "../PlotTypes"

export default class Rectangle extends GeoPlotBase {
    constructor(viewer, geoFeature) {
        super(viewer, geoFeature);

        this.properties.plotName = "矩形";
        this.properties.plotType = PlotTypes.RECTANGLE;
        this.fixPositionCount = 2;
        this.createEntity();

    }

    updatePositionAction() {
        unifiedHeight(this.positions);
    }

    createEntity() {
        this.polygonEntity = this.viewer.entities.add({
            plotType: "GeoPlot",
            plotCode: this.properties.plotCode,
            polygon: {
                hierarchy: this.getRectanglePositions(),
                material: Cesium.Color.RED.withAlpha(0.6),
                perPositionHeight: true,
            }
        })
    }

    getRectanglePositions() {
        let p1 = this.positions[0];
        let p2 = this.positions[0];
        if (this.positions.length > 1) p2 = this.positions[1];

        let c1 = Cesium.Cartographic.fromCartesian(p1);
        let c2 = Cesium.Cartographic.fromCartesian(p2);
        if (c1.height < 0) c1.height = 0;
        if (c2.height < 0) c2.height = 0;
        let lls = this.getRectanglePointsByTwoPoint(c1, c2);

        // 坐标数组转为指定格式
        let ars = [
            lls[0][0], lls[0][1], c1.height,
            lls[1][0], lls[1][1], c1.height,
            lls[2][0], lls[2][1], c1.height,
            lls[3][0], lls[3][1], c1.height,
            lls[0][0], lls[0][1], c1.height,
        ]
        return new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(ars));
    }

    getRectanglePointsByTwoPoint(c1, c2) {
        //转为经纬度
        let lngLat1 = [Cesium.Math.toDegrees(c1.longitude), Cesium.Math.toDegrees(c1.latitude)];
        let lngLat2 = [Cesium.Math.toDegrees(c2.longitude), Cesium.Math.toDegrees(c2.latitude)];

        let lngLat3 = [Cesium.Math.toDegrees(c1.longitude), Cesium.Math.toDegrees(c2.latitude)];
        let lngLat4 = [Cesium.Math.toDegrees(c2.longitude), Cesium.Math.toDegrees(c1.latitude)];

        return [lngLat1, lngLat3, lngLat2, lngLat4];
    }


    //开启编辑模式
    openEditMode(isEdit) {
        if (isEdit) {
            this.polygonEntity.polygon.hierarchy = new Cesium.CallbackProperty(e => {
                return this.getRectanglePositions();
            }, false);
        } else {
            this.polygonEntity.polygon.hierarchy = this.getRectanglePositions();
        }
    }

    toGeoJson() {
        return {
            type: "Feature",
            properties: this.properties,
            geometry: {
                type: "LineString",
                coordinates: this.coordinates
            }
        };
    }

    //删除标绘
    remove() {
        this.viewer.entities.remove(this.polygonEntity);
    }
}