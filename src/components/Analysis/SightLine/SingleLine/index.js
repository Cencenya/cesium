//单线通视分析类
export default class SightLine {
    constructor(viewer) {
        this.viewer = viewer;
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        this.initEvents();
    }

    //激活
    activate() {
        this.deactivate();
        this.clear();
        this.positions = [];
        this.tempPositions = [];
        this.registerEvents(); //注册鼠标事件 

        //设置鼠标状态 
        this.viewer.enableCursorStyle = false;
        this.viewer._element.style.cursor = 'default';
    }

    //禁用
    deactivate() {
        this.unRegisterEvents();
        this.viewer._element.style.cursor = 'pointer';
        this.viewer.enableCursorStyle = true;
    }

    //清空绘制
    clear() {
        if (this.polylineEntity) {
            this.viewer.entities.remove(this.polylineEntity);
            this.polylineEntity = undefined;
        }
        if (this.viewEntity) {
            this.viewer.entities.remove(this.viewEntity);
            this.viewEntity = undefined;
        }
        if (this.targetEntity) {
            this.viewer.entities.remove(this.targetEntity);
            this.targetEntity = undefined;
        }


        if (this.resultPolylines) {
            this.resultPolylines.forEach((item) => {
                this.viewer.entities.remove(item);
            })
        }
    }

    //初始化事件
    initEvents() {
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    }

    //注册鼠标事件
    registerEvents() {
        this.leftClickEvent();
        this.rightClickEvent();
        this.mouseMoveEvent();
    }

    leftClickEvent() {
        //单击鼠标左键画点
        this.handler.setInputAction(e => {
            this.viewer._element.style.cursor = 'default';
            let position = this.viewer.scene.pickPosition(e.position);
            if (!position) {
                position = this.viewer.scene.camera.pickEllipsoid(e.position, this.viewer.scene.globe.ellipsoid);
            }
            if (!position) return;
            this.positions.push(position);
            if (this.positions.length == 1) {
                this.handleFirstPosition();
            } else { //两点时结束
                this.drawEnd();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    //处理第一个点
    handleFirstPosition() {
        this.generateView();
        this.generatePolyline();
    }

    //构造线对象
    generatePolyline() {
        this.polylineEntity = this.viewer.entities.add({
            polyline: {
                positions: new Cesium.CallbackProperty(e => {
                    return this.tempPositions;
                }, false),
                width: 2,
                material: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW,
                }),
                depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
                    color: Cesium.Color.YELLOW,
                }),
            }
        })
    }

    //添加观察点
    generateView() {
        this.viewEntity = this.viewer.entities.add({
            position: this.positions[0],
            label: {
                text: "观察位置",
                fillColor: Cesium.Color.WHITE,
                scale: 0.5,
                font: 'normal 34px MicroSoft YaHei',
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000),
                scaleByDistance: new Cesium.NearFarScalar(500, 1, 1500, 0.4),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -20),
                outlineWidth: 3,
                outlineColor: Cesium.Color.BLACK
            },
            point: {
                color: Cesium.Color.DODGERBLUE,
                pixelSize: 5,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                scaleByDistance: new Cesium.NearFarScalar(1000, 1, 4200, 0.4),
                disableDepthTestDistance: 500,
            },
        })
    }

    //添加目标点
    generateEndPoint() {
        this.targetEntity = this.viewer.entities.add({
            position: this.positions[1],
            label: {
                text: "目标位置",
                fillColor: Cesium.Color.WHITE,
                scale: 0.5,
                font: 'normal 34px MicroSoft YaHei',
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000),
                scaleByDistance: new Cesium.NearFarScalar(500, 1, 1500, 0.4),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -20),
                outlineWidth: 3,
                outlineColor: Cesium.Color.BLACK
            },
            point: {
                color: Cesium.Color.DODGERBLUE,
                pixelSize: 5,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: 2,
                scaleByDistance: new Cesium.NearFarScalar(1000, 1, 4200, 0.4),
                disableDepthTestDistance: 500,
            },
        })
    }

    //鼠标移动事件
    mouseMoveEvent() {
        this.handler.setInputAction(e => {
            this.viewer._element.style.cursor = 'default'; //由于鼠标移动时 Cesium会默认将鼠标样式修改为手柄 所以移动时手动设置回来
            let position = this.viewer.scene.pickPosition(e.endPosition);
            if (!position) {
                position = this.viewer.scene.camera.pickEllipsoid(e.startPosition, this.viewer.scene.globe.ellipsoid);
            }
            if (!position) return;
            if (!this.polylineEntity) return;
            this.tempPositions = this.positions.concat([position]);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    rightClickEvent() {
        this.handler.setInputAction(e => {
            if (!this.polylineEntity) {
                this.deactivate()
                return;
            }
            if (this.positions.length < 2) {
                this.clear();
                this.deactivate();
                return;
            }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    //解除鼠标事件
    unRegisterEvents() {
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }

    //绘制结束 触发结束事件
    drawEnd() {
        this.generateEndPoint();
        this.startnalysis();
        this.viewer.entities.remove(this.polylineEntity);
        this.deactivate();
    }

    //开始分析
    startnalysis() {
        // 计算射线的方向，目标点left 视域点right
        var direction = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(this.positions[1], this.positions[0], new Cesium.Cartesian3()), new Cesium.Cartesian3());
        // 建立射线
        var ray = new Cesium.Ray(this.positions[0], direction);
        var result = this.viewer.scene.pickFromRay(ray, [this.viewEntity, this.targetEntity]); // 计算交互点，返回第一个
        this.resultPolylines = this.showIntersection(result, this.positions[1], this.positions[0]);
    }


    // 处理交互点
    showIntersection(result, destPoint, viewPoint) {
        let resultPolylines = [];
        let resultLine;
        // 如果是场景模型的交互点，排除交互点是地球表面
        if (Cesium.defined(result) && Cesium.defined(result.object)) {
            resultLine = this.drawResultLine(result.position, viewPoint, Cesium.Color.CHARTREUSE); // 可视区域
            resultPolylines.push(resultLine);
            resultLine = this.drawResultLine(result.position, destPoint, Cesium.Color.RED); // 不可视区域
            resultPolylines.push(resultLine);
        } else {
            resultLine = this.drawResultLine(viewPoint, destPoint, Cesium.Color.CHARTREUSE);
            resultPolylines.push(resultLine);
        }
        return resultPolylines;
    }

    // 绘制结果线
    drawResultLine(leftPoint, secPoint, color) {
        return this.viewer.entities.add({
            polyline: {
                positions: [leftPoint, secPoint],
                width: 2,
                material: color,
                depthFailMaterial: color
            }
        })
    }

}