import { booleanClockwise, getClippingPlanes, getMinHeight, cartesian3ToDegreesHeight } from "../BaseUtils"
export default class TerrainExcavate {
    constructor(viewer) {
        this.viewer = viewer;
    }

    //添加开挖
    add(positions, opitons) {
        if (!opitons) opitons = {};
        this.excavateDepth = opitons.excavateDepth || 200; //开挖深度
        this.bottomImage = opitons.bottomImage || '../static/images/excavate/excavate_bottom_min.jpg'; //底部贴图
        this.sideImage = opitons.sideImage || '../static/images/excavate/excavate_side_min.jpg'; //边缘贴图

        this.clear();

        let bClockwise = booleanClockwise(positions);
        if (bClockwise) { //顺时针 需要转换点的顺序
            positions = positions.reverse();
        }

        let minHeight = getMinHeight(positions); //所有坐标中最小的高度
        let bottomHeight = minHeight - this.excavateDepth;

        let iPositions = this.interpolationPostions(positions); //获取插值点
        this.setPositionsHeight(iPositions).then(res => {
            this.addClippingPlanes(positions);
            this.addBottomPolygon(positions, bottomHeight);
            this.addSideWall(res, bottomHeight);
        });
    }

    //添加ClippingPlanes
    addClippingPlanes(positions) {
        let clippingPlanes = getClippingPlanes(positions);
        this.viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: clippingPlanes,
            edgeWidth: 1.0,
            edgeColor: Cesium.Color.WHITE
        });
    }

    //添加底部多边形 展示开挖效果
    addBottomPolygon(positions, bottomHeight) {
        this.bottomPolygon = this.viewer.entities.add({
            polygon: {
                hierarchy: positions,
                material: this.bottomImage,
                height: bottomHeight
            },
        });
    }

    //添加边缘墙体 展示开挖效果
    addSideWall(positions, bottomHeight) {
        positions.push(positions[0]); //首尾闭合
        let minimumHeights = new Array(positions.length).fill(bottomHeight);
        this.sideWall = this.viewer.entities.add({
            wall: {
                positions: positions,
                minimumHeights: minimumHeights,
                material: this.sideImage
            }
        });
    }

    //插值生成多边形坐标串 与地形贴合
    interpolationPostions(positions) {
        let fromPoint, endPoint, count; //count为插值个数 按每米0.1个点进行插值
        let segmentPositions = [];
        for (var i = 0; i < positions.length; ++i) {
            var nextIndex = (i + 1) % positions.length;
            fromPoint = positions[i];
            endPoint = positions[nextIndex];
            count = Cesium.Cartesian3.distance(fromPoint, endPoint) * 0.1;
            count = Math.floor(count);
            segmentPositions = segmentPositions.concat(this.getInterpolationValues(fromPoint, endPoint, count));
        }
        return segmentPositions;
    }

    //获取两个点之间的插值结果
    getInterpolationValues(fromPoint, endPoint, count) {
        var positions = [];
        for (var i = 0; i <= count; i++) {
            var cartesian3 = Cesium.Cartesian3.lerp(fromPoint, endPoint, i / count, new Cesium.Cartesian3());
            positions.push(cartesian3);
        }
        return positions;
    }

    //设置插值点的高度 使其与地形契合
    setPositionsHeight(positions) {
        return new Promise((resolve, reject) => {
            let degreesArarryHeights = [];
            //转为经纬度
            positions.map(p => {
                degreesArarryHeights.push(cartesian3ToDegreesHeight(p))
            });
            //经测试 使用clampToHeightMostDetailed获取的高度信息不准确 此处采用getHeight 速度比较慢 满足小范围开挖需求
            positions.map((p, i) => {
                const h = this.viewer.scene.globe.getHeight(Cesium.Cartographic.fromCartesian(p))
                if (h) {
                    degreesArarryHeights[i][2] = h; //更新高度
                }
            });
            let tempPositions = [];
            degreesArarryHeights.forEach(d => {
                tempPositions.push(Cesium.Cartesian3.fromDegrees(d[0], d[1], d[2]))
            });
            resolve(tempPositions);
        })
    }

    //清空
    clear() {
        this.viewer.scene.globe.clippingPlanes = undefined;
        this.viewer.entities.remove(this.bottomPolygon);
        this.viewer.entities.remove(this.sideWall);
    }
};