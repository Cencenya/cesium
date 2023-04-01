// 水体材质实例
import EntityDraw from "@/components/CesiumTools/EntityDraw"
import appConfig from "@/js/appConfig"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        //初始化绘制工具
        this.initDrawTool();
        //加载三维模型
        this.load3dtiles();
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
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: appConfig.imageryProvider
            }),
        });
    },

    //添加河流水面
    addHeliuRegion() {
        const positions = [
            { x: -1573646.574385626, y: 5327862.998114007, z: 3122882.0126497806 }, { x: -1573674.4927850217, y: 5327841.079208016, z: 3122905.0853668815 }, { x: -1573697.300247773, y: 5327824.154858261, z: 3122922.2296030447 }, { x: -1573723.2566743596, y: 5327804.220696046, z: 3122942.8339925 }, { x: -1573758.6792294222, y: 5327780.238635048, z: 3122965.933496034 }, { x: -1573782.7955957302, y: 5327764.660988683, z: 3122980.284263632 }, { x: -1573802.0711376078, y: 5327753.162159477, z: 3122989.961597303 }, { x: -1573818.2256981286, y: 5327743.702623943, z: 3122997.8881463786 }, { x: -1573836.390515118, y: 5327730.24093674, z: 3123011.720182871 }, { x: -1573853.867715565, y: 5327716.870771106, z: 3123025.672760408 }, { x: -1573881.363708308, y: 5327696.189850067, z: 3123046.939113487 }, { x: -1573917.6152507644, y: 5327669.018123424, z: 3123074.966586196 }, { x: -1573926.9820208312, y: 5327662.461066732, z: 3123081.351110614 }, { x: -1573938.1098204239, y: 5327654.702930395, z: 3123088.759295021 }, { x: -1573954.0176107218, y: 5327644.379581239, z: 3123098.291348635 }, { x: -1573964.7512216873, y: 5327635.925342955, z: 3123104.6748915347 }, { x: -1573984.9669868168, y: 5327619.909903474, z: 3123116.289125795 }, { x: -1573968.8319637552, y: 5327616.4065885795, z: 3123130.7026131423 }, { x: -1573944.0563865206, y: 5327639.361826853, z: 3123111.33203873 }, { x: -1573927.7554437916, y: 5327650.519985489, z: 3123100.7197816116 }, { x: -1573904.7711183839, y: 5327666.247100797, z: 3123085.6995552983 }, { x: -1573900.0844216363, y: 5327669.12337478, z: 3123083.13969443 }, { x: -1573882.656988854, y: 5327682.386903352, z: 3123069.5155642116 }, { x: -1573852.8168025815, y: 5327705.006477089, z: 3123045.985478789 }, { x: -1573826.1044827306, y: 5327724.060820944, z: 3123027.076716561 }, { x: -1573797.9909229, y: 5327743.687548958, z: 3123008.816503377 }, { x: -1573768.141830067, y: 5327762.834272328, z: 3122990.471647622 }, { x: -1573740.1560181207, y: 5327780.735847701, z: 3122974.151395415 }, { x: -1573710.2984952328, y: 5327801.620498089, z: 3122953.746622961 }, { x: -1573666.9494654608, y: 5327834.72201891, z: 3122919.660895541 }, { x: -1573633.8838709379, y: 5327860.265334742, z: 3122893.1117008366 }
        ]
        this.addWaterRegion(positions);
    },

    //初始化绘制工具
    initDrawTool() {
        //创建绘制工具 绘制结束添加水体
        this.drawTool = new EntityDraw(this.viewer);
        this.drawTool.DrawEndEvent.addEventListener((result, positions, drawType) => {
            result.remove();
            this.addWaterRegion(positions, drawType);
        })
    },

    //激活绘制工具
    drawActivate(type) {
        this.drawTool.activate(type);
    },

    //添加水面
    addWaterRegion(positions) {
        console.log(positions);
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
        //创建水体材质
        var waterMaterial = this.createWaterMaterial();
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
                    baseWaterColor: Cesium.Color.AQUA.withAlpha(0.3),
                    normalMap: 'static/images/effects/waterNormalsSmall.jpg',
                    frequency: 1000.0,
                    animationSpeed: 0.03,
                    amplitude: 10.0,
                    specularIntensity: 5,
                }
            }
        });
    },

    //清除水体
    clear() {
        this.waterPrimitives.forEach(item => {
            this.viewer.scene.primitives.remove(item);
        });
        this.waterPrimitives = [];
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

    //设置模型高度
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

    //设置视角
    setView() {
        this.viewer.scene.camera.setView({
            duration: 1,
            destination: {
                x: -1573619.6471639725,
                y: 5328105.434513959,
                z: 3123157.3345488473
            },
            orientation: {
                heading: 1.769495648542554,
                pitch: -0.885008929765446,
                roll: 0.004446235155041833
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