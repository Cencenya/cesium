import PlotBase from "../../PlotBase"
import PlotTypes from "../../PlotTypes"
//点标绘 
export default class Marker extends PlotBase {
    constructor(viewer, geoFature) {
        super(viewer, geoFature);

        this.properties.plotType = PlotTypes.MARKER; //标绘类型
        this.properties.plotName = "Marker"; //标绘名称 
        this.generateEntity();
        this.fixPointCount = 1;
    }

    //构造Entity
    generateEntity() {
        this.markerEntity = this.viewer.entities.add({
            plotType: this.properties.plotBase,
            plotCode: this.properties.plotCode,
            position: new Cesium.CallbackProperty(e => {
                return this.positions[0]
            }, false),
            billboard: {
                image: "../../../static/images/Plot/location.png",
                scaleByDistance: new Cesium.NearFarScalar(300, 1, 1200, 0.4), //设置随图缩放距离和比例
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000), //设置可见距离 10000米可见
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            }
        });
    }

    //转到geojson对象 用于存储操作
    toGeoJson() {
        return {
            "type": "Feature",
            "properties": this.properties,
            "geometry": {
                "type": "Point",
                "coordinates": this.coordinates
            }
        }
    }

    generate() {
        var count = this.getPointCount();
        if (count < 1) {
            return;
        }
        this.generatePositions(this.coordinates[0]);
    }

    //移除标绘对象
    remove() {
        this.viewer.entities.remove(this.markerEntity);
    }
}