//雷达四棱锥
export default class SatellitePyramid {
    constructor(viewer, coordinates, options) {
        this.viewer = viewer;
        this.position = Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1], coordinates[2]); //位置
        options = options || {};
        this.coordinates = coordinates[2];
        this.far = options.far || coordinates[2] * 1.5;

        this.near = 0.01;
        this.angle1 = options.angle1 || 20; //夹角 1
        this.angle2 = options.angle2 || 20; //夹角 2 
        //姿态
        this.heading = options.heading || 0;
        this.pitch = options.pitch || -180; //默认从上往下俯视
        this.roll = options.roll || 0;
        //外观
        this.color = options.color || Cesium.Color.CYAN.withAlpha(0.4);
        this.outlineColor = options.outlineColor || Cesium.Color.YELLOW.withAlpha(0.5);
        this.addSatellite();
        this.createFrusum();
    }

    //Frusum视锥体
    createFrusum() {
        this.createPerspectiveFrustum();
        this.createOrientation(); //姿态
        this.addFillFrustum();
        this.addOutlineFrustum();
    }

    //视锥体
    createPerspectiveFrustum() {
        const f1 = Cesium.Math.toRadians(this.angle1);
        const f2 = Cesium.Math.toRadians(this.angle2);
        let fov = f1;
        let aspectRatio = f1 / f2;
        if (aspectRatio < 1) {
            fov = f2;
        }
        this.frustum = new Cesium.PerspectiveFrustum({
            fov: fov,
            aspectRatio: aspectRatio,
            near: this.near,
            far: this.far
        });
    }

    //获取参数
    getOptions() {
        return {
            far: this.far, //长度 默认取高度
            near: this.near,
            angle1: this.angle1, //夹角1
            angle2: this.angle2, //夹角2
            //姿态
            heading: this.heading,
            pitch: this.pitch, //默认从上往下
            roll: this.roll
        }
    }

    //更新参数
    updateOptions(options) {
        this.far = options.far; //长度 默认取高度
        this.near = 0.01;
        this.angle1 = options.angle1 || 20; //夹角1
        this.angle2 = options.angle2 || 20; //夹角2
        //姿态
        this.heading = options.heading || 0;
        this.pitch = options.pitch || -180; //默认从上往下
        this.roll = options.roll || 0;
        //更新时删除重新创建
        this.clear();
        this.createFrusum();
        this.gltfEntity.orientation = this.orientation;
    }

    //姿态
    createOrientation() {
        let headingPitchRoll = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(this.heading), Cesium.Math.toRadians(this.pitch), Cesium.Math.toRadians(this.roll));
        this.orientation = Cesium.Transforms.headingPitchRollQuaternion(this.position, headingPitchRoll);
    }

    //填充
    addFillFrustum() {
        this.fillFrustum = new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: new Cesium.FrustumGeometry({
                    origin: this.position,
                    orientation: this.orientation,
                    frustum: this.frustum,
                }),
            }),
            appearance: new Cesium.MaterialAppearance({
                material: Cesium.Material.fromType('Color'),
            }),
            asynchronous: !1,
            show: true
        });
        this.fillFrustum.appearance.material.uniforms.color = this.color;
        this.viewer.scene.primitives.add(this.fillFrustum)
    }

    //边线
    addOutlineFrustum() {
        this.outlineFrustum = new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: new Cesium.FrustumOutlineGeometry({
                    origin: this.position,
                    orientation: this.orientation,
                    frustum: this.frustum,
                    _drawNearPlane: !0
                }),
                attributes: {
                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(this.outlineColor)
                }
            }),
            appearance: new Cesium.PerInstanceColorAppearance({
                translucent: true,
                flat: !0
            }),
            asynchronous: !1,
            show: true
        });
        this.viewer.scene.primitives.add(this.outlineFrustum)
    }

    //  创建卫星
    addSatellite() {
        this.gltfEntity = this.viewer.entities.add({
            position: this.position,
            orientation: this.orientation,
            model: {
                uri: "../../static/gltf/weixin.gltf",
                colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
                color: Cesium.Color.WHITE, //.withAlpha(0.5),
                scale: 60,
                maximumScale: 200
            }
        });
    }

    //清除
    clear() {
        this.viewer.scene.primitives.remove(this.fillFrustum);
        this.viewer.scene.primitives.remove(this.outlineFrustum);
    }

    //移除
    remove() {
        this.billboards.removeAll();
        this.viewer.entities.remove(this.gltfEntity);
        this.viewer.scene.primitives.remove(this.fillFrustum);
        this.viewer.scene.primitives.remove(this.outlineFrustum);
    }
}