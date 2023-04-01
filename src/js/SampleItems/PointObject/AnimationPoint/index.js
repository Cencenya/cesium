//   
import BaseAnimateWall from "@/components/SpecialEffects/Wall/BaseAnimate"
import AnimatePoint from "@/components/PointObject/AnimatePoint";

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.setView();
        this.addRegion();
        this.addPoints();
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
            imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
            })
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
    },

    addPoints() {
        let p = Cesium.Cartesian3.fromDegrees(118.76863731647465, 32.03512097607778, 0)
        let point = new AnimatePoint(this.viewer, p, "red");

        p = Cesium.Cartesian3.fromDegrees(118.76817494128984, 32.02447122547427, 0)
        point = new AnimatePoint(this.viewer, p, "yellow");

        p = Cesium.Cartesian3.fromDegrees(118.7783698438655, 32.02845897724873, 0)
        point = new AnimatePoint(this.viewer, p, "#00FFFF");

        p = Cesium.Cartesian3.fromDegrees(118.77537994415184, 32.026152656792725, 0)
        point = new AnimatePoint(this.viewer, p, "#FF4500");

        p = Cesium.Cartesian3.fromDegrees(118.77157318440851, 32.03289317935821, 0)
        point = new AnimatePoint(this.viewer, p, "#00FF7F");


        p = Cesium.Cartesian3.fromDegrees(118.74890759423654, 32.03109579387391, 0)
        point = new AnimatePoint(this.viewer, p, "yellow");

        p = Cesium.Cartesian3.fromDegrees(118.74516535605585, 32.02297946549816, 0)
        point = new AnimatePoint(this.viewer, p, "#00FFFF");

        p = Cesium.Cartesian3.fromDegrees(118.73336093648511, 32.02161115341518, 0)
        point = new AnimatePoint(this.viewer, p, "#FF4500");

        p = Cesium.Cartesian3.fromDegrees(118.73117914409475, 32.01350821591852, 0)
        point = new AnimatePoint(this.viewer, p, "#00FF7F");


        p = Cesium.Cartesian3.fromDegrees(118.78266510838394, 32.01831322479276, 0)
        point = new AnimatePoint(this.viewer, p, "yellow");

        p = Cesium.Cartesian3.fromDegrees(118.79353366300343, 32.023114467024165, 0)
        point = new AnimatePoint(this.viewer, p, "#00FFFF");

        p = Cesium.Cartesian3.fromDegrees(118.78674179849942, 32.03585783780932, 0)
        point = new AnimatePoint(this.viewer, p, "#FF4500");

        p = Cesium.Cartesian3.fromDegrees(118.77835389975753, 32.03802694033225, 0)
        point = new AnimatePoint(this.viewer, p, "#00FF7F");


        p = Cesium.Cartesian3.fromDegrees(118.80180818469674, 32.03760642445973, 0)
        point = new AnimatePoint(this.viewer, p, "yellow");

        p = Cesium.Cartesian3.fromDegrees(118.81364240159637, 32.030921407616816, 0)
        point = new AnimatePoint(this.viewer, p, "#00FFFF");

        p = Cesium.Cartesian3.fromDegrees(118.81102034053832, 32.024024544610924, 0)
        point = new AnimatePoint(this.viewer, p, "#FF4500");

        p = Cesium.Cartesian3.fromDegrees(118.80179202106636, 32.01780203241805, 0)
        point = new AnimatePoint(this.viewer, p, "#00FF7F");


        p = Cesium.Cartesian3.fromDegrees(118.7559465612049, 32.005536508638755, 0)
        point = new AnimatePoint(this.viewer, p, "yellow");

        p = Cesium.Cartesian3.fromDegrees(118.7708646422748, 32.0017003568487, 0)
        point = new AnimatePoint(this.viewer, p, "#00FFFF");

        p = Cesium.Cartesian3.fromDegrees(118.76245708549108, 31.99956230965992, 0)
        point = new AnimatePoint(this.viewer, p, "#FF4500");

        p = Cesium.Cartesian3.fromDegrees(118.79996374814571, 32.00261248185542, 0)
        point = new AnimatePoint(this.viewer, p, "#00FF7F");

        p = Cesium.Cartesian3.fromDegrees(118.80085407482976, 32.0095036050158, 0)
        point = new AnimatePoint(this.viewer, p, "#FF4500");
    },


    addRegion() {
        fetch("../../../static/data/nanjing.json")
            .then(res => {
                return res.json();
            })
            .then(res => {
                res.features.map(feature => {
                    let coordinates = feature.geometry.coordinates[0];
                    let ps = this.coordinateToPositions(coordinates);
                    let regionWall = new BaseAnimateWall(
                        this.viewer,
                        ps,
                        800,
                        Cesium.Color.MEDIUMBLUE,
                        1000
                    );
                })
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

    //设置默认视图
    setView() {
        let flyToOpts = {
            destination: {
                x: -2612268.519915958,
                y: 4754544.512538789,
                z: 3361850.637509779
            },
            orientation: {
                heading: 6.148772085654742,
                pitch: -0.8711563955617541,
                roll: 6.282556257303222
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