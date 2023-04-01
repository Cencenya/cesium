import TextMapPlotBase from "../PlotBase";
import PlotTypes from "../PlotTypes"
import { drawText } from "../PlotUtils"
export default class Polygon extends TextMapPlotBase {
    constructor(viewer, geoFeature) {
        super(viewer, geoFeature);
        this.properties.plotName = "多边形文字贴图";
        this.properties.plotType = PlotTypes.POLYGON;
        this.minPositionCount = 3;
        this.style = this.properties.style || this.getDefaultStyle();
        this.properties.style = this.style;
        this.createEntity();
    }

    createEntity() {
        this.polygonEntity = this.viewer.entities.add({
            plotType: this.properties.plotBase,
            plotCode: this.properties.plotCode,
            polygon: {
                hierarchy: this.getPositions(),
                material: new Cesium.ImageMaterialProperty({
                    image: drawText(this.style),
                    transparent: true,
                    color: Cesium.Color.WHITE
                }),
                stRotation: Cesium.Math.toRadians(this.style.stRotation),
                classificationType: Cesium.ClassificationType.BOTH
            },
        })
    }

    getStyle() {
        return this.style;
    }

    updateStyle() {
        this.polygonEntity.polygon.material.image = drawText(this.style);
        this.polygonEntity.polygon.stRotation = new Cesium.CallbackProperty(e => {
            return Cesium.Math.toRadians(this.style.stRotation);
        }, false);
    }

    //开启编辑模式
    openEditMode(isEdit) {
        if (isEdit) {
            this.polygonEntity.polygon.hierarchy = new Cesium.CallbackProperty(e => {
                return new Cesium.PolygonHierarchy(this.getPositions());
            }, false);
        } else {
            this.polygonEntity.polygon.hierarchy = this.getPositions();
        }
    }

    setSelected(selected) {
        if (selected) {
            this.polygonEntity.polyline = {
                positions: new Cesium.CallbackProperty(e => {
                    return this.getPositions();
                }, false),
                width: 1,
                material: Cesium.Color.AQUA,
                depthFailMaterial: Cesium.Color.AQUA,
                // clampToGround: true
            }
        } else {
            this.polygonEntity.polyline = {
                positions: [],
                width: 0,
                material: Cesium.Color.AQUA,
                depthFailMaterial: Cesium.Color.AQUA,
                // clampToGround: true
            }
        }
    }

    getDefaultStyle() {
        return {
            text: "多边形文字贴图",
            fontSize: 84,
            color: "#FFFF00",
            stRotation: 0,
        }
    }

    toGeoJson() {
        return {
            type: "Feature",
            properties: this.properties,
            geometry: {
                type: "Polygon",
                coordinates: this.coordinates
            }
        };
    }

    //删除标绘
    remove() {
        this.viewer.entities.remove(this.polygonEntity);
    }
}