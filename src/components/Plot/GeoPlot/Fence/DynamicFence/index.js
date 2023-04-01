import NormalFence from "../NormalFence";
import PlotTypes from "../../PlotTypes"
/**
 * 动态立体墙标绘类 继承静态围栏类
 */
class DynamicFence extends NormalFence {
    constructor(viewer, geoFeature) {
        super(viewer, geoFeature);

        this.properties.plotType = PlotTypes.DYNAMICFENCE;
        this.properties.plotName = "动态围栏";
    }


    createEntity() {
        this.initHeights(); //创建之前先设置高度
        this.initFence();
        this.initFence1();
    }

    initFence1() {
        this.flipFenceEntity = this.viewer.entities.add({
            plotType: "GeoPlot",
            plotCode: this.properties.plotCode,
            wall: {
                positions: new Cesium.CallbackProperty(e => {
                    return this.positions
                }, false),
                minimumHeights: new Cesium.CallbackProperty(e => {
                    return this.minimumHeights;
                }, false), //最小高度集合
                maximumHeights: new Cesium.CallbackProperty(e => {
                    this.generateDayMaximumHeights();
                    return this.dayMaximumHeights || [];
                }, false),
                material: new Cesium.ImageMaterialProperty({
                    image: "../../../static/images/effects/fenceFlip1.png",
                    transparent: true,
                    color: Cesium.Color.fromCssColorString(this.style.color)
                })
            }
        });
    }

    updateStyle() {
        this.initHeights();
        this.fenceEntity.wall.material.color = Cesium.Color.fromCssColorString(this.style.color);
        this.flipFenceEntity.wall.material.color = Cesium.Color.fromCssColorString(this.style.color);
    }

    generateDayMaximumHeights() {
        for (let i = 0; i < this.minimumHeights.length; i++) {
            this.dayMaximumHeights[i] += this.style.fenceHeight * 0.004;
            if (this.dayMaximumHeights[i] > this.maximumHeights[i]) {
                this.dayMaximumHeights[i] = this.minimumHeights[i];
            }
        }
    }

    //移除标绘
    remove() {
        this.viewer.entities.remove(this.fenceEntity);
        this.viewer.entities.remove(this.flipFenceEntity);
    }
}
export default DynamicFence;