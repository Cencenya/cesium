//author:https://blog.csdn.net/xietao20/article/details/108457857
import { booleanClockwise, getClippingPlanes } from "../BaseUtils"
export default class StratumExcavate {
    constructor(viewer) {
        this.viewer = viewer;
    }

    //添加 
    add(positions, opitons) {
        if (!opitons) opitons = {};
        this.excavateDepth = opitons.excavateDepth || 200; //开挖深度
        this.bottomImage = opitons.bottomImage || '../static/images/excavate/excavate_bottom_min.jpg'; //底部贴图
        this.sideImage = opitons.sideImage || '../static/images/excavate/excavate_kuangqu.jpg'; //边缘贴图

        this.clear();

        let bClockwise = booleanClockwise(positions);
        if (bClockwise) { //顺时针 需要转换点的顺序
            positions = positions.reverse();
        }

        let clippingPlanes = getClippingPlanes(positions);
        this.viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: clippingPlanes,
            edgeWidth: 1.0,
            edgeColor: Cesium.Color.WHITE
        });
        this.addBottomPolygon(positions);
        this.addSideWall(positions);
    }

    //添加底部多边形 展示开挖效果
    addBottomPolygon(positions) {
        this.bottomPolygon = this.viewer.entities.add({
            polygon: {
                hierarchy: positions,
                material: this.bottomImage,
                height: -this.excavateDepth
            },
        });
    }

    //添加边缘墙体 展示开挖效果
    addSideWall(positions) {
        positions.push(positions[0]); //首尾闭合
        let minimumHeights = new Array(positions.length).fill(-this.excavateDepth);
        this.sideWall = this.viewer.entities.add({
            wall: {
                positions: positions,
                minimumHeights: minimumHeights,
                material: this.sideImage
            }
        });
    }

    //清空
    clear() {
        this.viewer.scene.globe.clippingPlanes = undefined;
        this.viewer.entities.remove(this.bottomPolygon);
        this.viewer.entities.remove(this.sideWall);
    }
};