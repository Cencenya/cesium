//雷达放射波  
import appConfig from "@/js/appConfig"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.initRadarRiationWave1();
        this.initRadarRiationWave2();
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
            }),
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
    },

    //初始化雷达放射波
    initRadarRiationWave1() {
        let scene = this.viewer.scene;
        // 1 雷达位置计算
        // 1.1 雷达的高度
        let length = 400000.0;
        // 1.2 地面位置(垂直地面)
        let positionOnEllipsoid = Cesium.Cartesian3.fromDegrees(112.39, 39.9);
        // 1.3 中心位置
        let centerOnEllipsoid = Cesium.Cartesian3.fromDegrees(112.39, 39.9, length * 0.5);
        // 1.4 顶部位置(卫星位置)
        let topOnEllipsoid = Cesium.Cartesian3.fromDegrees(112.39, 39.9, length);
        // 1.5 矩阵计算
        let modelMatrix = Cesium.Matrix4.multiplyByTranslation(
            Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid),
            new Cesium.Cartesian3(0.0, 0.0, length * 0.5), new Cesium.Matrix4()
        );
        // 2 相机飞入特定位置
        this.viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(centerOnEllipsoid, length));
        // 3 创建卫星
        let imageUri = "../../static/images/wave.svg";
        let billboards = scene.primitives.add(new Cesium.BillboardCollection());
        billboards.add({
            image: imageUri,
            position: topOnEllipsoid,
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(-10, 10),
            scale: 0.3,
        });
        // 4 创建雷达放射波
        // 4.1 先创建Geometry
        let cylinderGeometry = new Cesium.CylinderGeometry({
            length: length,
            topRadius: 0.0,
            bottomRadius: length * 0.3,
            vertexFormat: Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat
        });
        // 4.2 创建GeometryInstance
        let redCone = new Cesium.GeometryInstance({
            geometry: cylinderGeometry,
            modelMatrix: modelMatrix,
        });
        // 4.3 创建Primitive
        let radar = scene.primitives.add(new Cesium.Primitive({
            geometryInstances: [redCone],
            appearance: new Cesium.MaterialAppearance({
                material: new Cesium.Material({
                    fabric: {
                        type: 'VtxfShader1',
                        uniforms: {
                            color: new Cesium.Color(0.2, 1.0, 0.0, 1.0),
                            repeat: 30.0,
                            offset: 0.0,
                            thickness: 0.3,
                        },
                        source: `
                            uniform vec4 color;
                            uniform float repeat;
                            uniform float offset;
                            uniform float thickness;
                            czm_material czm_getMaterial(czm_materialInput materialInput)
                            {
                                czm_material material = czm_getDefaultMaterial(materialInput);
                                float sp = 1.0/repeat;
                                vec2 st = materialInput.st;
                                float dis = distance(st, vec2(0.5));
                                float m = mod(dis + offset, sp);
                                float a = step(sp*(1.0-thickness), m);
                                material.diffuse = color.rgb;
                                material.alpha = a * color.a;
                                return material;
                            }
                        `
                    },
                    translucent: false
                }),
                faceForward: false,
                closed: true
            }),
        }));
        // 5 动态修改雷达材质中的offset变量，从而实现动态效果。
        this.viewer.scene.preUpdate.addEventListener(function() {
            let offset = radar.appearance.material.uniforms.offset;
            offset -= 0.001;
            if (offset > 1.0) {
                offset = 0.0;
            }
            radar.appearance.material.uniforms.offset = offset;
        });
    },

    //初始化雷达放射波
    initRadarRiationWave2() {
        let scene = this.viewer.scene;
        // 1 雷达位置计算
        // 1.1 雷达的高度
        let length = 400000.0;
        // 1.2 地面位置(垂直地面)        
        let positionOnEllipsoid = Cesium.Cartesian3.fromDegrees(116.39, 39.9);
        // 1.3 中心位置
        let centerOnEllipsoid = Cesium.Cartesian3.fromDegrees(116.39, 39.9, length * 0.5);
        // 1.4 顶部位置(卫星位置)
        let topOnEllipsoid = Cesium.Cartesian3.fromDegrees(116.39, 39.9, length);
        // 1.5 矩阵计算
        let modelMatrix = Cesium.Matrix4.multiplyByTranslation(
            Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid),
            new Cesium.Cartesian3(0.0, 0.0, length * 0.5), new Cesium.Matrix4()
        );
        // 2 相机飞入特定位置
        this.viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(centerOnEllipsoid, length));
        // 3 创建卫星
        let imageUri = "../../static/images/wave.svg";
        let billboards = scene.primitives.add(new Cesium.BillboardCollection());
        billboards.add({
            image: imageUri,
            position: topOnEllipsoid,
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(-10, 10),
            scale: 0.3,
        });
        // 4 创建雷达放射波
        // 4.1 先创建Geometry
        let cylinderGeometry = new Cesium.CylinderGeometry({
            length: length,
            topRadius: 0.0,
            bottomRadius: length * 0.3,
            vertexFormat: Cesium.MaterialAppearance.MaterialSupport.TEXTURED.vertexFormat
        });
        // 4.2 创建GeometryInstance
        let redCone = new Cesium.GeometryInstance({
            geometry: cylinderGeometry,
            modelMatrix: modelMatrix,
        });
        // 4.3 创建Primitive
        let radar = scene.primitives.add(new Cesium.Primitive({
            geometryInstances: [redCone],
            appearance: new Cesium.MaterialAppearance({
                material: new Cesium.Material({
                    fabric: {
                        type: 'VtxfShader1',
                        uniforms: {
                            color: new Cesium.Color(0.2, 1.0, 0.0, 1.0),
                            repeat: 1.0,
                            offset: 0.0,
                            thickness: 0.8,
                        },
                        source: `
                            uniform vec4 color;
                            uniform float repeat;
                            uniform float offset;
                            uniform float thickness;
                            czm_material czm_getMaterial(czm_materialInput materialInput)
                            {
                                czm_material material = czm_getDefaultMaterial(materialInput);
                                float sp = 1.0/repeat;
                                vec2 st = materialInput.st;
                                float dis = distance(st, vec2(0.5));
                                float m = mod(dis + offset, sp);
                                float a = step(sp*(1.0-thickness), m);
                                material.diffuse = color.rgb;
                                material.alpha = a * color.a * dis * 1.2;
                                return material;
                            }
                        `
                    },
                    translucent: false
                }),
                faceForward: false,
                closed: true
            }),
        }));
        // 5 动态修改雷达材质中的offset变量，从而实现动态效果。 
        this.viewer.scene.preUpdate.addEventListener(function() {
            var offset = radar.appearance.material.uniforms.offset;
            offset -= 0.015;
            if (offset > 1.0) {
                offset = 0.0;
            }
            radar.appearance.material.uniforms.offset = offset;
        });
    },

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;