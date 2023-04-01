// 2维点转3维点  
import appConfig from "@/js/appConfig"
let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();
        this.init2dPoints();
        this.resultEntities = [];
    },

    //初始化viewer
    initViewer(el) {
        this.viewer = new Cesium.Viewer(el, {
            infoBox: false,
            selectionIndicator: false,
            navigation: false,
            animation: false,
            timeline: false,
            baseLayerPicker: false,
            geocoder: false,
            homeButton: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            shouldAnimate: true,
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: appConfig.imageryProvider
            })
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
    },

    //添加2维点位到场景中显示
    init2dPoints() {
        // 原始的二维点位一般只有经纬度 格式如下 可能包含其他属性 以id为例
        this.point2ds = [{ "id": 0, "point": [106.45332960278935, 29.505968155210244] }, { "id": 1, "point": [106.45410195334757, 29.506423551581047] }, { "id": 2, "point": [106.4546746594255, 29.504956627987774] }, { "id": 3, "point": [106.45413682752698, 29.50440691182127] }, { "id": 4, "point": [106.45481041971782, 29.50398565119514] }, { "id": 5, "point": [106.45563641883098, 29.504036487735785] }, { "id": 6, "point": [106.45617402610486, 29.50309294837215] }, { "id": 7, "point": [106.45745224305988, 29.50434812553137] }, { "id": 8, "point": [106.45895022281275, 29.506183264545076] }, { "id": 9, "point": [106.4579404128659, 29.50712188453321] }, { "id": 10, "point": [106.45721717052102, 29.508857826447752] }, { "id": 11, "point": [106.45565986330091, 29.508974922779334] }, { "id": 12, "point": [106.45463063345629, 29.508368625211002] }, { "id": 13, "point": [106.45420017066269, 29.50752947138773] }, { "id": 14, "point": [106.4550905012686, 29.50689915266972] }, { "id": 15, "point": [106.45614131328246, 29.50789612264952] }, { "id": 16, "point": [106.45680643209906, 29.50708386642801] }, { "id": 17, "point": [106.45722495925376, 29.505755196393785] }, { "id": 18, "point": [106.45658587511808, 29.505107542402545] }, { "id": 19, "point": [106.45578379131368, 29.505749672987886] }, { "id": 20, "point": [106.45577143379514, 29.506444564047648] }, { "id": 21, "point": [106.4565365840505, 29.505992532615778] }, { "id": 22, "point": [106.45771162777035, 29.50598441295137] }, { "id": 23, "point": [106.45758738983442, 29.506747018275668] }, { "id": 24, "point": [106.45717765180699, 29.50794491513158] }, { "id": 25, "point": [106.45818049694454, 29.5058639468688] }, { "id": 26, "point": [106.45760813800545, 29.504922773515624] }, { "id": 27, "point": [106.4557567088556, 29.504915713477494] }, { "id": 28, "point": [106.45467750820563, 29.506230306813645] }, { "id": 29, "point": [106.45377240762078, 29.506530229456775] }, { "id": 30, "point": [106.45372948529989, 29.506279211964337] }, { "id": 31, "point": [106.45369856377584, 29.5052384548574] }]
        this.point2ds.forEach(item => {
            this.viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(item.point[0], item.point[1], 0),
                billboard: {
                    image: "../../static/images/camera.png",
                    scaleByDistance: new Cesium.NearFarScalar(300, 1, 1200, 0.4), //设置随图缩放距离和比例
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000), //设置可见距离 10000米可见
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                }
            })
        })
    },

    //开始转换
    startTransform() { //开始转换 依赖倾斜模型（模型加载完成后才能获取到高度） 
        for (let i = 0; i < this.point2ds.length; i++) {
            const item = this.point2ds[i];
            const cartesian3 = Cesium.Cartesian3.fromDegrees(item.point[0], item.point[1], 0); //没有高度的笛卡尔坐标对象
            const c = this.viewer.scene.clampToHeight(cartesian3);
            if (c) {
                item.point3d = this.getPoint3dByCartesian3(c);
                console.log("转换结果 [" + item.point3d + "]")
            }
        }
        //如果没有获取到高度 那么item.point3d为undefined或null
        this.handleResults();
    },

    // 笛卡尔坐标转为 经纬度高度
    getPoint3dByCartesian3(cartesian3) {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian3);
        return [Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude), cartographic.height];
    },

    //处理结果
    handleResults() {
        this.clear();
        let invalidHeights = []; //没有拾取到高度的集合
        this.point2ds.forEach(item => {
            if (item.point3d) { //遍历每一项 如果有高度信息 可以根据id更新数据库
                this.addResultToScene(item.point3d);
            } else {
                invalidHeights.push(item);
            }
        })
    },

    //添加到场景中显示
    addResultToScene(point3d) {
        let entity = this.viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(point3d[0], point3d[1], point3d[2]),
            billboard: {
                image: "../../static/images/marker.png",
                scaleByDistance: new Cesium.NearFarScalar(300, 1, 1200, 0.4), //设置随图缩放距离和比例
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000), //设置可见距离 10000米可见
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            }
        })
        this.resultEntities.push(entity)
    },

    //清空
    clear() {
        this.resultEntities.forEach(item => {
            this.viewer.entities.remove(item);
        })
        this.resultEntities = [];
    },

    //加载3dtiles数据
    load3dtiles() {
        var tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: appConfig.zy3dtiles,
            })
        );

        tileset.readyPromise
            .then(tileset => {
                this.viewer.zoomTo(
                    tileset,
                );
                this.setTilesetHeight(tileset);
            })
            .otherwise(function(error) {
                console.log(error);
            });
    },

    //调整3dtiles的高度位置
    setTilesetHeight(tileset) {
        var cartographic = Cesium.Cartographic.fromCartesian(
            tileset.boundingSphere.center
        );
        var surface = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            cartographic.height
        );
        var offset = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude, 55
        );
        var translation = Cesium.Cartesian3.subtract(
            offset,
            surface,
            new Cesium.Cartesian3()
        );
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}

export default cesiumInit;