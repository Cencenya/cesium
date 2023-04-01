// 光柱椎体实例  
import appConfig from "@/js/appConfig"
import ConeGlow from "@/components/SpecialEffects/ConeGlow"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.setView();
    },

    //初始化viewer
    initViewer(el) {
        this.viewer = new Cesium.Viewer("cesium-container", {
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
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: appConfig.imageryProvider
            })
        });
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
        this.addConeGlows();

        //是否开启抗锯齿
        this.viewer.scene.fxaa = true;
        this.viewer.scene.postProcessStages.fxaa.enabled = true;
    },

    //添加光柱椎体
    addConeGlows() {
        let position = { x: -1562756.9295918583, y: 5404578.432464938, z: 2994747.2490796573 };
        let goneGlow = new ConeGlow(this.viewer, position, {
            height: 5000,
            bottomRadius: 200,
            color: Cesium.Color.RED
        });

        position = { x: -1560331.2032238909, y: 5404886.974856732, z: 2995450.429692663 };
        goneGlow = new ConeGlow(this.viewer, position, {
            height: 3000,
            bottomRadius: 150,
            color: Cesium.Color.AQUA
        });

        position = { x: -1561318.797446404, y: 5405504.028424135, z: 2993832.837122818 };
        goneGlow = new ConeGlow(this.viewer, position, {
            height: 3000,
            bottomRadius: 150,
            color: Cesium.Color.AQUA
        });

        position = { x: -1562239.5199121884, y: 5404163.5645572, z: 2995758.89322787 };
        goneGlow = new ConeGlow(this.viewer, position, {
            height: 3000,
            bottomRadius: 150,
            color: Cesium.Color.AQUA
        });

        position = { x: -1562239.5199121884, y: 5404163.5645572, z: 2995758.89322787 };
        goneGlow = new ConeGlow(this.viewer, position, {
            height: 3000,
            bottomRadius: 150,
            color: Cesium.Color.AQUA
        });

        position = { x: -1564329.6003775897, y: 5404355.961642024, z: 2994330.4268432795 };
        goneGlow = new ConeGlow(this.viewer, position, {
            height: 3000,
            bottomRadius: 160,
            color: Cesium.Color.YELLOW
        });

        position = { x: -1564189.6980789949, y: 5404868.868931728, z: 2993483.329905118 };
        goneGlow = new ConeGlow(this.viewer, position, {
            height: 3000,
            bottomRadius: 150,
            color: Cesium.Color.AQUA
        });

        position = { x: -1564162.2390058872, y: 5403265.198484631, z: 2996371.87722375 };
        goneGlow = new ConeGlow(this.viewer, position, {
            height: 3000,
            bottomRadius: 150,
            color: Cesium.Color.AQUA
        });

        position = { x: -1565217.403020679, y: 5403890.171675951, z: 2994704.5856669475 };
        goneGlow = new ConeGlow(this.viewer, position, {
            height: 3000,
            bottomRadius: 150,
            color: Cesium.Color.AQUA
        });
    },

    //设置默认视图
    setView() {
        let flyToOpts = {
            destination: {
                x: -1564306.5634804969,
                y: 5410174.930131075,
                z: 2993076.075392588,
            },
            orientation: {
                heading: 4.263256414560601e-14,
                pitch: -0.7855496910582414,
                roll: 6.283185307179586,
            },
            duration: 2
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