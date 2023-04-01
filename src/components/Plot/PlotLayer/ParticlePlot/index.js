import LayerBase from "../Base"
import PlotFactory from "../../ParticlePlot/PlotFactory"

export default class ParticelPlotLayer extends LayerBase {
    constructor(viewer) {
        super(viewer);
        this.initEvent();
        this.selectedPlotChanged = new Cesium.Event();
    }

    addPlot(geoFeature) {
        const particlePlot = PlotFactory.createPlot(this.viewer, geoFeature.properties.plotType, geoFeature);
        this.plots.push(particlePlot);
    }


    initEvent() {
        new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
            .setInputAction(((e) => {
                if (!this.plotSelecteable) return;
                //鼠标点击经纬度 
                let id = this.viewer.scene.pick(e.position);
                if (!id) {
                    this.selectedEntityChanged(undefined);
                    return;
                }
                //拾取到粒子系统对象
                if (id.primitive && id.collection) {
                    this.selectedEntityChanged(id);
                } else {
                    this.selectedEntityChanged(undefined);
                }
            }), Cesium.ScreenSpaceEventType.LEFT_CLICK)
    }

    selectedEntityChanged(selectedEntity) {
        if (!selectedEntity) {
            this.clearSelectedPlot();
            this.selectedPlotChanged.raiseEvent(undefined);
            return;
        }

        const plot = this.getPlotBy_textureAtlasGUID(selectedEntity.collection._textureAtlasGUID);
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

    //获取粒子对象
    getPlotBy_textureAtlasGUID(_textureAtlasGUID) {
        for (let i = 0; i < this.plots.length; i++) {
            let plot = this.plots[i];
            if (plot.particleSystem._billboardCollection._textureAtlasGUID == _textureAtlasGUID) {
                return plot;
            }
        }
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

        this.selectedPlot = plot;
        this.selectedPlot.setSelected(true);
    }

    clearSelectedPlot() {
        if (this.selectedPlot) {
            this.selectedPlot.setSelected(false);
            this.selectedPlot = undefined;
        }
    }
}