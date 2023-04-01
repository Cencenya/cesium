// 绘制扩展
import PlotDraw from "@/components/Plot/GeoPlot/PlotDraw";
import PlotEdit from "@/components/Plot/GeoPlot/PlotEdit";
import PlotLayer from "@/components/Plot/PlotLayer/GeoPlot";

import appConfig from "@/js/appConfig"
let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.initDrawEdit();
        this.loadDatas();
        this.load3dtiles();
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
            sceneModePicker: true,
            navigationHelpButton: false,
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: appConfig.imageryProvider
            })
        });

        this.viewer.scene.globe.depthTestAgainstTerrain = true; //默认为false 
    },

    //绘制编辑
    initDrawEdit() {
        this.plotLayer = new PlotLayer(this.viewer);
        this.plotLayer.setPlotSelectable(true);

        this.plotEdit = new PlotEdit(this.viewer, this.plotLayer);
        this.plotEdit.activate();

        this.plotDraw = new PlotDraw(this.viewer);

        this.plotDraw.PlotDrawEndEvent.addEventListener((plot) => {
            this.plotLayer.addPlot(plot.toGeoJson());
            plot.remove();
        })
    },

    //激活绘制工具
    drawActivate(type) {
        this.plotDraw.activate(type);
    },

    //清空所有绘制
    clearDraw() {
        this.plotLayer.clear();
    },

    //保存
    savePlots() {
        const features = [];
        this.plotLayer.plots.forEach(plot => {
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

    //加载数据
    loadDatas() {
        fetch("../../static/data/1603782504969.json").then(res => {
            return res.json();
        }).then(res => {
            let features = res.features;
            features.forEach(feature => {
                this.plotLayer.addPlot(feature);
            });
        }).catch(err => {
            console.log(err)
        })
    },

    //加载三维模型
    load3dtiles() {
        var tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: appConfig.zy3dtiles,
            })
        );

        tileset.readyPromise
            .then(tileset => {
                this.tileset = tileset;
                this.viewer.zoomTo(
                    tileset,
                );
                this.setTilesetHeight(55);
            })
            .otherwise(function(error) {
                console.log(error);
            });
    },

    //设置模型高度
    setTilesetHeight(height) {
        var cartographic = Cesium.Cartographic.fromCartesian(
            this.tileset.boundingSphere.center
        );
        var surface = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            cartographic.height
        );
        var offset = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude, height
        );
        var translation = Cesium.Cartesian3.subtract(
            offset,
            surface,
            new Cesium.Cartesian3()
        );
        this.tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;