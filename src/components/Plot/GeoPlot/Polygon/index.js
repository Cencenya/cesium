import GeoPlotBase from "../PlotBase";
import PlotTypes from "../PlotTypes"

export default class Polygon extends GeoPlotBase {
    constructor(viewer, geoFeature) {
        super(viewer, geoFeature);

        this.properties.plotName = "面";
        this.properties.plotType = PlotTypes.POLYGON;
        this.minPositionCount = 3;
        this.createEntity();
    }

    createEntity() {
        this.polygonEntity = this.viewer.entities.add({
            plotType: "GeoPlot",
            plotCode: this.properties.plotCode,
            polygon: {
                hierarchy: this.positions,
                material: Cesium.Color.RED.withAlpha(0.5),
                perPositionHeight: true,
            },
        })
    }

    //开启编辑模式
    openEditMode(isEdit) {
        if (isEdit) {
            this.polygonEntity.polygon = {
                hierarchy: new Cesium.CallbackProperty(e => {
                    return new Cesium.PolygonHierarchy(this.positions);
                }, false),
                material: Cesium.Color.RED.withAlpha(0.5),
                perPositionHeight: true,
            }

            this.polygonEntity.polyline = {
                positions: new Cesium.CallbackProperty(e => {
                    return this.positions.concat(this.positions[0]);
                }, false),
                width: 1,
                material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW,
                }),
                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW,
                })
            }
        } else {
            this.polygonEntity.polygon.hierarchy = this.positions;
            this.polygonEntity.polyline = {
                positions: new Cesium.CallbackProperty(e => {
                    return this.positions.concat(this.positions[0]);
                }, false),
                width: 0,
            }
        }
    }

    setSelected(selected) {
        if (selected) {
            this.polygonEntity.polyline = {
                positions: new Cesium.CallbackProperty(e => {
                    return this.positions.concat(this.positions[0]);
                }, false),
                width: 1,
                material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW,
                }),
                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW,
                })
            }
        } else {
            this.polygonEntity.polyline = {
                positions: new Cesium.CallbackProperty(e => {
                    return this.positions.concat(this.positions[0]);
                }, false),
                width: 0,
            }
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