// 多边体编辑 
export default class PolygonEditor {
    constructor(viewer, plotLayer) {
        this.viewer = viewer;
        this.plotLayer = plotLayer; //只能从指定的图层中获取编辑对象  
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
        this.clearEditVertex();
    }

    //左键点击事件
    initLeftClickEventHandler() {
        this.eventHandler.setInputAction(e => {
            let id = this.viewer.scene.pick(e.position);
            if (!id) {
                this.handleEditPlot();
                return; // 没有拾取到对象 直接返回 不做任何操作
            }

            // 拾取到对象 判断拾取到的对象类型
            if (!id.id || id.id.plotType != "HedronPlot") {
                this.handleEditPlot();
                return
            };
            if (!this.plotLayer.selectedPlot) return;
            //类型判断 只处理面类型
            if (["polyhedron"].indexOf(this.plotLayer.selectedPlot.properties.plotType) < 0) {
                this.handleEditPlot();
                return
            };
            //重复点击同一个对象
            if (this.editPlot && this.editPlot.plotCode == id.id.plotCode) return;
            //拾取到新的Plot对象
            this.handleEditPlot(); //处理上一个编辑对象
            this.handlePickPlot(id.id);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    //处理编辑对象
    handleEditPlot() {
        this.clear();
        if (!this.editPlot) return;
        this.editPlot.openEditMode(false);
        this.editPlot = undefined;
        if (!this.isEdited) return; //没有任何编辑 直接返回   
        //触发编辑事件 editPlot 
        this.isEdited = false;
        this.isEditing = false;
    }

    //处理拾取到的对象
    handlePickPlot(pickId) {
        this.editPlot = this.plotLayer.getByPlotCode(pickId.plotCode);
        if (!this.editPlot) return; //图层里面没有该对象 说明是在绘制的时候触发该事件
        this.isEditing = false;
        this.isEdited = false;
        this.editPlot.openEditMode(true);
        this.editPositions = this.editPlot.getPositions();
        this.clear();
        this.createEditVertex();
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
            if (id.id.type == "PlotEditVertex") {
                this.isEditing = true;
                this.viewer.scene.screenSpaceCameraController.enableRotate = false; //禁用场景的旋转移动功能 保留缩放功能
                //改变鼠标状态
                this.viewer.enableCursorStyle = false;
                this.viewer._element.style.cursor = '';
                document.body.style.cursor = "move";
                this.editVertext = id.id;
                this.editVertext.show = false;
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
            this.editPositions[this.editVertext.vertexIndex] = pickPosition;
            this.editPlot.setPositions(this.editPositions);
            this.isEdited = true;
        }), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    //创建编辑节点对象
    createEditVertex() {
        this.vertexEntities = [];
        let positions = this.editPlot.getPositions();

        positions.forEach((p, index) => {
            const entity = this.viewer.entities.add({
                position: new Cesium.CallbackProperty(e => {
                    return this.editPositions[index];
                }, false),
                type: "PlotEditVertex",
                vertexIndex: index, //节点索引 
                point: {
                    color: Cesium.Color.DARKBLUE.withAlpha(0.4),
                    pixelSize: 10,
                    outlineColor: Cesium.Color.YELLOW.withAlpha(0.4),
                    outlineWidth: 3,
                    disableDepthTestDistance: 20000,
                },
            })
            this.vertexEntities.push(entity);
        });
    }

    //清空编辑节点
    clearEditVertex() {
        if (this.vertexEntities) {
            this.vertexEntities.forEach(item => {
                this.viewer.entities.remove(item);
            })
        }
        this.vertexEntities = [];
    }
}