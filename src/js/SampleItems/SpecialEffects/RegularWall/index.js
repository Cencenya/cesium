//圆形、规则多边形动态立体墙 
import appConfig from "@/js/appConfig"

import CircleAnimateWall from "@/components/SpecialEffects/Wall/CircleAnimate"
import CircleStripeAnimateWall from "@/components/SpecialEffects/Wall/CircleStripeAnimate"

import RegularAnimateWall from "@/components/SpecialEffects/Wall/RegularAnimate"
import RegularStripeAnimateWall from "@/components/SpecialEffects/Wall/RegularStripeAnimate"


let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.setView();
        this.addCircleAnimateWall();
        this.addCircleStripeAnimateWall();
        this.addRegularAnimateWall();
        this.addRegularStripeAnimateWall();
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
            }),
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.viewer._cesiumWidget._creditContainer.style.display = "none";

        new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas).setInputAction(e => {
            this.viewer._element.style.cursor = 'default';
            let position = this.viewer.scene.pickPosition(e.position);
            if (!position) {
                position = this.viewer.scene.camera.pickEllipsoid(e.position, this.viewer.scene.globe.ellipsoid);
            }
            if (!position) return;
            console.log(position)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },

    //圆形动态围墙
    addCircleAnimateWall() {
        let position = { x: -2481126.313115323, y: 4827796.618981587, z: 3337939.917390362 };
        let wall = new CircleAnimateWall(this.viewer, position, 2000, 1200, Cesium.Color.RED, 2000);
    },

    //圆形条状动态围墙
    addCircleStripeAnimateWall() {
        let position = { x: -2475032.428071532, y: 4830046.650705213, z: 3339199.854771076 };
        let wall = new CircleStripeAnimateWall(this.viewer, position, 2000, 1200, Cesium.Color.YELLOW, 2000);
    },

    //规则多边形墙体
    addRegularAnimateWall() {
        let position = { x: -2469831.283879379, y: 4832405.678381114, z: 3339638.9752450027 };
        let wall = new RegularAnimateWall(this.viewer, 5, position, 2000, 1200, Cesium.Color.RED, 2000);

        position = { x: -2478848.0992203634, y: 4832625.683063663, z: 3332677.1226284597 };
        wall = new RegularAnimateWall(this.viewer, 4, position, 2000, 1200, Cesium.Color.CYAN, 2000);
    },

    //规则条状动态围墙
    addRegularStripeAnimateWall() {
        let position = { x: -2464829.9097285, y: 4834434.9824342895, z: 3340390.192953478 };
        let wall = new RegularStripeAnimateWall(this.viewer, 5, position, 2000, 1200, Cesium.Color.YELLOW, 2000);

        position = { x: -2472020.9938775566, y: 4835374.133316775, z: 3333753.8789877486 };
        wall = new RegularStripeAnimateWall(this.viewer, 6, position, 2000, 1200, Cesium.Color.AQUA, 2000);

    },


    //设置视角
    setView() {
        let flyToOpts = {
            destination: {
                x: -2480545.894127303,
                y: 4824963.985194741,
                z: 3364854.851591061
            },
            orientation: {
                heading: 3.48925214917982,
                pitch: -0.445782596897939,
                roll: 0.00023268849772595246
            },
            duration: 1
        };
        this.viewer.scene.camera.flyTo(flyToOpts);
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;