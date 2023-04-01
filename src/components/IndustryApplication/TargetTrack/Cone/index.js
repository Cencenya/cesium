//目标追踪圆锥体
export default class TargetTrackCone {
    constructor(viewer, originPosition, options) {
        this.viewer = viewer;
        this.originPosition = originPosition;
        this.targetPosition = this.originPosition;
        this.options = options || {};
        this.bottomRadius = this.options.bottomRadius || 18000;
        this.color = this.options.color || Cesium.Color.RED.withAlpha(0.5);
        this.addCone();
    }

    //更新目标点位置
    updateTargetPosition(position) {
        this.targetPosition = position;
    }

    //添加圆锥体
    addCone() {
        this.cone = this.viewer.entities.add({
            orientation: new Cesium.CallbackProperty(e => {
                let m = this.getModelMatrix(this.originPosition, this.targetPosition);
                let hpr = this.getHeadingPitchRoll(m);
                hpr.pitch = hpr.pitch + Math.PI / 2 + Math.PI;
                return Cesium.Transforms.headingPitchRollQuaternion(this.originPosition, hpr);
            }, false),
            position: new Cesium.CallbackProperty(e => {
                return Cesium.Cartesian3.midpoint(this.originPosition, this.targetPosition, new Cesium.Cartesian3())
            }, false),
            cylinder: {
                length: new Cesium.CallbackProperty(e => {
                    return Cesium.Cartesian3.distance(this.originPosition, this.targetPosition)
                }, false),
                topRadius: this.bottomRadius, //根据需要设置
                bottomRadius: 0.0,
                material: this.color,
            },
        });
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

    //移除
    remove() {
        this.viewer.entities.remove(this.cone);
        this.cone = undefined;
    }
}