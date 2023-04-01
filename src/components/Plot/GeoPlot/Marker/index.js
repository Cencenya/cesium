import GeoPlotBase from "../PlotBase";
import PlotTypes from "../PlotTypes"

export default class Marker extends GeoPlotBase {
    constructor(viewer, geoFeature) {
        super(viewer, geoFeature);

        this.properties.plotType = PlotTypes.MARKER;
        this.properties.plotName = "图标点";
        this.style = this.properties.style || this.getDefaultStyle();
        this.createEntity();
        this.fixPositionCount = 1;
    }

    createEntity() {
        this.markerEntity = this.viewer.entities.add({
            position: this.positions[0],
            plotType: "GeoPlot",
            plotCode: this.properties.plotCode,
            billboard: {
                image: this.style.img,
                scaleByDistance: new Cesium.NearFarScalar(1300, 0.4, 12000, 0.1), //设置随图缩放距离和比例
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000), //设置可见距离 10000米可见
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            },
            point: {
                color: Cesium.Color.DARKBLUE.withAlpha(0.4),
                pixelSize: 0, //10
                outlineColor: Cesium.Color.YELLOW.withAlpha(0.4),
                outlineWidth: 0, //3 
                scaleByDistance: new Cesium.NearFarScalar(1000, 1, 4200, 0.4),
                disableDepthTestDistance: 500,
            },
        })
    }

    setSelected(selected) {
        if (selected) {
            this.markerEntity.point.pixelSize = 10;
            this.markerEntity.point.outlineWidth = 3;
        } else {
            this.markerEntity.point.pixelSize = 0;
            this.markerEntity.point.outlineWidth = 0;
        }
    }

    getDefaultStyle() {
        return {
            img: "../../static/images/poi/sp.png"
        }
    }

    //开启编辑模式
    openEditMode(isEdit) {
        if (isEdit) {
            this.markerEntity.position = new Cesium.CallbackProperty(e => {
                return this.positions[0];
            }, false)
        } else {
            this.markerEntity.position = this.positions[0];
        }
    }

    toGeoJson() {
        return {
            type: "Feature",
            properties: this.properties,
            geometry: {
                type: "Point",
                coordinates: this.coordinates
            }
        };
    }

    //删除标绘
    remove() {
        this.viewer.entities.remove(this.markerEntity);
    }
}