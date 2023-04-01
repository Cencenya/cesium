//author:https://blog.csdn.net/xietao20/article/details/108457857
import * as turf from "@turf/turf"

//判断笛卡尔坐标串是否为顺时针
export function booleanClockwise(positions) {
    let degreesArrary = [];
    positions.map(position => {
        degreesArrary.push(cartesian3ToDegrees(position));
    });
    //首尾闭合
    degreesArrary.push(degreesArrary[0]);
    let lineString = turf.lineString(degreesArrary);
    return turf.booleanClockwise(lineString)
}

//笛卡尔坐标转为经纬度
export function cartesian3ToDegrees(position) {
    let c = Cesium.Cartographic.fromCartesian(position);
    return [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude)];
}

//根据坐标串获取ClippingPlanes 传入的坐标必须为逆时针顺序
export function getClippingPlanes(positions) {
    let pLength = positions.length;
    let clippingPlanes = []; // 存储ClippingPlane集合
    for (let i = 0; i < pLength; ++i) {
        let nextIndex = (i + 1) % pLength;
        let midpoint = Cesium.Cartesian3.add(positions[i], positions[nextIndex], new Cesium.Cartesian3());
        midpoint = Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint);

        let up = Cesium.Cartesian3.normalize(midpoint, new Cesium.Cartesian3());
        let right = Cesium.Cartesian3.subtract(positions[nextIndex], midpoint, new Cesium.Cartesian3());
        right = Cesium.Cartesian3.normalize(right, right);

        let normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3());
        normal = Cesium.Cartesian3.normalize(normal, normal);

        let originCenteredPlane = new Cesium.Plane(normal, 0.0);
        let distance = Cesium.Plane.getPointDistance(originCenteredPlane, midpoint);
        clippingPlanes.push(new Cesium.ClippingPlane(normal, distance));
    }
    return clippingPlanes;
}

//获取所有点中的最低高度
export function getMinHeight(positions) {
    let minHeight = 1000000;
    let degreesHeight;
    positions.map(position => {
        degreesHeight = cartesian3ToDegreesHeight(position);
        if (minHeight > degreesHeight[2]) {
            minHeight = degreesHeight[2];
        }
    });
    return minHeight;
}

//笛卡尔坐标转为经纬度
export function cartesian3ToDegreesHeight(position) {
    let c = Cesium.Cartographic.fromCartesian(position);
    return [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude), c.height];
}