//军事标绘
import appConfig from "@/js/appConfig"
import PlotDraw from "@/components/Plot/MilitaryPlot/PlotDraw"
import PlotEdit from "@/components/Plot/MilitaryPlot/PlotEdit"
import MilitaryPlotLayer from "@/components/Plot/PlotLayer/MilitaryPlot"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();
        this.initPlot();
        this.initDatas();
    },

    //初始化viewer
    initViewer(el) {
        this.viewer = new Cesium.Viewer(el, {
            infoBox: false,
            selectionIndicator: false,
            navigation: false,
            animation: false,
            shouldAnimate: false,
            timeline: false,
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: appConfig.imageryProvider
            })
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
    },

    //初始化标绘
    initPlot() {
        this.militaryPlotLayer = new MilitaryPlotLayer(this.viewer);
        this.militaryPlotLayer.setPlotSelectable(true);

        this.plotDraw = new PlotDraw(this.viewer);
        this.plotDraw.PlotDrawEndEvent.addEventListener((drawPlot, plotType) => {
            drawPlot.remove();
            this.militaryPlotLayer.addPlot(drawPlot.toGeoJson());
        });

        this.plotEdit = new PlotEdit(this.viewer, this.militaryPlotLayer);
        this.plotEdit.activate();

        this.plotEdit.PlotEditEndEvent.addEventListener(editPlot => {
            console.log(editPlot); //编辑结束
            console.log("编辑结束");
        });
    },

    //激活绘制
    activateDraw(plotType) {
        this.plotDraw.activate(plotType);
    },

    //加载数据
    initDatas() {
        fetch("../../static/data/1602419460829.json").then(res => {
            return res.json();
        }).then(res => {
            let features = res.features;
            features.forEach(feature => {
                this.militaryPlotLayer.addPlot(feature);
            })
        }).catch(err => {
            console.log(err)
        })
    },

    //保存数据
    savePlots() {
        const features = [];
        this.militaryPlotLayer.plots.forEach(plot => {
            features.push(plot.toGeoJson());
        })
        let geojson = {
            "type": "FeatureCollection",
            "features": features
        }
        let data = JSON.stringify(geojson);

        var blob = new Blob([data], { type: 'text/json' });
        var e = document.createEvent('MouseEvents');
        var a = document.createElement('a');
        a.download = new Date().getTime() + ".json";
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    },

    //清空
    clear() {
        this.militaryPlotLayer.clear();
    },

    //加载3dtiles数据
    load3dtiles() {
        var tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: appConfig.zy3dtiles,
            })
        );

        tileset.readyPromise
            .then(tileset => {
                this.viewer.zoomTo(
                    tileset,
                );
                this.setTilesetHeight(tileset);
            })
            .otherwise(function(error) {
                console.log(error);
            });
    },

    //调整3dtiles的高度位置
    setTilesetHeight(tileset) {
        var cartographic = Cesium.Cartographic.fromCartesian(
            tileset.boundingSphere.center
        );
        var surface = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            cartographic.height
        );
        var offset = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude, 55
        );
        var translation = Cesium.Cartesian3.subtract(
            offset,
            surface,
            new Cesium.Cartesian3()
        );
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    }
}
export default cesiumInit;