// 视频墙
import appConfig from "@/js/appConfig"
import PlotDraw from "@/components/Plot/VideoWallPlot/PlotDraw";
import PlotEdit from "@/components/Plot/VideoWallPlot/PlotEdit";
import PlotLayer from "@/components/Plot/PlotLayer/VideoWallPlot"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.initPlot();
        this.initDatas();
        this.load3dtiles();
        this.setView();
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
        this.viewer.scene.globe.depthTestAgainstTerrain = true; //默认为false 
        //是否开启抗锯齿
        this.viewer.scene.fxaa = true;
        this.viewer.scene.postProcessStages.fxaa.enabled = true;
    },

    //初始化plot
    initPlot() {
        this.plotLayer = new PlotLayer(this.viewer);
        this.plotLayer.setPlotSelectable(true);

        this.plotDraw = new PlotDraw(this.viewer);
        this.plotDraw.PlotDrawEndEvent.addEventListener((plot) => {
            this.plotLayer.addPlot(plot.toGeoJson());
            plot.remove();
        });

        this.plotEdit = new PlotEdit(this.viewer, this.plotLayer);
        this.plotEdit.activate();
    },

    //激活绘制
    drawActivate(type) {
        this.plotDraw.activate(type);
    },

    //清除
    clear() {
        this.plotEdit.clear();
        this.plotLayer.clear();
    },

    //初始化数据
    initDatas() {
        fetch("../../static/data/1608470854280.json").then(res => {
            return res.json();
        }).then(res => {
            let features = res.features;
            features.forEach(feature => {
                this.plotLayer.addPlot(feature);
            })
        }).catch(err => {
            console.log(err)
        })
    },

    //保存数据
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
                // this.viewer.zoomTo(
                //     tileset,
                // ); 
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

    //设置视角
    setView() {
        let flyToOpts = {
            destination: {
                x: -1573592.989980596,
                y: 5328123.997766691,
                z: 3122848.7140220148
            },
            orientation: {
                heading: 2.838961283815536,
                pitch: -0.4645048819486619,
                roll: 0.0009567719750185333
            },
            duration: 1
        };
        this.viewer.scene.camera.setView(flyToOpts);
    },

    destroy() {
        this.clear();
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;