import LayerBase from "../Base"
import GltfPlot from "../../GltfPlot/PlotBase/GltfPlot"

export default class GltfPlotLayer extends LayerBase {
    constructor(viewer) {
        super(viewer);
        this.viewer.selectedEntityChanged.addEventListener(this.selectedEntityChanged, this);
        this.selectedPlotChanged = new Cesium.Event();
    }

    addPlot(geoFeature) {
        const gltfPlot = new GltfPlot(this.viewer, geoFeature);
        this.plots.push(gltfPlot);
    }

    selectedEntityChanged(selectedEntity) {
        if (!this.plotSelecteable) return;

        if (!selectedEntity) {
            this.clearSelectedPlot();
            this.selectedPlotChanged.raiseEvent(undefined);
            return;
        }

        const plot = this.getByPlotCode(selectedEntity.plotCode);
        if (!plot) {
            this.clearSelectedPlot();
            this.selectedPlotChanged.raiseEvent(undefined);
            return;
        }

        if (this.selectedPlot) {
            //判断是否重复选中
            if (this.selectedPlot.properties.plotCode == plot.properties.plotCode)
                return;
            else
                this.clearSelectedPlot(); //把前一个清空
        }
        this.selectedPlot = plot;
        this.selectedPlot.setSelected(true);
        this.selectedPlotChanged.raiseEvent(plot);
    }

    flyToByPlotCode(plotCode) {
        const plot = this.getByPlotCode(plotCode);
        if (!plot) {
            return;
        }

        this.viewer.flyTo(plot.gltfEntity);
        this.setSelectedPlotByCode(plotCode);
    }

    //设置标绘对象选中
    setSelectedPlotByCode(plotCode) {
        this.clearSelectedPlot();
        const plot = this.getByPlotCode(plotCode);
        if (!plot) {
            return;
        }
        this.viewer.selectedEntity = plot.gltfEntity;
        this.selectedPlot = plot;
        this.selectedPlot.setSelected(true);
    }

    clearSelectedPlot() {
        if (this.selectedPlot) {
            this.selectedPlot.setVisible(true); //这里设置可见 否则清空后 编辑的时候会报错 编辑选中对象后如果不是按下而是点击 鼠标抬起时已经清空选中对象 所以会报null错误
            this.selectedPlot.setSelected(false);
            this.selectedPlot = undefined;
        }
    }
}