// DynamicDivLabel  
import appConfig from "@/js/appConfig"
import DynamicDivLabel from "@/components/PointObject/DynamicDivLabel";

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.loadBuildData();
        this.addDivPoints();
        this.setView();
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
            // imageryProvider: new Cesium.UrlTemplateImageryProvider({
            //     url: appConfig.imageryProvider
            // }),
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: "https://iserver.supermap.io/iserver/services/map-china400/rest/maps/ChinaDark/zxyTileImage.png?z={z}&x={x}&y={y}"
            })
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        //是否开启抗锯齿
        this.viewer.scene.fxaa = true;
        this.viewer.scene.postProcessStages.fxaa.enabled = true;
        this.viewer._cesiumWidget._creditContainer.style.display = "none";

        new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas).setInputAction(e => {
            this.viewer._element.style.cursor = 'default';
            let position = this.viewer.scene.pickPosition(e.position);
            if (!position) {
                position = this.viewer.scene.camera.pickEllipsoid(e.position, this.viewer.scene.globe.ellipsoid);
            }
            if (!position) return;
            const c = Cesium.Cartographic.fromCartesian(position);
            console.log([
                Cesium.Math.toDegrees(c.longitude),
                Cesium.Math.toDegrees(c.latitude),
                c.height
            ]);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },

    //添加DynamicDivLabel
    addDivPoints() {
        let p = Cesium.Cartesian3.fromDegrees(121.47176626434644, 31.226931885308268, 10);
        let label = new DynamicDivLabel(this.viewer, p, "国雅大厦");

        p = Cesium.Cartesian3.fromDegrees(121.48231424363982, 31.23191186890701, 8.499769199429728);
        label = new DynamicDivLabel(this.viewer, p, "尚都国际中心");

        p = Cesium.Cartesian3.fromDegrees(121.47280527917779, 31.234259150465007, 12.031354820243122);
        label = new DynamicDivLabel(this.viewer, p, "和乔大厦Ａ座");

        p = Cesium.Cartesian3.fromDegrees(121.48405222060568, 31.237829365433115, 11.07982718755279);
        label = new DynamicDivLabel(this.viewer, p, "中国农业博物馆");

        p = Cesium.Cartesian3.fromDegrees(121.47321849061123, 31.24100983699041, 26.467250953015512);
        label = new DynamicDivLabel(this.viewer, p, "佳程广场");

        p = Cesium.Cartesian3.fromDegrees(121.47952113951413, 31.243356179468506, 5.60734758226535);
        label = new DynamicDivLabel(this.viewer, p, "天恒大厦");

        p = Cesium.Cartesian3.fromDegrees(121.47977513134624, 31.236643867399156, 77.62195973316055);
        label = new DynamicDivLabel(this.viewer, p, "茅台大厦");
    },

    loadBuildData() {
        let tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: "https://lab.earthsdk.com/model/702aa950d03c11e99f7ddd77cbe22fea/tileset.json"
            })
        );

        tileset.style = new Cesium.Cesium3DTileStyle({
            color: {
                conditions: [
                    ['${floor} >= 16', 'rgb(59 178 208)'],
                    ['${floor} >= 13', 'rgb(21 209 242)'],
                    ['${floor} >= 8', 'rgb(21 209 242)'],
                    ['${floor} >= 3', 'rgb(34 59 83)'],
                    ['true', 'rgb(251 176 59)']
                ]
            }
        });
    },


    setView() {
        this.viewer.scene.camera.setView({
            duration: 1,
            destination: {
                x: -2851891.1832973543,
                y: 4654623.669933912,
                z: 3289122.9404063364
            },
            orientation: {
                heading: 4.407407667733558,
                pitch: -0.4431785560294301,
                roll: 6.280046683773344
            }
        });
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}

export default cesiumInit;