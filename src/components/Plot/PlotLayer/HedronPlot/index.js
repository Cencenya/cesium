import LayerBase from "../Base"
import PlotFactory from "../../HedronPlot/PlotFactory"

//体对象标绘图层类
export default class HedronPlotLayer extends LayerBase {
    constructor(viewer) {
        super(viewer);
        this.selectedPlotChanged = new Cesium.Event();
        this.initEvent();
        this.targetEnterHedronEvent = new Cesium.Event(); //目标进入事件
        this.targetLeaveHedronEvent = new Cesium.Event(); //目标离开事件
        this.enterPlotCodes = {}; //目标进入的体对象编号
    }

    //添加一个标绘
    addPlot(geoFeature) {
        let newPlot = PlotFactory.createPlot(this.viewer, geoFeature.properties.plotType, geoFeature);
        this.plots.push(newPlot);
        return newPlot;
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
                if (!id.id || !id.id.type || id.id.type != "HedronPlot") {
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

    //更新目标点位
    updateTargetPosition(targetPosition) {
        let isIntersect = false;
        this.plots.forEach(plot => {
            isIntersect = plot.checkTargetIsIntersect(targetPosition);
            if (isIntersect) { //相交
                if (this.enterPlotCodes[plot.properties.plotCode]) return; //已经进入
                //首次进入 触发进入事件
                this.enterPlotCodes[plot.properties.plotCode] = true;
                console.log("目标进入：" + plot.properties.plotCode);
                plot.setSelected(true);
                this.targetEnterHedronEvent.raiseEvent(plot);
            } else {
                if (!this.enterPlotCodes[plot.properties.plotCode]) return; //未进入
                //已经进入
                this.enterPlotCodes[plot.properties.plotCode] = false;
                console.log("目标离开：" + plot.properties.plotCode);
                plot.setSelected(false);
                this.targetLeaveHedronEvent.raiseEvent(plot);
            }
        })
    }

}