// DivPoint  
import appConfig from "@/js/appConfig"
import DivPoint from "@/components/PopupWindow/DivPoint";

let cesiumInit = {
    init(el) {
        this.initViewer(el);
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
            // terrainProvider: Cesium.createWorldTerrain(),
            terrainProvider: new Cesium.ArcGISTiledElevationTerrainProvider({
                url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer",
            }),
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: appConfig.imageryProvider
            }),
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
    },

    //添加divpoint
    addDivPoints() {
        let position = Cesium.Cartesian3.fromDegrees(116.274028, 30.978035, 944.63);
        let divPoint = new DivPoint(this.viewer, position, {
            name: "明山泉水",
            flow: 88.3,
            stage: 20.02,
            status: [{
                num: 1,
                state: 0,
                stateName: "关闭状态"
            }, {
                num: 2,
                state: 1,
                stateName: "正常状态"
            }]
        });

        position = Cesium.Cartesian3.fromDegrees(116.261625, 30.985559, 1172.21);
        divPoint = new DivPoint(this.viewer, position, {
            name: "南岭水厂",
            flow: 98.3,
            stage: 30.04,
            status: [{
                num: 1,
                state: 0,
                stateName: "关闭状态"
            }, {
                num: 2,
                state: 1,
                stateName: "正常状态"
            }, {
                num: 3,
                state: 2,
                stateName: "中间状态"
            }]
        });

        position = Cesium.Cartesian3.fromDegrees(116.272111, 30.98754, 938.13);
        divPoint = new DivPoint(this.viewer, position, {
            name: "三桥水厂",
            flow: 95.3,
            stage: 32.04,
            status: [{
                num: 1,
                state: 0,
                stateName: "关闭状态"
            }, {
                num: 2,
                state: 1,
                stateName: "正常状态"
            }]
        });
    },

    //设置默认视图
    setView() {
        let flyToOpts = {
            destination: {
                x: -2423889.8749900186,
                y: 4909558.020418335,
                z: 3267657.2345441836
            },
            orientation: {
                heading: 3.7426609979356034,
                pitch: -0.9521550075200276,
                roll: 6.2803081630469535
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