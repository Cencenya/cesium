// 使用cesium结合geoserver动态单体化功能
import BuildInfoWindow from "@/components/PopupWindow/BuildInfoWindow";
import appConfig from "@/js/appConfig"
let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3ditles();
        this.setView();

        this.mouseClickPosition = { x: -1573806.6851518294, y: 5327727.334663347, z: 3123088.1586224944 }
            //geoserver数据服务的地址
        this.dataServerBaseUrl = "http://106.53.103.200:8080/geoserver/offset-data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=offset-data%3Abuild_offset&maxFeatures=50&outputFormat=application%2Fjson"
        this.queryByPoint([106.45716360502307, 29.50855655057801]);
        this.initEvents();
    },

    //初始化viewer
    initViewer(el) {
        Cesium.Ion.defaultAccessToken = appConfig.cesiumToken;
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

    //场景事件
    initEvents() {
        new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas).setInputAction(((e) => {
            let position = this.viewer.scene.pickPosition(e.position); //屏幕坐标转为笛卡尔空间坐标
            if (!position) return;
            this.mouseClickPosition = position;
            console.log(position)
            let c = Cesium.Cartographic.fromCartesian(position); //笛卡尔坐标转为经纬度（弧度）
            let point = [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude)]; //转为经纬度点
            this.queryByPoint(point);
        }), Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },

    //点查询
    queryByPoint(point) {
        //数据服务地址加上过滤条件 （条件为空间查询 与点相交）
        let url = this.dataServerBaseUrl +
            '&filter=<Filter xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml">' +
            '<Intersects>' +
            '<PropertyName>the_geom</PropertyName>' +
            '<gml:Point>' +
            '<gml:coordinates>' + point[0] + ',' + point[1] + '</gml:coordinates>' +
            '</gml:Point>' +
            '</Intersects>' +
            '</Filter>'

        //发送get请求
        fetch(url).then(res => {
            return res.json();
        }).then(res => {
            this.handleQueryResult(res);
        }).catch(err => {
            console.log(err)
        })
    },

    //处理查询结果
    handleQueryResult(result) {
        //清除上一次结果
        this.clearQueryResult();
        //如果查询成功 那么返回的结果应该是一个geojson对象 类型为FeatureCollection
        let feature = result.features[0]; //取第一个要素
        if (!feature) return;
        let geometry = feature.geometry; //取要素的几何对象
        let properties = feature.properties; //取要素的属性信息
        let coordinates;
        let pointArr = [];
        if (geometry.type == "MultiPolygon") { //多面 房屋面一般不会出现空洞等现象 如果有需要另做处理
            coordinates = geometry.coordinates[0][0];
        } else if (geometry.type == "Polygon") {
            coordinates = geometry.coordinates[0];
        }

        for (let i = 0; i < coordinates.length; i++) {
            const element = coordinates[i];
            pointArr.push(element[0]);
            pointArr.push(element[1]);
            pointArr.push(0);
        }
        this.addClampFeature(pointArr);
        this.showBuildInfo(properties)
    },

    //添加贴地对象
    addClampFeature(pointArr) {
        this.clampFeature = this.viewer.entities.add({
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(pointArr)),
                classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
                material: Cesium.Color.RED.withAlpha(0.5)
            }
        })
    },

    //显示建筑信息
    showBuildInfo(properties) {
        const fileds = ["小区名称", "楼栋名称", "单元数", "楼栋长名称", "楼栋长电话"];
        const values = [properties.communityN, properties.buildName, properties.unitCount + "（个）", properties.leaderName, properties.leaderPhon];
        this.buildInfoWindow = new BuildInfoWindow(this.viewer, this.mouseClickPosition, "楼栋信息", fileds, values);
    },

    //清除查询结果
    clearQueryResult() {
        if (this.clampFeature) {
            this.viewer.entities.remove(this.clampFeature);
            this.clampFeature = undefined;
        }

        if (this.buildInfoWindow) {
            this.buildInfoWindow.windowClose();
            this.buildInfoWindow = undefined;
        }
    },

    //加载三维模型
    load3ditles() {
        var tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: appConfig.zy3dtiles,
            })
        );

        tileset.readyPromise
            .then(tileset => {
                this.tileset = tileset;
                // this.viewer.zoomTo(
                //     tileset,
                // );

                this.setTilesetHeight(55);
            })
            .otherwise(function(error) {
                console.log(error);
            });
    },

    //设置视角
    setView() {
        let flyToOpts = {
            destination: {
                x: -1574022.5720305464,
                y: 5327801.903466489,
                z: 3123111.566829993
            },
            orientation: {
                heading: 4.979524808068254,
                pitch: -0.54024894684202,
                roll: 6.279951136096583
            }
        };
        this.viewer.scene.camera.setView(flyToOpts);
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
        this.clearQueryResult();
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    }
}

export default cesiumInit;