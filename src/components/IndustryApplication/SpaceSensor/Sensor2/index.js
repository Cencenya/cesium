export default class Sensor2 {
    constructor(viewer, options) {
        this.viewer = viewer;
        this.position = options.position;
        this.radii = options.radii || new Cesium.Cartesian3(200, 200, 200);
        this.color = options.color || Cesium.Color.YELLOW.withAlpha(0.5);

        this.addEllipsoid();
        this.showFan();
    }

    //添加椭球
    addEllipsoid() {
        this.ellipsoid = this.viewer.entities.add({
            position: this.position,
            ellipsoid: {
                radii: this.radii,
                maximumCone: Cesium.Math.toRadians(90),
                material: this.color,
                subdivisions: 128,
                stackPartitions: 32,
                slicePartitions: 32,
                outline: true,
                outlineColor: this.color.withAlpha(1)
            },
        });
    }

    //显示旋转扇叶
    showFan() {
        this.addFan1();
        this.addFan2();
        this.addFan3();
    }

    //添加扇叶1
    addFan1() {
        let heading = 0;
        let headingPitchRoll = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading), 0, 0);
        this.fan1 = this.viewer.entities.add({
            position: this.position,
            orientation: new Cesium.CallbackProperty(e => {
                heading += 0.8;
                heading > 360 && (heading = 0);
                headingPitchRoll.heading = Cesium.Math.toRadians(heading);
                return Cesium.Transforms.headingPitchRollQuaternion(this.position, headingPitchRoll);
            }, false),
            ellipsoid: {
                radii: this.radii,
                innerRadii: new Cesium.Cartesian3(0.001, 0.001, 0.001),
                minimumClock: Cesium.Math.toRadians(-0.001),
                maximumClock: Cesium.Math.toRadians(0.001),
                minimumCone: Cesium.Math.toRadians(75.0),
                maximumCone: Cesium.Math.toRadians(90.0),
                material: this.color.withAlpha(0.6),
                outline: false,
            }
        });
    }

    //添加扇叶2
    addFan2() {
        let heading = 120;
        let headingPitchRoll = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading), 0, 0);
        this.fan2 = this.viewer.entities.add({
            position: this.position,
            orientation: new Cesium.CallbackProperty(e => {
                heading += 0.8;
                heading > 360 && (heading = 0);
                headingPitchRoll.heading = Cesium.Math.toRadians(heading);
                return Cesium.Transforms.headingPitchRollQuaternion(this.position, headingPitchRoll);
            }, false),
            ellipsoid: {
                radii: this.radii,
                innerRadii: new Cesium.Cartesian3(0.001, 0.001, 0.001),
                minimumClock: Cesium.Math.toRadians(-0.001),
                maximumClock: Cesium.Math.toRadians(0.001),
                minimumCone: Cesium.Math.toRadians(75.0),
                maximumCone: Cesium.Math.toRadians(90.0),
                material: this.color.withAlpha(0.6),
                outline: false,
            }
        });
    }

    //添加扇叶3
    addFan3() {
        let heading = 240;
        let headingPitchRoll = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(heading), 0, 0);
        this.fan3 = this.viewer.entities.add({
            position: this.position,
            orientation: new Cesium.CallbackProperty(e => {
                heading += 0.8;
                heading > 360 && (heading = 0);
                headingPitchRoll.heading = Cesium.Math.toRadians(heading);
                return Cesium.Transforms.headingPitchRollQuaternion(this.position, headingPitchRoll);
            }, false),
            ellipsoid: {
                radii: this.radii,
                innerRadii: new Cesium.Cartesian3(0.001, 0.001, 0.001),
                minimumClock: Cesium.Math.toRadians(-0.001),
                maximumClock: Cesium.Math.toRadians(0.001),
                minimumCone: Cesium.Math.toRadians(75.0),
                maximumCone: Cesium.Math.toRadians(90.0),
                material: this.color.withAlpha(0.6),
                outline: false,
            }
        });
    }

    //关闭扫描
    closeScan() {
        this.viewer.entities.remove(this.fan1);
        this.viewer.entities.remove(this.fan2);
        this.viewer.entities.remove(this.fan3);
    }
}