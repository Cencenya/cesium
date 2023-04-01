import LayerBase from "../Base"
import PlotFactory from "../../GeoPlot/PlotFactory"
import PlotTypes from "../../GeoPlot/PlotTypes"

export default class GeoPlotLayer extends LayerBase {
    constructor(viewer) {
        super(viewer);
        this.initEvent();
        this.selectedPlotChanged = new Cesium.Event();
    }

    addPlot(geoFeature) {
        let newPlot = PlotFactory.createPlot(this.viewer, geoFeature.properties.plotType, geoFeature);
        this.plots.push(newPlot);
        return newPlot;
    }

    flyToByPlotCode(plotCode) {
        const plot = this.getByPlotCode(plotCode);
        if (!plot) {
            return;
        }

        switch (plot.properties.plotType) {
            case PlotTypes.MARKER:
                this.viewer.flyTo(plot.markerEntity);
                break;
            case PlotTypes.NORMALFENCE:
            case PlotTypes.DYNAMICFENCE:
                this.viewer.flyTo(plot.fenceEntity);
                break;
        }
        this.setSelectedPlotByCode(plotCode);
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
                if (!id.id || !id.id.type || id.id.type != "GeoPlot") {
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

    //设置标绘对象选中
    setSelectedPlotByCode(plotCode) {
        this.clearSelectedPlot();
        const plot = this.getByPlotCode(plotCode);
        if (!plot) {
            return;
        }

        this.selectedPlot = plot;
        this.selectedPlot.setSelected(true);
        this.selectedPlotChanged.raiseEvent(plot);
    }

    clearSelectedPlot() {
        if (this.selectedPlot) {
            this.selectedPlot.setSelected(false);
            this.selectedPlot = undefined;
        }
    }
}