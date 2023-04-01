import PlotBase from "../../PlotBase"
import PlotTypes from "../../PlotTypes"
//面标绘 面标绘类是所有面状军事标绘的父类 默认贴对象
export default class Polygon extends PlotBase {
    constructor(viewer, geoFeature) {
        super(viewer, geoFeature);

        this.properties.plotType = PlotTypes.POLYGON; //标绘类型
        this.properties.plotName = "面"; //标绘名称
        this.generateEntity();
        this.minPointCount = 3;
    }

    //构造Entity
    generateEntity() {
        this.polygonEntity = this.viewer.entities.add({
            plotType: this.properties.plotBase,
            plotCode: this.properties.plotCode,
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy(this.positions || []),
                material: Cesium.Color.YELLOW.withAlpha(0.6),
                classificationType: Cesium.ClassificationType.BOTH
            },
        });
    }

    //选中效果
    setSelected(selected) {
        if (selected) {
            this.polygonEntity.polygon.material = Cesium.Color.RED.withAlpha(0.8);
        } else {
            this.polygonEntity.polygon.material = Cesium.Color.YELLOW.withAlpha(0.6);
        }
    }

    //构造点坐标
    generate() {
        var count = this.getPointCount();
        if (count < 2) {
            return;
        }
        this.generatePositions(this.coordinates[0]);
    }

    //开启或关闭编辑模式
    openEditMode(isEdit) {
        if (isEdit) {
            this.polygonEntity.polygon.hierarchy = new Cesium.CallbackProperty(e => {
                return new Cesium.PolygonHierarchy(this.positions || []);
            }, false);

            this.polygonEntity.polyline = {
                positions: new Cesium.CallbackProperty(e => {
                    if (this.positions && this.positions.length > 0)
                        return this.positions.concat(this.positions[0]);
                    else {
                        return [];
                    }
                }, false),
                width: 2,
                clampToGround: true,
                material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW,
                }),
                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW,
                }),
            }
        } else {
            this.polygonEntity.polygon.hierarchy = new Cesium.PolygonHierarchy(this.positions || []);
            if (this.polygonEntity.polyline) this.polygonEntity.polyline.width = 0;
        }
    }

    //转到geojson对象 用于存储操作
    toGeoJson() {
        return {
            "type": "Feature",
            "properties": this.properties,
            "geometry": {
                "type": "Polygon",
                "coordinates": this.coordinates
            }
        }
    }

    //移除标绘对象
    remove() {
        this.viewer.entities.remove(this.polygonEntity);
    }
}