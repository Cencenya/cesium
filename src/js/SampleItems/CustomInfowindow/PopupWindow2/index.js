// 窗口样式2
import PopupWindow2 from "@/components/PopupWindow/PopupWindowBase/PopupWindow2";
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
        let monitors = [{
            point: [106.45387638471723, 29.504594313681245, 9.691983084673709],
            name: "监控1",
            url: ""
        }, {
            point: [106.45525698570214, 29.504881385813373, 10.24838062187865],
            name: "监控2",
            url: ""
        }, {
            point: [106.45661379889214, 29.504978803966548, 9.584467686712157],
            name: "监控3",
            url: ""
        }, ];

        monitors.forEach(item => {
            const point = item.point;
            this.viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(point[0], point[1], point[2]),
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
        if (this.pWindow) {
            this.pWindow.windowClose();
            this.pWindow = undefined;
        }
        this.pWindow = new PopupWindow2(this.viewer, e.position._value, "监控信息", ["监控名称", "IP地址", "监控类型", "监控状态"], [e.info.name, e.info.ip, e.info.type, e.info.state]);
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
        if (this.pWindow) {
            this.pWindow.windowClose();
            this.pWindow = undefined;
        }
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}

export default cesiumInit;