import GeoPlotBase from "../PlotBase";
import PlotTypes from "../PlotTypes"

export default class Polyline extends GeoPlotBase {
    constructor(viewer, geoFeature) {
        super(viewer, geoFeature);
        this.properties.plotName = "线";
        this.properties.plotType = PlotTypes.POLYLINE;
        this.minPositionCount = 2;
        this.createEntity();
    }

    createEntity() {
        this.polylineEntity = this.viewer.entities.add({
            plotType: "GeoPlot",
            plotCode: this.properties.plotCode,
            polyline: {
                positions: this.positions,
                width: 2,
                material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.RED,
                }),
                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.RED,
                })
            }
        })
    }

    //开启编辑模式
    openEditMode(isEdit) {
        if (isEdit) {
            this.polylineEntity.polyline.positions = new Cesium.CallbackProperty(e => {
                return this.positions;
            }, false)
        } else {
            this.polylineEntity.polyline.positions = this.positions;
        }
    }

    setSelected(selected) {
        if (selected) {
            this.polylineEntity.polyline.material = new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.YELLOW,
            });
            this.polylineEntity.polyline.depthFailMaterial = new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.YELLOW,
            })
        } else {
            this.polylineEntity.polyline.material = Cesium.Color.RED.withAlpha(0.5);
            this.polylineEntity.polyline.depthFailMaterial = Cesium.Color.RED.withAlpha(0.5);
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
        this.viewer.entities.remove(this.polylineEntity);
    }
}