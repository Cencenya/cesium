// Cesium粒子系统标绘实例
import appConfig from "@/js/appConfig"

import ParticelPlotLayer from "@/components/Plot/PlotLayer/ParticlePlot"
import { getPlotCode } from "@/components/Plot/PlotBase/PlotBaseUtils"
import { cartesian3ToCoordinates } from '@/utils/coordinate';

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.setView();
        this.initPlot();
        this.load3dtiles();
        this.initDatas();
    },

    //初始化viewer
    initViewer(el) {
        this.viewer = new Cesium.Viewer(el, {
            infoBox: false,
            selectionIndicator: false,
            navigation: false,
            animation: false,
            timeline: false,
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            shouldAnimate: true,
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: appConfig.imageryProvider
            })
        });
    },

    //初始化标绘
    initPlot() {
        this.particlePlotLayer = new ParticelPlotLayer(this.viewer);
        this.particlePlotLayer.setPlotSelectable(true);
    },

    //初始化数据
    initDatas() {
        fetch("../../static/data/1603020572924.json").then(res => {
            return res.json();
        }).then(res => {
            let features = res.features;
            features.forEach(feature => {
                this.particlePlotLayer.addPlot(feature);
            })
        }).catch(err => {
            console.log(err)
        })
    },

    //添加火焰
    addFire(position) {
        var geoFeature = {
            type: "Feature",
            properties: {
                plotCode: getPlotCode(),
                plotType: "fire",
                style: undefined,
                attr: {
                    name: "火焰"
                }
            },
            geometry: {
                type: "Point",
                coordinates: cartesian3ToCoordinates(position)
            }
        };
        this.particlePlotLayer.addPlot(geoFeature);
    },

    //添加喷泉
    addFountain(position) {
        var geoFeature = {
            type: "Feature",
            properties: {
                plotCode: getPlotCode(),
                plotType: "fountain",
                style: undefined,
                attr: {
                    name: "喷泉"
                }
            },
            geometry: {
                type: "Point",
                coordinates: cartesian3ToCoordinates(position)
            }
        };
        this.particlePlotLayer.addPlot(geoFeature);
    },

    //保存数据
    savePlots() {
        const features = [];
        this.particlePlotLayer.plots.forEach(plot => {
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
        this.particlePlotLayer.clear();
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
                // this.viewer.zoomTo(
                //     tileset,
                // ); 
                this.setTilesetHeight(tileset);
            })
            .otherwise(function(error) {
                console.log(error);
            });
    },

    //设置视角
    setView() {
        let flyToOpts = {
            destination: {
                x: -1573884.6908543836,
                y: 5327973.888973422,
                z: 3122968.6617322788
            },
            orientation: {
                heading: 3.9895122290195566,
                pitch: -0.7216958404623961,
                roll: 6.280318945117999
            }
        };
        this.viewer.scene.camera.setView(flyToOpts);
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
    },
}

export default cesiumInit;