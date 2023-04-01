// 行业应用动态水域实例 
import appConfig from "@/js/appConfig"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        //存储所有水面数据
        this.waterPrimitives = [];
        this.addHeliuRegion();
        this.setView();
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
            // imageryProvider: new Cesium.UrlTemplateImageryProvider({
            //     url: appConfig.imageryProvider
            // }),
            imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
                url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
            })
        });
    },

    //更新颜色
    updateColor(cssColorString) {
        this.waterMaterial.uniforms.baseWaterColor = Cesium.Color.fromCssColorString(cssColorString);
    },

    //获取颜色
    getColor() {
        return Cesium.Color.AQUA.withAlpha(0.6).toCssColorString()
    },

    //添加河流水面
    addHeliuRegion() {
        //创建水体材质
        let waterMaterial = this.createWaterMaterial();
        this.waterMaterial = waterMaterial;
        //内
        fetch("../static/data/hedao-nei.json").then(res => {
            return res.json();
        }).then(res => {
            let features = res.features;
            let coordinates, positions;
            features.map(feature => {
                coordinates = feature.geometry.coordinates[0];
                positions = this.coordinatesToPositions(coordinates);
                this.addWaterRegion(positions, waterMaterial);
            })
        })

        //外
        fetch("../static/data/hedao-wai.json").then(res => {
            return res.json();
        }).then(res => {
            let features = res.features;
            let coordinates, positions;
            features.map(feature => {
                coordinates = feature.geometry.coordinates[0];
                positions = this.coordinatesToPositions(coordinates);
                this.addWaterRegion(positions, waterMaterial);
            })
        })
    },

    //添加水面
    addWaterRegion(positions, waterMaterial) {
        //创建水体geometry
        var polygon1 = new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(positions),
            perPositionHeight: true,
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
        });

        var primitive = new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: polygon1
            }),
            appearance: new Cesium.EllipsoidSurfaceAppearance({
                aboveGround: true
            }),
            show: true
        });
        primitive.appearance.material = waterMaterial;
        this.viewer.scene.primitives.add(primitive); //添加到场景
        this.waterPrimitives.push(primitive);
    },

    //创建水体材质
    createWaterMaterial() {
        return new Cesium.Material({
            fabric: {
                type: 'Water',
                uniforms: {
                    baseWaterColor: Cesium.Color.AQUA.withAlpha(0.6),
                    normalMap: 'static/images/effects/waterNormalsSmall.jpg',
                    frequency: 1000.0,
                    animationSpeed: 0.01,
                    amplitude: 10,
                    specularIntensity: 10
                }
            }
        });
    },

    //坐标串转为笛卡尔坐标数组
    coordinatesToPositions(coordinates) {
        let positions = [];
        coordinates.map(c => {
            positions.push(Cesium.Cartesian3.fromDegrees(c[0], c[1], 0))
        });
        return positions;
    },

    //设置视角
    setView() {
        this.viewer.scene.camera.setView({
            duration: 1,
            destination: {
                x: -2901323.897389136,
                y: 4722193.391311397,
                z: 3157579.014684669
            },
            orientation: {
                heading: 6.1552778668430514,
                pitch: -0.774444999584774,
                roll: 6.282667953914245
            }
        });
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;