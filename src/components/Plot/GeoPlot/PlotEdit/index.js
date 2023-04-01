// 几何标绘编辑类 支持 点 线面 矩形 圆形 动态围栏 静态围栏 墙体 等编辑
import * as turf from "@turf/turf"
import PlotTypes from "../PlotTypes"
import { cartesian3ToPoint3D, midPosition } from "../../PlotBase/PlotBaseUtils"

export default class GeoPlotEditor {
    constructor(viewer, geoPlotLayer) {
        this.viewer = viewer;
        this.geoPlotLayer = geoPlotLayer; //只能从指定的图层中获取编辑对象 如果拾取的对象不在该图层 不进行编辑 这样不用处理绘制和编辑器的关系
        this.initEventHandler();
    }

    //鼠标事件
    initEventHandler() {
        this.eventHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    }

    //激活编辑
    activate() {
        this.deactivate();
        //鼠标左键点击事件 鼠标左键点击拾取需要编辑的对象
        this.initLeftClickEventHandler();
    }

    //禁用编辑
    deactivate() {
        this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.unRegisterEvents();
        this.clear();
    }

    //清空编辑节点
    clear() {
        if (this.editGeoPlot) {
            this.editGeoPlot.openEditMode(true);
        }

        this.clearEditVertex();
        this.clearMidVertex();
    }

    //左键点击事件
    initLeftClickEventHandler() {
        this.eventHandler.setInputAction(e => {
            let id = this.viewer.scene.pick(e.position);
            if (!id) {
                this.handleEditGeoPlot();
                return; // 没有拾取到对象 直接返回 不做任何操作
            }

            // 拾取到对象 判断拾取到的对象类型
            if (!id.id || id.id.plotType != "GeoPlot") {
                this.clear();
                return
            };
            //重复点击同一个对象
            if (this.editGeoPlot && this.editGeoPlot.plotCode == id.id.plotCode) return;
            //拾取到新的GeoPlot对象
            this.handleEditGeoPlot(); //处理上一个编辑对象
            this.handlePickGeoPlot(id.id);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    //处理编辑对象
    handleEditGeoPlot() {
        this.clear();
        let editGeoPlot = this.editGeoPlot;
        this.editGeoPlot = undefined;
        if (!this.isEdited) return; //没有任何编辑 直接返回 

        //触发编辑事件 editGeoPlot 
        this.isEdited = false;
        this.isEditing = false;
    }

    //处理拾取到的对象
    handlePickGeoPlot(pickId) {
        this.editGeoPlot = this.geoPlotLayer.getByPlotCode(pickId.plotCode);
        if (!this.editGeoPlot) return; //图层里面没有该对象 说明是在绘制的时候触发该事件
        this.isEditing = false;
        this.isEdited = false;
        this.editGeoPlot.openEditMode(true);

        this.editPositions = this.editGeoPlot.getPositions();
        this.EditMoveCenterPositoin = this.getGeoPlotCenterPosition();

        this.clear();
        this.createEditVertex();
        this.createMidVertex();
        this.registerEvents();
    }

    //注册事件监听
    registerEvents() {
        //鼠标左键按下事件 当有对象被选中时 如果拾取到编辑辅助要素 表示开始改变对象的位置
        this.initLeftDownEventHandler();
        //鼠标移动事件 鼠标移动 如果有编辑对象 表示改变编辑对象的位置
        this.initMouseMoveEventHandler();
        //鼠标左键抬起事件 当有编辑对象时  
        this.initLeftUpEventHandler();
    }

    //取消事件监听
    unRegisterEvents() {
        this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
        this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
        this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        // this.eventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    //场景鼠标左键按下事件
    initLeftDownEventHandler() {
        this.eventHandler.setInputAction((e) => {
            let id = this.viewer.scene.pick(e.position);
            if (!id) {
                return;
            }
            // 拾取到对象 判断拾取到的对象类型 
            if (!id.id || !id.id.type) return;
            //拾取到具有type 属性的entity对象  
            if (id.id.type == "GeoPlotEditVertex" || id.id.type == "GeoPlotEditMove") {
                this.isEditing = true;
                this.viewer.scene.screenSpaceCameraController.enableRotate = false; //禁用场景的旋转移动功能 保留缩放功能
                //改变鼠标状态
                this.viewer.enableCursorStyle = false;
                this.viewer._element.style.cursor = '';
                document.body.style.cursor = "move";
                this.editVertext = id.id;
                this.editVertext.show = false;
                // this.getGeoPlotCenterPosition();
                this.clearMidVertex();
            } else if (id.id.type == "GeoPlotEditMidVertex") { //点击了中点 马上新建一个点到线上
                this.editPositions.splice(id.id.vertexIndex, 0, id.id.position._value);
                this.editGeoPlot.setPositions(this.editPositions);
                //清除所有节点
                this.clear();
                this.createEditVertex();
                this.createMidVertex();
                this.isEdited = true;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    }

    //场景鼠标左键抬起事件
    initLeftUpEventHandler() {
        this.eventHandler.setInputAction(((e) => {
            if (!this.isEditing) return;
            this.viewer.enableCursorStyle = true;
            document.body.style.cursor = "default";
            this.viewer.scene.screenSpaceCameraController.enableRotate = true;
            this.editVertext.show = true;
            this.isEditing = false;
            this.clearMidVertex();
            this.createMidVertex();
            if (this.editGeoPlot.PlotType == "FencePlot") {
                this.editGeoPlot.initHeights();
            }
        }), Cesium.ScreenSpaceEventType.LEFT_UP);
    }

    //场景鼠标移动事件
    initMouseMoveEventHandler() {
        this.eventHandler.setInputAction(((e) => {
            //先拾取位置 如果没有拾取到 直接返回  因为场景拾取位置有时会发生错误 拾取不到位置
            let pickPosition = this.viewer.scene.pickPosition(e.endPosition);
            if (!pickPosition) return;
            //判断是否有正在移动的对象  
            if (!this.isEditing) return;
            // 判断是整体平移还是节点平移
            if (this.editVertext.type == "GeoPlotEditMove") {
                let startPosition = this.EditMoveCenterPositoin;
                if (!startPosition) return;
                this.moveEntityByOffset(startPosition, pickPosition);
            } else {
                this.editPositions[this.editVertext.vertexIndex] = pickPosition;
                this.editGeoPlot.setPositions(this.editPositions);
            }
            this.isEdited = true;
            this.EditMoveCenterPositoin = this.getGeoPlotCenterPosition();
        }), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    //获取编辑对象的中心点
    getGeoPlotCenterPosition() {
        let points = [];
        let maxHeight = 0;
        //如果是圆 或者点 返回第一个点作为移动点
        switch (this.editGeoPlot.properties.plotType) {
            case PlotTypes.CIRCLE:
            case PlotTypes.MARKER:
            case PlotTypes.TEXT:
                return this.editPositions[0];
        }

        //获取所有节点的最高位置
        this.editPositions.forEach(position => {
            const point3d = cartesian3ToPoint3D(position);
            points.push([point3d.x, point3d.y]);
            if (maxHeight < point3d.z) maxHeight = point3d.z;
        })

        //构建turf.js  lineString 
        let geo = turf.lineString(points);
        let bbox = turf.bbox(geo);
        let bboxPolygon = turf.bboxPolygon(bbox);
        let pointOnFeature = turf.center(bboxPolygon);
        let lonLat = pointOnFeature.geometry.coordinates;
        return Cesium.Cartesian3.fromDegrees(lonLat[0], lonLat[1], maxHeight);
    }

    //根据偏移量移动实体
    moveEntityByOffset(startPosition, endPosition) {
        let startPoint3d = cartesian3ToPoint3D(startPosition);
        let endPoint3d = cartesian3ToPoint3D(endPosition);
        let offsetX = endPoint3d.x - startPoint3d.x;
        let offsetY = endPoint3d.y - startPoint3d.y;
        let offsetZ = endPoint3d.z - startPoint3d.z;
        let plotType = this.editGeoPlot.properties.plotType;

        //设置偏移量
        let element;
        for (let i = 0; i < this.editPositions.length; i++) {
            element = cartesian3ToPoint3D(this.editPositions[i]);
            element.x += offsetX;
            element.y += offsetY;
            //圆和矩形平移时更新高度
            if (plotType == PlotTypes.CIRCLE || plotType == PlotTypes.RECTANGLE) {
                element.z += offsetZ
            }
            this.editPositions[i] = Cesium.Cartesian3.fromDegrees(element.x, element.y, element.z)
        }
        this.editGeoPlot.setPositions(this.editPositions);
    }

    //创建编辑节点对象
    createEditVertex() {
        this.vertexEntities = [];
        let positions = this.editGeoPlot.getPositions();

        // //对圆进行特殊处理
        if (this.editGeoPlot.properties.plotType == PlotTypes.CIRCLE) {
            this.createCircleEditVertex();
            this.createEditMoveCenterEntity();
            return;
        }
        positions.forEach((p, index) => {
            const entity = this.viewer.entities.add({
                position: new Cesium.CallbackProperty(e => {
                    return this.editPositions[index];
                }, false),
                type: "GeoPlotEditVertex",
                vertexIndex: index, //节点索引 
                point: {
                    color: Cesium.Color.DARKBLUE.withAlpha(0.4),
                    pixelSize: 10,
                    outlineColor: Cesium.Color.YELLOW.withAlpha(0.4),
                    outlineWidth: 3,
                    disableDepthTestDistance: 2000,
                },
            })
            this.vertexEntities.push(entity);
        });

        if (this.editPositions.length == 1) { //只有一个节点表示点类型 不需要创建整体移动节点
            return;
        }
        this.createEditMoveCenterEntity();
    }

    createCircleEditVertex() {
        const entity = this.viewer.entities.add({
            position: new Cesium.CallbackProperty(e => {
                return this.editPositions[1];
            }, false),
            type: "GeoPlotEditVertex",
            vertexIndex: 1, //节点索引 
            point: {
                color: Cesium.Color.DARKBLUE.withAlpha(0.4),
                pixelSize: 10,
                outlineColor: Cesium.Color.YELLOW.withAlpha(0.4),
                outlineWidth: 3,
                disableDepthTestDistance: 2000,
            },
        })
        this.vertexEntities.push(entity);
    }

    createEditMoveCenterEntity() {
        this.EditMoveCenterEntity = this.viewer.entities.add({
            position: new Cesium.CallbackProperty(e => {
                return this.EditMoveCenterPositoin;
            }, false),
            type: "GeoPlotEditMove",
            point: {
                color: Cesium.Color.RED.withAlpha(0.4),
                pixelSize: 10,
                outlineColor: Cesium.Color.WHITE.withAlpha(0.3),
                outlineWidth: 3,
                disableDepthTestDistance: 2000,
            },
        })
    }

    //清空编辑节点
    clearEditVertex() {
        if (this.vertexEntities) {
            this.vertexEntities.forEach(item => {
                this.viewer.entities.remove(item);
            })
        }
        this.vertexEntities = [];
        this.viewer.entities.remove(this.EditMoveCenterEntity);
    }

    //创建中点节点
    createMidVertex() {
        const plotType = this.editGeoPlot.properties.plotType;
        if (plotType == PlotTypes.RECTANGLE || plotType == PlotTypes.CIRCLE) return; //圆或者矩形不生成中点节点

        this.midVertexEntities = [];
        for (let i = 0; i < this.editPositions.length; i++) {
            const p1 = this.editPositions[i];
            const p2 = this.editPositions[i + 1];
            let mideP = midPosition(p1, p2);
            const entity = this.viewer.entities.add({
                position: mideP,
                type: "GeoPlotEditMidVertex",
                vertexIndex: i + 1, //节点索引 
                point: {
                    color: Cesium.Color.LIMEGREEN.withAlpha(0.4),
                    pixelSize: 10,
                    outlineColor: Cesium.Color.YELLOW.withAlpha(0.4),
                    outlineWidth: 3,
                    disableDepthTestDistance: 2000,
                },
            })
            this.midVertexEntities.push(entity);
        }
    }

    //清空中点节点
    clearMidVertex() {
        if (this.midVertexEntities) {
            this.midVertexEntities.forEach(item => {
                this.viewer.entities.remove(item);
            })
        }
        this.midVertexEntities = [];
    }
}