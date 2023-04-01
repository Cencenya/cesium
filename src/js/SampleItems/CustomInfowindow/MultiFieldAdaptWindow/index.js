// 多字段自适应窗口  
import MultiFieldAdaptWindow from "@/components/PopupWindow/MultiFieldAdaptWindow";
import appConfig from "@/js/appConfig"
let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();

        this.initMonitors();
        this.viewer.selectedEntityChanged.addEventListener(e => {
            this.selectedEntityChanged(e);
        });
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
            })
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
    },

    //初始化点位
    initMonitors() {
        let monitors = [
            { name: "北京西路与北京路交叉口", ip: "42.23.33.23", type: "固定枪机", state: "在线", position: { x: -1573842.0351617213, y: 5327906.719968858, z: 3122733.541764769 } },
            { name: "阿化修理店门口", ip: "42.23.33.22", type: "固定枪机", state: "在线", position: { x: -1573743.4786981696, y: 5327995.971373521, z: 3122666.986937621 } },
            { name: "瑞安市钢材市场(东新路店)", ip: "42.23.33.12", type: "固定枪机", state: "在线", position: { x: -1573711.889710824, y: 5328072.134580926, z: 3122643.841939998 } },
            { name: "安心大药房(上旺西路店)", ip: "42.23.33.25", type: "固定枪机", state: "在线", position: { x: -1573778.4103380782, y: 5327948.310818552, z: 3122695.792699967 } },
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

    //实体选中事件
    selectedEntityChanged(e) {
        if (!e) return;
        if (this.Window1) {
            this.Window1.windowClose();
            this.Window1 = undefined;
        }
        this.Window1 = new MultiFieldAdaptWindow(this.viewer, e.position._value, "监控信息", ["监控名称", "IP地址", "监控类型", "监控状态"], [e.info.name, e.info.ip, e.info.type, e.info.state]);
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
        if (this.Window1) {
            this.Window1.windowClose();
            this.Window1 = undefined;
        }
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}

export default cesiumInit;