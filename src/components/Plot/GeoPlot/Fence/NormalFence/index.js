import GeoPlotBase from "../../PlotBase";
import PlotTypes from "../../PlotTypes"
/**
 * 静态立体墙标绘类 
 */
class NormalFence extends GeoPlotBase {
    constructor(viewer, geoFeature) {
        super(viewer, geoFeature);

        this.properties.plotType = PlotTypes.NORMALFENCE;
        this.properties.plotName = "普通围栏";

        this.style.fenceHeight = this.style.fenceHeight || 20; //给个默认高度
        this.style.color = this.style.color || "#FF0000"; //默认红色
        this.createEntity();
        this.minPositionCount = 2;
    }

    getStyle() {
        return this.style;
    }

    updateStyle() {
        this.initHeights();
        this.fenceEntity.wall.material.color = Cesium.Color.fromCssColorString(this.style.color);
    }

    setStyle(style) {
        this.style = style;
        this.initHeights();
        this.fenceEntity.wall.material.color = Cesium.Color.fromCssColorString(this.style.color);
    }

    setPositions(value) {
        this.positions = value ? value : [];
        this.coordinates = [];
        this.positions.forEach(item => {
            const c = Cesium.Cartographic.fromCartesian(item);
            const coordinate = [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude), c.height];
            this.coordinates.push(coordinate);
        })

        //更新高度
        this.initHeights();
    }

    initHeights() {
        let minimumHeights = []; //从坐标串中获取最小高度 
        this.positions.forEach(position => {
            const cartographic = Cesium.Cartographic.fromCartesian(position);
            minimumHeights.push(cartographic.height);
        });

        let maximumHeights = []; //最大高度集合
        let dayMaximumHeights = []; //动态最大高度集合 长度与最大高度对应
        for (let i = 0; i < minimumHeights.length; i++) {
            maximumHeights.push(minimumHeights[i] + this.style.fenceHeight);
            dayMaximumHeights.push(minimumHeights[i]);
        }

        this.minimumHeights = minimumHeights;
        this.maximumHeights = maximumHeights;
        this.dayMaximumHeights = dayMaximumHeights;
    }


    createEntity() {
        this.initHeights(); //创建之前先设置高度
        this.initFence();
    }

    initFence() {
        this.fenceEntity = this.viewer.entities.add({
            plotType: this.properties.plotBase,
            plotCode: this.properties.plotCode,
            wall: {
                positions: new Cesium.CallbackProperty(e => {
                    return this.positions
                }, false),
                minimumHeights: new Cesium.CallbackProperty(e => {
                    return this.minimumHeights //最小高度集合
                }, false),
                maximumHeights: new Cesium.CallbackProperty(e => {
                    return this.maximumHeights
                }, false),
                material: new Cesium.ImageMaterialProperty({
                    image: "../../../static/images/effects/fence1.png",
                    transparent: true,
                    color: Cesium.Color.fromCssColorString(this.style.color)
                })
            }
        });
    }

    setSelected(selected) {
        if (selected) {
            this.fenceEntity.polyline = {
                positions: new Cesium.CallbackProperty(e => {
                    return this.positions
                }, false),
                width: 2,
                clampToGround: false,
                material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW,
                }),
                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW,
                }),
            }
        } else {
            this.fenceEntity.polyline = {
                positions: [],
                width: 0,
            };
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

    //移除标绘
    remove() {
        this.viewer.entities.remove(this.fenceEntity);
    }
}
export default NormalFence;