//  目标追踪
import appConfig from "@/js/appConfig"
import TargetTrackCone from "@/components/IndustryApplication/TargetTrack/Cone"
import TargetTrackPyramid from "@/components/IndustryApplication/TargetTrack/Pyramid"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();
        this.setView();
        this.initTargets();
        this.initTargetTrack();
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
            imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
            })
        });
    },

    //目标跟踪
    initTargetTrack() {
        let poosition = Cesium.Cartesian3.fromDegrees(108.95941592717222, 34.21977344596726, 78.60459025092618);
        this.TargetTrackPyramid = new TargetTrackPyramid(this.viewer, poosition, {
            fov: 2
        });
        this.targetTrackCone = new TargetTrackCone(this.viewer, poosition, {
            bottomRadius: 3
        });
        this.addTickEvent();
    },

    //动态获取目标点位置
    addTickEvent() {
        this.viewer.clock.onTick.addEventListener(e => {
            const targetPosition1 = this.carTargetEntity.position.getValue(
                this.viewer.clock.currentTime
            );
            this.targetTrackCone.updateTargetPosition(targetPosition1);

            const targetPosition2 = this.airTargetEntity.position.getValue(
                this.viewer.clock.currentTime
            );
            this.TargetTrackPyramid.updateTargetPosition(targetPosition2);
        }, this);
    },

    //初始化追踪目标
    initTargets() {
        let start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
        let stop = Cesium.JulianDate.addSeconds(
            start,
            200,
            new Cesium.JulianDate()
        );
        this.viewer.clock.startTime = start.clone();
        this.viewer.clock.stopTime = stop.clone();
        this.viewer.clock.currentTime = start.clone();
        this.viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
        this.viewer.clock.multiplier = 10;
        this.initTarget1(start);
        this.initTarget2(start);
    },

    //目标1
    initTarget1(start) {
        let degreesArraysHeight = [
            108.95802800353522, 34.22102938991949, 15.205872105897702, 108.96052078510712, 34.221065567293266, 15.766560096372404, 108.9604926551071, 34.21971318910813, 15.03973254494275
        ]
        let position = this.computeCirclularFlight(Cesium.Cartesian3.fromDegreesArrayHeights(degreesArraysHeight), start);
        this.carTargetEntity = this.viewer.entities.add({
            position: position,
            orientation: new Cesium.VelocityOrientationProperty(position),
            model: {
                uri: "../../static/gltf/redCar.glb",
                scale: 0.1
            },
        });
    },

    //目标2
    initTarget2(start) {
        let degreesArraysHeight = [
            108.96047220948915, 34.22102625255296, 15.697392585763481, 108.95845400936531, 34.2210191586923, 15.381186772288858, 108.95848764924611, 34.219374115389186, 15.435960620239383
        ]
        let position = this.computeCirclularFlight(Cesium.Cartesian3.fromDegreesArrayHeights(degreesArraysHeight), start);
        this.airTargetEntity = this.viewer.entities.add({
            position: position,
            orientation: new Cesium.VelocityOrientationProperty(position),
            model: {
                uri: "../../static/glb/Cesium_Air.glb",
                scale: 1
            },
        });
    },

    //计算运行动画路线 参考cesium官网实例 https://sandcastle.cesium.com/?src=Interpolation.html
    computeCirclularFlight(positions, start) {
        let property = new Cesium.SampledPositionProperty();
        for (let i = 0; i < positions.length; i++) {
            let time = Cesium.JulianDate.addSeconds(
                start,
                i * 100,
                new Cesium.JulianDate()
            );
            let position = positions[i];
            property.addSample(time, position);
        }
        return property;
    },

    //设置视角
    setView() {
        let flyToOpts = {
            destination: {
                x: -1715518.7336220464,
                y: 4993325.360884622,
                z: 3566709.0104372143
            },
            orientation: {
                heading: 5.470211483100901,
                pitch: -0.7942261506156325,
                roll: 6.279945169559342
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