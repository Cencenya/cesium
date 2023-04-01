// 视频融合  
import appConfig from "@/js/appConfig"
import VideoShed3d from "@/components/IndustryApplication/VideoFusion/VideoShed3d"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();
        this.setView();
        this.initVideoFuse();
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
            // imageryProvider: new Cesium.UrlTemplateImageryProvider({
            //     url: appConfig.imageryProvider
            // }),
            imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
            })
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true; //默认为false
    },

    initVideoFuse() {
        this.videoShed3d = new VideoShed3d(this.viewer, {
            url: "../../static/lukou.mp4",
            position: {
                x: 108.95941714166067,
                y: 34.219812715439865,
                z: 72.01781951233912
            },
            //旋转参数
            rotation: {
                x: -53,
                y: 3,
                z: 0
            },
            near: 0,
            far: 240, //距离
            fov: 12, //张角
            aspectRatio: 1,
            alpha: 1, //透明
            debugFrustum: true //是否显示投影线
        });
    },

    //设置视角
    setView() {
        let flyToOpts = {
            destination: {
                x: -1715364.449942997,
                y: 4993248.386956065,
                z: 3566686.6600144217
            },
            orientation: {
                heading: 6.005026929302029,
                pitch: -1.1614799523621118,
                roll: 6.281017982608725
            },
            duration: 1
        };
        this.viewer.scene.camera.setView(flyToOpts);
    },

    //加载三维模型
    load3dtiles() {
        let tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: "http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json"
            })
        );

        tileset.readyPromise
            .then(tileset => {
                this.tileset = tileset;
                this.setTilesetHeight(tileset);
            })
            .otherwise(function(error) {
                console.log(error);
            });
    },


    //调整3dtiles的高度位置
    setTilesetHeight(tileset) {
        let cartographic = Cesium.Cartographic.fromCartesian(
            tileset.boundingSphere.center
        );
        let surface = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            cartographic.height
        );
        let offset = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            20
        );
        let translation = Cesium.Cartesian3.subtract(
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