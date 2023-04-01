// 使用cesium结合geoserver分层单体化功能 
import * as turf from "@turf/turf"
import appConfig from "@/js/appConfig"
let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();
        this.setView();

        this.mouseClickPosition = { x: -1573831.7669333483, y: 5327727.13609521, z: 3123072.6339310976 };
        this.fcPrimitives = []; // 分层图元
        //geoserver数据服务的地址
        this.dataServerBaseUrl = "http://106.53.103.200:8080/geoserver/offset-data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=offset-data%3Afc_offset&maxFeatures=50&outputFormat=application%2Fjson";
        //手动进行一次查询
        this.queryByPoint([106.45734985847386, 29.508355055474865]);
        this.initEvents();
        this.FloorSelectedEvent = new Cesium.Event();
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

    //场景事件
    initEvents() {
        new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas).setInputAction(((e) => {
            let pickFeature = this.viewer.scene.pick(e.position);
            if (pickFeature) {
                //点击了已有的分层单体化
                if (pickFeature.primitive && pickFeature.primitive instanceof Cesium.ClassificationPrimitive) {
                    this.handlePickFloor(pickFeature); //处理点击到的楼层
                    return;
                }
            }

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
        this.clearPrimitives();
        this.FloorSelectedEvent.raiseEvent(undefined); //触发选中事件 通知界面更新
        //如果查询成功 那么返回的结果应该是一个geojson对象 类型为FeatureCollection
        if (result.features.length < 1) {
            return
        };
        this.queryResultFeatures = result.features; //将结果保存到一个变量中 

        result.features.forEach(feature => {
            this.addPrimitive(feature);
        })
    },

    //添加楼栋分层Primitive
    addPrimitive(feature) {
        let properties = feature.properties; //要素的属性信息
        //面的三维坐标串
        //因为制作面数据的时候 画得范围与房屋比较贴合 贴模型显示会有些地方没覆盖 所以缓冲一点点距离
        feature = turf.buffer(feature, 0.8, { units: 'meters' }); //该行代码可以注释看看效果
        let degreesArrayHeights = this.getDegreesArrayHeights(feature);
        let polygonGeometry = new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(
                Cesium.Cartesian3.fromDegreesArrayHeights(degreesArrayHeights)
            ),
            perPositionHeight: true, //使用z坐标 否则高度从0开始
            extrudedHeight: properties.BaseHeight + properties.FloorHeigh, //拉伸高度
        });

        const id = properties.BuildCode + properties.FloorNumbe; //楼栋编号加上楼楼层 为每一层的唯一标识
        let buildingPrimitive = this.createExtrudedPolygon(id, polygonGeometry);
        this.fcPrimitives.push(buildingPrimitive);
    },

    //清除所有
    clearPrimitives() {
        this.fcPrimitives.forEach(item => {
            this.viewer.scene.primitives.remove(item);
        });
        this.fcPrimitives = [];
        this.viewer.entities.remove(this.highlightFloorEntity);
    },

    //创建拉伸的多边形对象
    createExtrudedPolygon(id, polygonGeometry) {
        return this.viewer.scene.primitives.add(
            new Cesium.ClassificationPrimitive({
                geometryInstances: new Cesium.GeometryInstance({
                    geometry: Cesium.PolygonGeometry.createGeometry(polygonGeometry),
                    attributes: {
                        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                            Cesium.Color.fromRandom({ alpha: 0.8 })
                        ),
                        show: new Cesium.ShowGeometryInstanceAttribute(true),
                    },
                    id: id, //设置id有效 其他属性无效
                }),
                classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
            })
        );
    },

    //获取坐标串
    getDegreesArrayHeights(feature) {
        let degreesArrayHeights = [];
        let coordinates;
        if (feature.geometry.type == "MultiPolygon") {
            coordinates = feature.geometry.coordinates[0][0];
        } else if (feature.geometry.type == "Polygon") {
            coordinates = feature.geometry.coordinates[0];
        }
        //坐标串转为需要的格式[x,y,z,x,y,z....]
        for (let i = 0; i < coordinates.length; i++) {
            const element = coordinates[i];
            degreesArrayHeights.push(element[0]);
            degreesArrayHeights.push(element[1]);
            degreesArrayHeights.push(feature.properties.BaseHeight);
        }

        return degreesArrayHeights;
    },


    //处理拾取到的楼层信息
    handlePickFloor(pickFeature) {
        //恢复上一个贴对象面显示 
        if (this.clickHighlightPrimitive) {
            this.clickHighlightPrimitive.show = true;
        }

        //设置当前点击的贴对象面不显示 
        pickFeature.primitive.show = false;
        this.clickHighlightPrimitive = pickFeature.primitive;

        let feature = this.getFeatureByPrimitiveId(pickFeature.id);
        this.FloorSelectedEvent.raiseEvent(feature); //触发选中事件 通知界面更新
        feature = turf.buffer(feature, 1, { units: 'meters' });
        this.viewer.entities.remove(this.highlightFloorEntity);
        let degreesArrayHeights = this.getDegreesArrayHeights(feature);
        this.highlightFloorEntity = this.viewer.entities.add({
            polygon: {
                hierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(degreesArrayHeights)),
                perPositionHeight: true,
                extrudedHeight: feature.properties.BaseHeight + feature.properties.FloorHeigh,
                material: Cesium.Color.RED.withAlpha(0.7)
            }
        });
    },

    //根据id获取点击的楼层数据
    getFeatureByPrimitiveId(primitiveId) {
        //我们将查询到的楼层数据存在了this.queryResultFeatures中 
        //因为primitive只能存储id ，所以我们要根据id来获取原始的数据
        for (let i = 0; i < this.queryResultFeatures.length; i++) {
            const properties = this.queryResultFeatures[i].properties;
            const id = properties.BuildCode + properties.FloorNumbe; //楼栋编号加上楼楼层 为每一层的唯一标识
            if (id == primitiveId) {
                return this.queryResultFeatures[i];
            }
        }
    },

    //加载三维模型
    load3dtiles() {
        let tileset = this.viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: appConfig.zy3dtiles,
            })
        );

        tileset.readyPromise
            .then(tileset => {
                this.tileset = tileset;
                this.setTilesetHeight(58);
            })
            .otherwise(function(error) {
                console.log(error);
            });
    },

    //设置模型高度
    setTilesetHeight(height) {
        let cartographic = Cesium.Cartographic.fromCartesian(
            this.tileset.boundingSphere.center
        );
        let surface = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            cartographic.height
        );
        let offset = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude, height
        );
        let translation = Cesium.Cartesian3.subtract(
            offset,
            surface,
            new Cesium.Cartesian3()
        );
        this.tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    },

    //设置视图
    setView() {
        let flyToOpts = {
            destination: {
                x: -1573995.6129586431,
                y: 5327777.486713325,
                z: 3123087.61152451
            },
            orientation: {
                heading: 4.996705925641388,
                pitch: -0.5519860541846482,
                roll: 6.279943661313574
            }
        };
        this.viewer.scene.camera.setView(flyToOpts);
    },

    destroy() {
        this.clearPrimitives();
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    }
}

export default cesiumInit;