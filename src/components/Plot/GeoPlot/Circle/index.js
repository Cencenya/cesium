import GeoPlotBase from "../PlotBase";
import { getPositionHeight, get2PositionDistance, unifiedHeight } from "../../PlotBase/PlotBaseUtils"
import PlotTypes from "../PlotTypes"

export default class Circle extends GeoPlotBase {
    constructor(viewer, geoFeature) {
        super(viewer, geoFeature);

        this.properties.plotName = "正圆";
        this.properties.plotType = PlotTypes.CIRCLE;

        this.fixPositionCount = 2;
        this.createEntity();
    }

    updatePositionAction() {
        unifiedHeight(this.positions);
    }


    //创建实体
    createEntity() {
        this.circleEntity = this.viewer.entities.add({
            plotType: "GeoPlot",
            plotCode: this.properties.plotCode,
            position: this.positions[0],
            ellipse: {
                height: this.getHeight(),
                semiMinorAxis: this.getAxis(),
                semiMajorAxis: this.getAxis(),
                material: Cesium.Color.RED.withAlpha(0.6)
            },
        })
    }

    //圆高度
    getHeight() {
        return getPositionHeight(this.positions[0]);
    }

    //圆半径
    getAxis() {
        let p1 = this.positions[0];
        let p2 = this.positions[0];
        if (this.positions.length > 1) p2 = this.positions[1];
        return get2PositionDistance(p1, p2);
    }

    //开启编辑模式
    openEditMode(isEdit) {
        if (isEdit) {
            this.circleEntity.position = new Cesium.CallbackProperty(e => {
                return this.positions[0];
            }, false);

            this.circleEntity.ellipse.semiMinorAxis = new Cesium.CallbackProperty(e => {
                return this.getAxis()
            }, false);

            this.circleEntity.ellipse.semiMajorAxis = new Cesium.CallbackProperty(e => {
                return this.getAxis()
            }, false);

            this.circleEntity.ellipse.height = new Cesium.CallbackProperty(e => {
                return this.getHeight()
            }, false);

        } else {
            this.circleEntity.position = this.positions[0];
            this.circleEntity.ellipse.height = this.getHeight();
            this.circleEntity.ellipse.semiMajorAxis = this.getAxis();
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
        this.viewer.entities.remove(this.circleEntity);
    }
}