import LayerBase from "../Base"
import PlotFactory from '../../HtmlPlot/PlotFactory'
export default class HtmlPlotLayer extends LayerBase {
    constructor(viewer) {
        super(viewer);
        this.selectedPlotChanged = new Cesium.Event();
        this.initEvent();
    }

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
                if (!id.id || !id.id.type || id.id.type != "HtmlPlot") {
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
                    this.clearSelectedPlot();
                    this.selectedPlot = plot;
                    this.selectedPlot.setSelected(true);
                    this.selectedPlotChanged.raiseEvent(plot);
                }

            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    addPlot(geoFeature) {
        let newPlot = PlotFactory.createPlot(this.viewer, geoFeature.properties.plotType, geoFeature);
        this.plots.push(newPlot);
        newPlot.layer = this;
        return newPlot;
    }

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

    clearSelectedPlot() {
        if (this.selectedPlot) {
            this.selectedPlot.setSelected(false);
            this.selectedPlot = undefined;
        }
    }

    flyToByPlotCode(plotCode) {
        const plot = this.getByPlotCode(plotCode);
        if (!plot) {
            return;
        }
        this.setSelectedPlot(plot);
        this.viewer.flyTo(plot.billboardEntity);
    }
}