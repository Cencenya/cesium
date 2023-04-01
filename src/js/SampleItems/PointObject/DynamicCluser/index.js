// 点位聚合实例
// 使用cesium原生的聚合功能 动态生成聚合图标
import appConfig from "@/js/appConfig"
let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.cluserImages = []; //缓存已经生成的图标
        this.initCluseColors();
        this.initCluser();
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
            shouldAnimate: false,
            imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
            })
        });
        this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        this.viewer.selectedEntityChanged.addEventListener(this.selectedEntityChanged);
    },

    //图标颜色
    initCluseColors() {
        //颜色设置
        this.cluserColors = [{
            value: 100, //聚合数大于等于100 红色
            color: "rgb(255,0,0)"
        }, {
            value: 50, //聚合数大于等于50 黄
            color: "rgb(255,255,0)"
        }, {
            value: 10, //聚合数大于等于10 蓝色
            color: "rgb(51, 133, 255)"
        }, {
            value: 1, //聚合数大于等于1 绿
            color: "rgb(0,255,0)"
        }]
    },

    //初始化聚合
    initCluser() {
        new Cesium.GeoJsonDataSource().load(appConfig.cluserPoint).then(geoJsonDataSource => {
            this.geoJsonDataSource = geoJsonDataSource;
            this.viewer.dataSources.add(geoJsonDataSource);

            geoJsonDataSource.clustering.enabled = true;
            geoJsonDataSource.clustering.pixelRange = 100;
            geoJsonDataSource.clustering.minimumClusterSize = 3;

            this.setClusterEvent(geoJsonDataSource);
            // this.initSceneEvent();
            //设置相机的图标
            geoJsonDataSource.entities.values.forEach(entity => {
                entity.billboard.image = 'static/images/blueCamera.png' //"static/images/camera.png";
                    // entity.cameraCode = entity._properties.CAMERACODE._value;//设置entity的属性
                entity.type = "cluser";
                //如果有高度信息 需要重新赋值
                // let cartographic = Cesium.Cartographic.fromCartesian(entity.position._value);
                // let longitude = Cesium.Math.toDegrees(cartographic.longitude);
                // let latitude = Cesium.Math.toDegrees(cartographic.latitude);
                // entity.position = Cesium.Cartesian3.fromDegrees(longitude, latitude, Number(entity._properties.Z._value));
            });

            this.viewer.flyTo(geoJsonDataSource.entities);
        })
    },

    //设置聚合事件
    setClusterEvent(geoJsonDataSource) {
        this.removeListener = geoJsonDataSource.clustering.clusterEvent.addEventListener(
            (clusteredEntities, cluster) => {
                cluster.billboard.show = true;
                cluster.label.show = false;
                cluster.billboard.id = cluster.label.id;
                cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
                cluster.billboard.image = this.getCluserImage(clusteredEntities.length);
            }
        );
    },

    //获取聚合图标
    getCluserImage(length) {
        if (this.cluserImages[length]) {
            return this.cluserImages[length];
        }
        var c = document.createElement("canvas");
        //一个数字大概12像素
        const d = (length + "").length * 12 + 50;
        c.width = c.height = d;
        var ctx = c.getContext("2d");
        //绘制大圆
        ctx.beginPath();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = this.getCluseColor(length); //绘制样式
        ctx.arc(d / 2, d / 2, d / 2 - 5, 0, 2 * Math.PI);
        ctx.fill();

        //绘制小圆
        ctx.beginPath();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = this.getCluseColor(length); //绘制样式
        ctx.arc(d / 2, d / 2, d / 2 - 10, 0, 2 * Math.PI);
        ctx.fill();

        //绘制文本
        ctx.font = "20px 微软雅黑";
        ctx.globalAlpha = 1;
        ctx.fillStyle = "rgb(255,255,255)";
        let fd = length.toString().length * 12; //文字的长度
        const x = d / 2 - fd / 2;
        ctx.fillText(length, x, d / 2 + 10);
        return c;
    },

    //获取聚合颜色
    getCluseColor(length) {
        for (let i = 0; i < this.cluserColors.length; i++) {
            const element = this.cluserColors[i];
            if (length >= element.value)
                return element.color;
        }
    },

    selectedEntityChanged(e) {
        // console.log(e)能够拿到选中的实体 如果是聚合对象 e.id为一个entity数组 个数为聚合个数
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    }
}

export default cesiumInit;