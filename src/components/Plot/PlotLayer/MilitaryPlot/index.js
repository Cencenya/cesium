import LayerBase from "../Base"
import PlotFactory from "../../MilitaryPlot/PlotFactory"

//军事标绘图层类
export default class MilitaryPlotLayer extends LayerBase {
    constructor(viewer) {
        super(viewer);
        this.selectedPlotChanged = new Cesium.Event();
        this.initEvent();
    }

    //添加一个标绘
    addPlot(geoFeature) {
        let newPlot = PlotFactory.createPlot(this.viewer, geoFeature.properties.plotType, geoFeature);
        this.plots.push(newPlot);
        return newPlot;
    }

    //根据标绘编号飞行到标绘对象
    flyToByPlotCode(plotCode) {
        const plot = this.getByPlotCode(plotCode);
        if (!plot) {
            return;
        }
        this.setSelectedPlot(plot);
        //this.viewer.flyTo(plot.polygonEntity);//贴对象的面作为飞行目标飞行会不准确 所以新建一个不是贴对象的目标
        let flyTargetEntity = this.viewer.entities.add({
            polygon: {
                hierarchy: plot.positions,
                perPositionHeight: true,
                material: Cesium.Color.YELLOW.withAlpha(0.001),
                outline: false
            }
        });
        //飞行结束后将飞行目标删除
        this.viewer.flyTo(flyTargetEntity)
            .then(() => {
                this.viewer.entities.remove(flyTargetEntity);
            });
    }

    //设置编号选中
    setSelectedPlot(plot) {
        if (!this.plotSelecteable) return;
        if (this.selectedPlot) {
            this.selectedPlot.setSelected(false);
        }
        this.selectedPlot = plot;
        this.selectedPlot.setSelected(true);
        //触发选中事件
        this.selectedPlotChanged.raiseEvent(plot);
    }

    //清除选中编号
    clearSelectedPlot() {
        if (this.selectedPlot) {
            this.selectedPlot.setSelected(false);
            this.selectedPlot.openEditMode(false);
            this.selectedPlot = undefined;
        }
    }

    //初始化事件
    initEvent() {
        new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
            .setInputAction(e => {
                if (!this.plotSelecteable) return;
                let id = this.viewer.scene.pick(e.position);
                if (!id || !id.id) {
                    if (this.selectedPlot) {
                        this.selectedPlot.setSelected(false);
                        this.selectedPlot = undefined;
                        //触发选中事件
                        this.selectedPlotChanged.raiseEvent(undefined);
                    }
                    return; // 没有拾取到对象 直接返回 不做任何操作
                }
                // 拾取到对象 判断拾取到的对象类型
                if (!id.id || !id.id.type || id.id.type != "MilitaryPlot") {
                    if (this.selectedPlot) {
                        this.selectedPlot.setSelected(false);
                        this.selectedPlot = undefined;
                        //触发选中事件
                        this.selectedPlotChanged.raiseEvent(undefined);
                    }
                };

                //避免重复选择 
                if (this.selectedPlot && this.selectedPlot.properties.plotCode == id.id.plotCode) return;
                const plot = this.getByPlotCode(id.id.plotCode);
                if (!plot) {
                    if (this.selectedPlot) {
                        this.selectedPlot.setSelected(false);
                        this.selectedPlot = undefined;
                    }
                    //触发选中事件
                    this.selectedPlotChanged.raiseEvent(undefined);
                } else {
                    //触发选中事件
                    this.selectedPlot = plot;
                    this.selectedPlot.setSelected(true);
                    this.selectedPlotChanged.raiseEvent(plot);
                }

            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
}