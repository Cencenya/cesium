// 使用cesium结合geoserver分户单体化功能  
import * as turf from "@turf/turf"
import appConfig from "@/js/appConfig"
let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();
        this.setView();

        this.fhPrimitives = []; //分户Primitive对象集合 
        //geoserver数据服务的地址 分层数据地址 
        this.fcDataServerBaseUrl = "http://106.53.103.200:8080/geoserver/offset-data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=offset-data%3Afc_offset&maxFeatures=50&outputFormat=application%2Fjson"
            //geoserver数据服务的地址 分户数据地址 分层数据中的楼栋编号和分户数据中的楼编号一致
        this.fhDataServerBaseUrl = "http://106.53.103.200:8080/geoserver/offset-data/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=offset-data%3Afh_offset&maxFeatures=50&outputFormat=application%2Fjson"
            //执行默认查询
        this.queryByPoint([106.45734985847386, 29.508355055474865], 6.8);
        this.initEvents();
        this.HouseSelectedEvent = new Cesium.Event();
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
                //点击了已有的分户单体化
                if (pickFeature.primitive && pickFeature.primitive instanceof Cesium.ClassificationPrimitive) {
                    this.handlePickHouse(pickFeature); //处理点击到的楼层
                    return;
                }
            }

            let position = this.viewer.scene.pickPosition(e.position); //屏幕坐标转为笛卡尔空间坐标
            if (!position) return;

            let c = Cesium.Cartographic.fromCartesian(position); //笛卡尔坐标转为经纬度（弧度）
            let point = [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude)]; //转为经纬度点
            this.queryByPoint(point, c.height);
        }), Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },

    //点查询  点击查询是查询分层的数据 先获取用户点击的是哪一栋 那一层 再去查询该层的分户数据
    queryByPoint(point, height) {
        this.mouseClickHeight = height; //记录鼠标点击处的高度 通过高度计算是第几层
        //数据服务地址加上过滤条件 （条件为空间查询 与点相交）
        let url = this.fcDataServerBaseUrl +
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
            this.handleFcQueryResult(res);
        }).catch(err => {
            console.log(err)
        })
    },

    //处理分层数据查询结果
    handleFcQueryResult(result) {
        this.clearPrimitives();
        this.HouseSelectedEvent.raiseEvent(undefined); //触发选中事件 通知界面更新
        //如果查询成功 那么返回的结果应该是一个geojson对象 类型为FeatureCollection
        //此处查询结果是楼栋所有层的数据 ，需要过滤点击的是第几层，我们只展示该层数据
        if (result.features.length < 1) {
            return
        };

        //通过 比对高度判断点击的是那一层
        let floorFeature = undefined;
        for (let i = 0; i < result.features.length; i++) {
            const feature = result.features[i];
            if (this.mouseClickHeight >= feature.properties.BaseHeight && this.mouseClickHeight <= feature.properties.TopHeight) {
                floorFeature = feature;
                break;
            }
        }

        if (!floorFeature) return;
        //获取楼栋编号和楼层数 作为条件去分户数据上查询
        const buildCode = floorFeature.properties.BuildCode;
        const floorNumbe = floorFeature.properties.FloorNumbe;
        this.queryBySQL(buildCode, floorNumbe);
    },

    //根据条件查询
    queryBySQL(buildCode, floorNumbe) {
        let url = this.fhDataServerBaseUrl + "&" +
            "cql_filter=BuildCode=" + buildCode + " and FloorNumbe=" + floorNumbe; //条件中不能出现空格 否则过滤条件会失效

        //发送get请求
        fetch(url).then(res => {
            return res.json();
        }).then(res => {
            this.handleFhQueryResult(res);
        }).catch(err => {
            console.log(err)
        })
    },

    //处理分户查询结果
    handleFhQueryResult(result) {
        if (result.features.length < 1) {
            return
        };
        this.queryResultFeatures = result.features; //将结果保存到一个变量中 

        result.features.forEach(feature => {
            this.addPrimitive(feature);
        })
    },

    //添加楼栋分户Primitive
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

        const id = properties.BuildCode + properties.FloorNumbe + properties.HouseCode; //楼栋编号加上楼楼层加上户室号 为每户的唯一标识
        let buildingPrimitive = this.createExtrudedPolygon(id, polygonGeometry);
        this.fhPrimitives.push(buildingPrimitive);
    },

    //清除所有
    clearPrimitives() {
        this.fhPrimitives.forEach(item => {
            this.viewer.scene.primitives.remove(item);
        });
        this.fhPrimitives = [];
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


    //处理拾取到的户室信息
    handlePickHouse(pickFeature) {
        //恢复上一个贴对象面显示 
        if (this.clickHighlightPrimitive) {
            this.clickHighlightPrimitive.show = true;
        }

        //设置当前点击的贴对象面不显示 
        pickFeature.primitive.show = false;
        this.clickHighlightPrimitive = pickFeature.primitive;

        let feature = this.getFeatureByPrimitiveId(pickFeature.id);
        this.HouseSelectedEvent.raiseEvent(feature); //触发选中事件 通知界面更新
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

    //根据id获取点击的户室数据
    getFeatureByPrimitiveId(primitiveId) {
        //我们将查询到的户室数据存在了this.queryResultFeatures中 
        //因为primitive只能存储id ，所以我们要根据id来获取原始的数据
        for (let i = 0; i < this.queryResultFeatures.length; i++) {
            const properties = this.queryResultFeatures[i].properties;
            const id = properties.BuildCode + properties.FloorNumbe + properties.HouseCode; //楼栋编号加上楼楼层 为每一层的唯一标识
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

    //设置默认视角
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