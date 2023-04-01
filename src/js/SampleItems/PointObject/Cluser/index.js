// 点位聚合实例
// 使用cesium原生的聚合功能 参考百度聚合图标
import appConfig from "@/js/appConfig"
let cesiumInit = {
    init(el) {
        this.initViewer(el);
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

    //初始化聚合
    initCluser() {
        new Cesium.GeoJsonDataSource().load(appConfig.cluserPoint).then(geoJsonDataSource => {
            this.geoJsonDataSource = geoJsonDataSource;
            this.viewer.dataSources.add(geoJsonDataSource);

            geoJsonDataSource.clustering.enabled = true;
            geoJsonDataSource.clustering.pixelRange = 30;
            geoJsonDataSource.clustering.minimumClusterSize = 3;

            this.setClusterEvent(geoJsonDataSource);
            // this.initSceneEvent();
            //设置相机的图标
            geoJsonDataSource.entities.values.forEach(entity => {
                entity.billboard.image = 'static/images/blueCamera.png'; //"static/images/camera.png";
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

                if (clusteredEntities.length >= 300) {
                    cluster.billboard.image = "static/images/cluser/300+.png";
                } else if (clusteredEntities.length >= 150) {
                    cluster.billboard.image = "static/images/cluser/150+.png";
                } else if (clusteredEntities.length >= 90) {
                    cluster.billboard.image = "static/images/cluser/90+.png";
                } else if (clusteredEntities.length >= 30) {
                    cluster.billboard.image = "static/images/cluser/30+.png";
                } else if (clusteredEntities.length > 10) {
                    cluster.billboard.image = "static/images/cluser/10+.png";
                } else {
                    cluster.billboard.image = "static/images/cluser/" + clusteredEntities.length + ".png";
                }
            }
        );
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