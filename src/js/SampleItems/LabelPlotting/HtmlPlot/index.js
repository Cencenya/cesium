// 自定义html标注图层实例
import appConfig from "@/js/appConfig"
import EntityDraw from "@/components/CesiumTools/EntityDraw"
import LabelLayer from "@/components/Plot/PlotLayer/HtmlPlot";
import { getPlotCode } from "@/components/Plot/PlotBase/PlotBaseUtils"
import { cartesian3ToCoordinates } from '@/utils/coordinate';
import HtmlPlotEdit from "@/components/Plot/HtmlPlot/PlotEdit";

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();
        this.initEntityDraw();
        this.labelLayer = new LabelLayer(this.viewer);
        this.labelLayer.setPlotSelectable(true);

        this.htmlPlotEdit = new HtmlPlotEdit(
            cesiumInit.viewer,
            cesiumInit.labelLayer
        );

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
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
    },

    //加载数据
    initDatas() {
        fetch("../../static/data/1602424629194.json").then(res => {
            return res.json();
        }).then(res => {
            let features = res.features;
            features.forEach(feature => {
                this.labelLayer.addPlot(feature);
            })
        }).catch(err => {
            console.log(err)
        })
    },

    //初始化绘制
    initEntityDraw() {
        this.entityDraw = new EntityDraw(this.viewer);
        this.entityDraw.DrawEndEvent.addEventListener((result, positions) => {
            result.remove();
            this.addLabel(positions[0]);
        })
    },

    //添加标注
    addLabel(position) {
        const plotType = this.labelType == 0 ? "simplelabel" : "gradientslabel";
        var geoFeature = {
            type: "Feature",
            properties: {
                plotCode: getPlotCode(),
                plotType: plotType,
                attr: {
                    label: "标注内容",
                }
            },
            geometry: {
                type: "Point",
                coordinates: cartesian3ToCoordinates(position)
            }
        };
        this.labelLayer.addPlot(geoFeature);
    },

    //激活绘制工具
    drawActivate(type) {
        this.labelType = type;
        this.entityDraw.activate("Point");
    },

    //保存内容
    savePlots() {
        const features = [];
        this.labelLayer.plots.forEach(plot => {
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

    //清空所有
    clear() {
        this.labelLayer.clear();
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
    },
}
export default cesiumInit;