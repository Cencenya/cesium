// 宏观数字地球  
import appConfig from "@/js/appConfig"
import { gradientColor } from "@/utils/colorUtils";
import TransparentLabel3d from "@/components/LabelPlotting/TransparentLabel3d";

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.setView();
        this.addRegion();
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
            orderIndependentTranslucency: false,
            contextOptions: {
                webgl: {
                    alpha: true
                }
            }
        });
        this.viewer.scene.skyBox.show = false;
        this.viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0);

        this.viewer.imageryLayers.removeAll(true);

        this.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 15000000;
        this.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 24000000;
        this.viewer._cesiumWidget._creditContainer.style.display = "none";


        let baseColor = Cesium.Color.fromCssColorString("#183758");
        this.viewer.scene.globe.baseColor = baseColor.withAlpha(0.2);
        this.viewer.entities.add({
            rectangle: {
                coordinates: Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0),
                material: baseColor
            }
        });
    },

    //行政区划
    addRegion() {
        fetch("../../static/data/world_region/countries_geo.json")
            .then(res => {
                return res.json();
            })
            .then(res => {
                //色阶
                let colors = gradientColor(
                    "#C4CCDC",
                    "#495362",
                    res.features.length
                ).reverse();

                let features = res.features;
                let feature;
                let coordinates;
                let degreesArrary;
                for (let i = 0; i < features.length; i++) {
                    feature = features[i];
                    coordinates = this.getPolygonCoordinates(feature.geometry);
                    degreesArrary = this.coordinatesToDegreeArrayHeights(
                        coordinates
                    );

                    this.viewer.entities.add({
                        polygon: {
                            hierarchy: Cesium.Cartesian3.fromDegreesArray(degreesArrary),
                            material: Cesium.Color.fromCssColorString(colors[i]),
                            perPositionHeight: true,
                            extrudedHeight: 100000,
                            outline: true,
                            outlineColor: Cesium.Color.fromCssColorString("#A65734")
                        }
                    });
                }

                this.addLabel();
            });
    },

    // 标注
    addLabel() {
        fetch("../../static/data/world_region/capitals.json")
            .then(res => {
                return res.json();
            })
            .then(res => {
                let features = res.features;
                let label3d;
                features.forEach(feature => {
                    let coordinates = feature.geometry.coordinates;
                    let label = feature.properties.Country;
                    let position = Cesium.Cartesian3.fromDegrees(
                        coordinates[0],
                        coordinates[1],
                        100000
                    );
                    label3d = new TransparentLabel3d(this.viewer, position, label);
                    this.viewer.entities.add({
                        position: position,
                        point: {
                            pixelSize: 2,
                            color: Cesium.Color.RED.withAlpha(0),
                            outlineColor: Cesium.Color.fromCssColorString("#FFFF9D"),
                            outlineWidth: 2,
                            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                                15000000,
                                23000000
                            )
                        }
                    });
                });
            })
            .catch(err => {
                console.log(err);
            });

    },

    getPolygonCoordinates(geometry) {
        if (geometry.type == "Polygon") {
            return geometry.coordinates[0];
        } else if (geometry.type == "MultiPolygon") {
            return geometry.coordinates[0][0];
        }
    },

    coordinatesToDegreeArrayHeights(coordinates) {
        let ar = [];
        coordinates.map(item => {
            ar.push(item[0], item[1]);
        });
        return ar;
    },

    //设置默认视图
    setView() {
        let flyToOpts = {
            destination: {
                x: -8582505.552330904,
                y: 21080178.327421978,
                z: 12830415.575736674
            },
            orientation: {
                heading: 6.149341058349494,
                pitch: -1.5401786234610086,
                roll: 0
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