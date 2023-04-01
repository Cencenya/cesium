//动态线实例
import appConfig from "@/js/appConfig"
//引入材质类
import "@/components/Materials/PolylineMaterial/PolylineLinkPulse"
import "@/components/Materials/PolylineMaterial/PolylineTrialFlow"
import "@/components/Materials/PolylineMaterial/PolylineArrowOpacity"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.addPolylineLinkPulse();
        this.addPolylineTrialFlow();
        this.addPolylineArrowOpacity();
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
            shouldAnimate: false,
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: appConfig.imageryProvider
            })
        });

        //是否开启抗锯齿
        this.viewer.scene.fxaa = true;
        this.viewer.scene.postProcessStages.fxaa.enabled = true;
    },

    addPolylineLinkPulse() {
        let lines = [
            [{ x: -1705722.7375782044, y: 5456272.240635795, z: 2818985.3064158773 }, { x: -1707465.3050721162, y: 5455799.126313257, z: 2818846.9912274643 }, { x: -1709648.901559206, y: 5455193.614325796, z: 2818696.3690761398 }],
            [{ x: -1705743.9778158371, y: 5456179.3424243955, z: 2819151.1387875197 }, { x: -1708235.6078501693, y: 5455529.657677858, z: 2818901.457562383 }, { x: -1709625.693373575, y: 5455126.525294995, z: 2818839.3192474963 }]
        ];
        let colors = [Cesium.Color.RED, Cesium.Color.AQUA]
        lines.forEach((item, index) => {
            this.viewer.entities.add({
                polyline: {
                    positions: item,
                    width: 8,
                    material: new Cesium.PolylineLinkPulseMaterialProperty(colors[index], 10000),
                    clampToGround: true
                }
            });
        })
    },

    addPolylineTrialFlow() {
        let lines = [
            [{ x: -1705719.5727869077, y: 5456375.624182519, z: 2818788.4358880203 }, { x: -1707268.7350737453, y: 5455952.069465352, z: 2818671.210907333 }, { x: -1709635.8100880147, y: 5455271.383798028, z: 2818554.747371558 }],
            [{ x: -1705774.083582354, y: 5456455.8386593675, z: 2818601.42995507 }, { x: -1708265.7347283296, y: 5455756.4481896395, z: 2818447.2990572792 }, { x: -1709574.189798031, y: 5455378.459767089, z: 2818386.0095119956 }]
        ]

        let colors = [Cesium.Color.RED, Cesium.Color.AQUA]
        lines.forEach((item, index) => {
            this.viewer.entities.add({
                polyline: {
                    positions: item,
                    width: 8,
                    material: new Cesium.PolylineTrialFlowMaterialProperty({ color: colors[index], duration: 2000 }),
                    clampToGround: true
                }
            });
        })
    },

    addPolylineArrowOpacity() {
        let lines = [
            [{ x: -1705759.1254791946, y: 5456563.243728887, z: 2818403.8820573976 }, { x: -1709580.2897493609, y: 5455451.370047656, z: 2818242.146330367 }],
            [{ x: -1705781.5982320097, y: 5456612.565487121, z: 2818295.519493847 }, { x: -1709605.7903465675, y: 5455497.846780045, z: 2818137.4127685623 }]
        ]

        let colors = [Cesium.Color.YELLOW, Cesium.Color.AQUA]
        lines.forEach((item, index) => {
            this.viewer.entities.add({
                polyline: {
                    positions: item,
                    width: 8,
                    material: new Cesium.PolylineArrowOpacityMaterialProperty(colors[index], 800, 3),
                    clampToGround: true
                }
            });
        })
    },


    setView() {
        this.viewer.scene.camera.setView({
            duration: 1,
            destination: {
                x: -1709251.0767395466,
                y: 5461386.32337908,
                z: 2820645.238657382
            },
            orientation: {
                heading: 0.13762265446730737,
                pitch: -1.460307026543739,
                roll: 0.003401834066556475
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