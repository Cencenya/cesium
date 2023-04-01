import { getPositionHeight, cartesian3sToLonLats, cartesian3ToLonLat } from "../../PlotBase/PlotBaseUtils"
import * as turf from "@turf/turf"

//目标是否与多边体相交 圆柱也是多边体
export function targetPolyhedronIsIntersect(tPosition, polyhedronPs, extrudedHeight) {
    let tDegrees = cartesian3ToLonLat(tPosition); //目标点的经纬度表示
    let tHeight = getPositionHeight(tPosition);

    let tFeature = turf.point(tDegrees);
    let polyhedronDegrees = cartesian3sToLonLats(polyhedronPs); //多边体经纬度表示
    polyhedronDegrees.push(polyhedronDegrees[0]);
    let polyhedronFeature = turf.polygon([
        polyhedronDegrees
    ]);
    let isIntersect = turf.booleanContains(polyhedronFeature, tFeature);
    if (!isIntersect) return false; //水面方向上没有相交关系
    let polyhedronMinHeight = getPositionHeight(polyhedronPs[0]); //多边体的底部高度
    let polyhedronMaxHeight = polyhedronMinHeight + extrudedHeight; //多边体的顶部高度

    if (tHeight > polyhedronMinHeight && tHeight < polyhedronMaxHeight) {
        return true;
    }
    return false;
}