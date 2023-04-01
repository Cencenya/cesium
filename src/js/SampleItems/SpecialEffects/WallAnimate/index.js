//动态立体墙（升级）
import appConfig from "@/js/appConfig"

import BaseAnimateWall from "@/components/SpecialEffects/Wall/BaseAnimate"
import BaseStripeAnimateWall from "@/components/SpecialEffects/Wall/BaseStripeAnimate"

let cesiumInit = {
    init(el) {

        this.initViewer(el);
        this.setView();
        this.addBaseAnimateWall();
        this.addStripeAnimateWall();
        this.addHefeiRegion();
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
    },

    //动态围墙
    addBaseAnimateWall() {
        let ps = [
            { x: -2474889.688032698, y: 4824960.400990192, z: 3346614.48985844 },
            { x: -2474959.112277405, y: 4825272.063037195, z: 3346117.112050627 },
            { x: -2474939.1810194487, y: 4825404.969460795, z: 3345941.373409761 },
            { x: -2474820.374826624, y: 4825655.0848918725, z: 3345670.0249841893 },
            { x: -2474843.7659115475, y: 4825747.278287367, z: 3345521.071249182 },
            { x: -2475040.2968019145, y: 4825831.891434628, z: 3345254.417419442 },
            { x: -2475473.209816208, y: 4825960.80360176, z: 3344752.4666252937 },
            { x: -2477532.4158931, y: 4824887.94326429, z: 3344775.4429073003 },
            { x: -2477541.3292041654, y: 4824715.925108329, z: 3345015.3520040256 },
            { x: -2477729.6032597255, y: 4824404.662660069, z: 3345322.7504442455 },
            { x: -2477696.14832603, y: 4824303.597160613, z: 3345492.131472891 },
            { x: -2477338.4608761664, y: 4824051.183092954, z: 3346116.7295456477 },
            { x: -2477102.505171502, y: 4823769.316606554, z: 3346693.825706187 },
            { x: -2474887.535021391, y: 4824959.289977459, z: 3346617.6624656776 },
            { x: -2474889.688032698, y: 4824960.400990192, z: 3346614.48985844 }
        ];

        let wall = new BaseAnimateWall(
            this.viewer,
            ps,
            800,
            Cesium.Color.LIME,
            1000
        );
    },

    //条状动态围墙
    addStripeAnimateWall() {
        let ps = [
            { x: -2472746.317645412, y: 4827440.497417323, z: 3344635.0383727686 },
            { x: -2473924.83663286, y: 4826329.797883995, z: 3345361.4869923065 },
            { x: -2473227.8781009037, y: 4825844.349650365, z: 3346568.7831696123 },
            { x: -2471128.5540824533, y: 4826930.959796889, z: 3346552.6072027795 },
            { x: -2471138.95000219, y: 4827726.807578295, z: 3345404.4772703657 },
            { x: -2472746.317645412, y: 4827440.497417323, z: 3344635.0383727686 }
        ];

        let stripeWall = new BaseStripeAnimateWall(
            this.viewer,
            ps,
            800,
            Cesium.Color.YELLOW,
            1000
        );
    },

    //行政边界 引用火星科技数据
    addHefeiRegion() {
        fetch("../../static/data/hefei.json")
            .then(res => {
                return res.json();
            })
            .then(res => {
                let coordinates = res.geometry.coordinates[0];
                let ps = this.coordinateToPositions(coordinates);
                let regionWall = new BaseAnimateWall(
                    this.viewer,
                    ps,
                    800,
                    Cesium.Color.YELLOW,
                    1000
                );
            });
    },

    //坐标转换
    coordinateToPositions(coordinates) {
        let positions = [];
        coordinates.map(c => {
            positions.push(Cesium.Cartesian3.fromDegrees(c[0], c[1], 0));
        });
        return positions;
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