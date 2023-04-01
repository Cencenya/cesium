// 空间线段等分
import EntityDraw from "@/components/CesiumTools/EntityDraw"
import appConfig from "@/js/appConfig"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.positions = [];
        this.resultEntities = [];
        this.initDrawTool();
        this.load3dtiles();
    },

    //初始化viewer
    initViewer(el) {
        this.viewer = new Cesium.Viewer(el, {
            infoBox: false,
            selectionIndicator: false,
            navigation: false,
            animation: false,
            shouldAnimate: false,
            timeline: false,
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: appConfig.imageryProvider
            })
        });
    },

    //初始化绘制工具
    initDrawTool() {
        this.draw = new EntityDraw(this.viewer);
        this.draw.DrawEndEvent.addEventListener((result, positions) => {
            result.remove();
            this.addDrawResult(positions);
        })
    },

    //添加绘制结果
    addDrawResult(positions) {
        this.positions.push(positions[0]);

        if (this.positions.length == 1) {
            this.addStartPosition();
        } else if (this.positions.length == 2) {
            this.addEndPosition();
        }

        if (this.positions.length == 2) {
            this.clearResults();
            this.startBisection();
        }
    },

    //开始等分
    startBisection() {
        //分成多少段 
        let count = Number(this.lineCount) + 1; //1段2个点 2段3个点 3段4个点 5段6个点。。。 

        var cartesians = new Array(count);
        for (var i = 0; i < count; ++i) {
            const offset = i / (count - 1);
            cartesians[i] = Cesium.Cartesian3.lerp(
                this.positions[0],
                this.positions[1],
                offset,
                new Cesium.Cartesian3()
            );
            this.addResultEntity(cartesians[i]);
        }
        //cartesians为分段结果 
    },

    //添加起点
    addStartPosition() {
        this.startEntity = this.viewer.entities.add({
            position: this.positions[0],
            billboard: {
                image: "../../static/images/start.png",
                // scaleByDistance: new Cesium.NearFarScalar(300, 1, 1200, 0.4), //设置随图缩放距离和比例
                // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000), //设置可见距离 10000米可见
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            }
        })
    },

    //添加终点
    addEndPosition() {
        this.endEntity = this.viewer.entities.add({
            position: this.positions[1],
            billboard: {
                image: "../../static/images/end.png",
                // scaleByDistance: new Cesium.NearFarScalar(300, 1, 1200, 0.4), //设置随图缩放距离和比例
                // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000), //设置可见距离 10000米可见
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            }
        })
    },

    //添加一个实体
    addResultEntity(position) {
        let entity = this.resultEntity = this.viewer.entities.add({
            position: position,
            billboard: {
                image: "../../static/images/marker.png",
                scaleByDistance: new Cesium.NearFarScalar(300, 1, 1200, 0.4), //设置随图缩放距离和比例
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000), //设置可见距离 10000米可见
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            }
        })
        this.resultEntities.push(entity)
    },

    //清除结果
    clearResults() {
        this.resultEntities.forEach(item => {
            this.viewer.entities.remove(item);
        })
        this.resultEntities = [];
    },

    //清除所有点
    clearPositions() {
        this.viewer.entities.remove(this.startEntity);
        this.viewer.entities.remove(this.endEntity);
        this.positions = [];
    },

    //激活绘制工具
    drawActivate(type, count) {
        this.lineCount = count;
        this.draw.activate(type);
        if (this.positions.length == 2) this.clearPositions();
    },

    //加载三维模型
    load3dtiles() {
        var tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: appConfig.zy3dtiles,
            })
        );

        tileset.readyPromise
            .then(tileset => {
                this.tileset = tileset;
                this.viewer.zoomTo(
                    tileset,
                );
                this.setTilesetHeight(55);
            })
            .otherwise(function(error) {
                console.log(error);
            });
    },

    //设置模型高度 否则飘在空中
    setTilesetHeight(height) {
        var cartographic = Cesium.Cartographic.fromCartesian(
            this.tileset.boundingSphere.center
        );
        var surface = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            cartographic.height
        );
        var offset = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude, height
        );
        var translation = Cesium.Cartesian3.subtract(
            offset,
            surface,
            new Cesium.Cartesian3()
        );
        this.tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;