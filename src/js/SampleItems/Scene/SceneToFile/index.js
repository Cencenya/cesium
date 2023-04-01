//场景出图  
import appConfig from "@/js/appConfig"
import { saveToFile, saveThumbnail } from "@/utils/scene"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();
        this.initMonitors();
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
            shouldAnimate: false,
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: appConfig.imageryProvider
            }),
            contextOptions: {
                //cesium状态下允许canvas转图片convertToImage
                webgl: {
                    alpha: true,
                    depth: false,
                    stencil: true,
                    antialias: true,
                    premultipliedAlpha: true,
                    preserveDrawingBuffer: true,
                    failIfMajorPerformanceCaveat: true
                },
                allowTextureFilterAnisotropic: true
            }
        });
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
    },

    //下载场景
    downLoad1() {
        saveToFile(this.viewer.scene);
    },

    //下载缩略图
    downLoad2() {
        saveThumbnail(this.viewer.scene);
    },

    //添加相机点位
    initMonitors() {
        let monitors = [
            { name: "北京西路与北京路交叉口", ip: "42.23.33.23", type: "固定枪机", state: "在线", position: { x: -1642312.5134694357, y: 5410103.431854676, z: 2942105.546479778 } },
            { name: "阿化修理店门口", ip: "42.23.33.22", type: "固定枪机", state: "在线", position: { x: -1642335.9668148402, y: 5410073.68998821, z: 2942146.013788689 } },
            { name: "瑞安市钢材市场(东新路店)", ip: "42.23.33.12", type: "固定枪机", state: "在线", position: { x: -1642349.165646185, y: 5410058.839841634, z: 2942167.85307159 } },
            { name: "安心大药房(上旺西路店)", ip: "42.23.33.25", type: "固定枪机", state: "在线", position: { x: -1642234.6906042907, y: 5410203.789605635, z: 2941976.755600351 } },
        ]

        monitors.forEach(item => {
            this.viewer.entities.add({
                position: item.position,
                info: item,
                billboard: {
                    image: 'static/images/blueCamera.png',
                    scaleByDistance: new Cesium.NearFarScalar(500, 1, 1200, 0.8),
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000),
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                }
            })
        })
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