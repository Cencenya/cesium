import GeoPlotBase from "../PlotBase";
import PlotTypes from "../PlotTypes"

export default class Marker extends GeoPlotBase {
    constructor(viewer, geoFeature) {
        super(viewer, geoFeature);

        this.properties.plotType = PlotTypes.TEXT;
        this.properties.plotName = "文本";
        this.properties.attr = this.properties.attr || { text: "文本" };
        this.style = this.properties.style || this.getDefaultStyle();
        this.createEntity();
        this.fixPositionCount = 1;
    }

    createEntity() {
        this.textEntity = this.viewer.entities.add({
            position: this.positions[0],
            plotType: "GeoPlot",
            plotCode: this.properties.plotCode,
            label: {
                text: this.properties.attr.text,
                fillColor: Cesium.Color.fromCssColorString(this.style.fillColor),
                scale: 0.5,
                font: 'normal 40px MicroSoft YaHei',
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000),
                scaleByDistance: new Cesium.NearFarScalar(500, 1, 1500, 0.4),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -10),
                outlineWidth: 9,
                outlineColor: Cesium.Color.fromCssColorString(this.style.outlineColor)
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
            this.textEntity.point.pixelSize = 10;
            this.textEntity.point.outlineWidth = 3;
        } else {
            this.textEntity.point.pixelSize = 0;
            this.textEntity.point.outlineWidth = 0;
        }
    }

    updateText() {
        this.textEntity.label.text = this.properties.attr.text;
    }

    getDefaultStyle() {
        return {
            fillColor: "#FFFF00",
            outlineColor: "#FF0000"
        }
    }

    //开启编辑模式
    openEditMode(isEdit) {
        if (isEdit) {
            this.textEntity.position = new Cesium.CallbackProperty(e => {
                return this.positions[0];
            }, false)
        } else {
            this.textEntity.position = this.positions[0];
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
        this.viewer.entities.remove(this.textEntity);
    }
}