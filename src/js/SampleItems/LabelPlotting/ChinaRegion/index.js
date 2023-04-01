//行政区划标注 
import appConfig from "@/js/appConfig"
import CesiumLabel3D from "@/components/LabelPlotting/Label3d"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.initRegion();
        this.initLabel();
        this.setView();
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
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: appConfig.imageryProvider
            })
        });

        //是否开启抗锯齿
        this.viewer.scene.fxaa = true;
        this.viewer.scene.postProcessStages.fxaa.enabled = true;
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
    },

    initRegion() {
        new Cesium.GeoJsonDataSource().load("../../static/data/chinaregion.json").then(geoJsonDataSource => {
            this.geoJsonDataSource = geoJsonDataSource;
            this.viewer.dataSources.add(geoJsonDataSource);
            //设置面的颜色  
            geoJsonDataSource.entities.values.forEach(entity => {
                entity.polygon.material = Cesium.Color.fromRandom().withAlpha(0.4);
            })
        })
    },

    initLabel() {
        fetch("../../static/data/chinalabel.json").then(res => {
            return res.json();
        }).then(res => {
            let features = res.features;
            let label3d;
            features.forEach(feature => {
                let coordinates = feature.geometry.coordinates;
                let label = feature.properties.NAME;
                let position = Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1], 0)
                label3d = new CesiumLabel3D(this.viewer, position, label);
            });

        }).catch(err => {
            console.log(err)
        })
    },

    //设置视图
    setView() {
        let flyToOpts = {
            destination: {
                x: -3689145.550576342,
                y: 9014321.046112215,
                z: 3271299.847963448
            },
            orientation: {
                heading: 6.152898109215222,
                pitch: -1.2244489846093436,
                roll: 0.0000496938359031418
            }
        };
        this.viewer.scene.camera.setView(flyToOpts);
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;