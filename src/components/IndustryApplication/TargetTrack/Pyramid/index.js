//目标追踪四棱锥体
export default class TargetTrackPyramid {
    constructor(viewer, originPosition, options) {
        this.viewer = viewer;
        this.originPosition = originPosition;
        this.targetPosition = this.originPosition;

        this.options = options || {};
        this.far = 0.02; //长度  
        this.near = 0.01;
        this.fov = this.options.fov || 4; //夹角 

        //外观
        this.color = this.options.color || Cesium.Color.CYAN.withAlpha(0.4);
        this.outlineColor = this.options.outlineColor || Cesium.Color.YELLOW.withAlpha(0.5);
        this.createFrusum();
    }


    //Frusum视锥体
    createFrusum() {
        this.getOrientation();
        this.createPerspectiveFrustum();
        this.addFillFrustum();
        this.addOutlineFrustum();
    }

    //视锥体
    createPerspectiveFrustum() {
        this.frustum = new Cesium.PerspectiveFrustum({
            fov: Cesium.Math.toRadians(this.fov),
            aspectRatio: 1, //长宽比例
            near: this.near,
            far: this.getFar()
        });
    }

    //更新
    updateTargetPosition(position) {
        if (!position) return;
        this.targetPosition = position;
        this.clear();
        this.createFrusum();
    }

    getFar() {
        let d = Cesium.Cartesian3.distance(this.originPosition, this.targetPosition)
        return d > 0 ? d : 0.03;
    }

    //姿态
    getOrientation() {
        let m = this.getModelMatrix(this.originPosition, this.targetPosition);
        let hpr = this.getHeadingPitchRoll(m);
        hpr.pitch = hpr.pitch + Math.PI / 2 + Math.PI;
        this.orientation = Cesium.Transforms.headingPitchRollQuaternion(this.originPosition, hpr);
        return this.orientation;
    }

    //根据原点坐标与目标坐标计算矩阵
    getModelMatrix(pointA, pointB) {
        const vector2 = Cesium.Cartesian3.subtract(pointB, pointA, new Cesium.Cartesian3());
        const normal = Cesium.Cartesian3.normalize(vector2, new Cesium.Cartesian3());
        const rotationMatrix3 = Cesium.Transforms.rotationMatrixFromPositionVelocity(pointA, normal, Cesium.Ellipsoid.WGS84);
        const modelMatrix4 = Cesium.Matrix4.fromRotationTranslation(rotationMatrix3, pointA);
        return modelMatrix4;
    }

    //根据矩阵计算方向角
    getHeadingPitchRoll(m) {
        let m1 = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Matrix4.getTranslation(m, new Cesium.Cartesian3()), Cesium.Ellipsoid.WGS84, new Cesium.Matrix4());
        // 矩阵相除
        let m3 = Cesium.Matrix4.multiply(Cesium.Matrix4.inverse(m1, new Cesium.Matrix4()), m, new Cesium.Matrix4());
        // 得到旋转矩阵
        let mat3 = Cesium.Matrix4.getMatrix3(m3, new Cesium.Matrix3());
        // 计算四元数
        let q = Cesium.Quaternion.fromRotationMatrix(mat3);
        // 计算旋转角(弧度)
        let hpr = Cesium.HeadingPitchRoll.fromQuaternion(q);
        return hpr;
    }

    //填充
    addFillFrustum() {
        this.fillFrustum = new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: new Cesium.FrustumGeometry({
                    origin: this.originPosition,
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
                    origin: this.originPosition,
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


    //清除
    clear() {
        this.viewer.scene.primitives.remove(this.fillFrustum);
        this.viewer.scene.primitives.remove(this.outlineFrustum);
    }

    //移除
    remove() {
        this.viewer.scene.primitives.remove(this.fillFrustum);
        this.viewer.scene.primitives.remove(this.outlineFrustum);
    }
}