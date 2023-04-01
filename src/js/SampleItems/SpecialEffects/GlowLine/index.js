// 光晕线实例
let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.setView();
        this.loadBuildData();
        this.loadLines();
        this.loadHelius();
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
        // 亮度设置
        var stages = this.viewer.scene.postProcessStages;
        this.viewer.scene.brightness = this.viewer.scene.brightness || stages.add(Cesium.PostProcessStageLibrary.createBrightnessStage());
        this.viewer.scene.brightness.enabled = true;
        this.viewer.scene.brightness.uniforms.brightness = 2;

        //是否开启抗锯齿
        this.viewer.scene.fxaa = true;
        this.viewer.scene.postProcessStages.fxaa.enabled = true;
    },

    //加载建筑物数据
    loadBuildData() {
        let tileset = this.viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url: "http://data.marsgis.cn/3dtiles/jzw-chengdu-gcj/tileset.json" // "http://oss-data.marsgis.cn/3dtiles/jzw-chengdu-gcj/tileset.json" //引用火星科技数据
        }));
        tileset.readyPromise.then((tileset) => {
            this.setTilesetHeight(tileset);
            tileset.tileVisible.addEventListener(function(tile) {
                var content = tile.content;
                var featuresLength = content.featuresLength;
                for (var i = 0; i < featuresLength; i += 2) {
                    let feature = content.getFeature(i)
                    let model = feature.content._model

                    if (model && model._sourcePrograms && model._rendererResources) {
                        Object.keys(model._sourcePrograms).forEach(key => {
                            let program = model._sourcePrograms[key]
                            model._rendererResources.sourceShaders[program.fragmentShader] =
                                `varying vec3 v_positionEC;
                              void main(void){
                                  vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
                                  float glowRange = 100.0; // 光环的移动范围(高度)
                                  gl_FragColor = vec4(0.2,  0.5, 1.0, 1.0); // 颜色
                                  gl_FragColor *= vec4(vec3(position.z / 100.0), 1.0); // 渐变
                                  // 动态光环
                                  float time = fract(czm_frameNumber / 360.0);
                                  time = abs(time - 0.5) * 2.0;
                                  float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
                                  gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
                              }
                             `
                        })
                        model._shouldRegenerateShaders = true
                    }
                }
            });
        }).otherwise(function(error) {
            console.error(error);
        });
    },

    //设置模型的高度 否则飘在空中
    setTilesetHeight(tileset) {
        var cartographic = Cesium.Cartographic.fromCartesian(
            tileset.boundingSphere.center
        );
        var surface = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            0
        );
        var offset = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude, -500
        );
        var translation = Cesium.Cartesian3.subtract(
            offset,
            surface,
            new Cesium.Cartesian3()
        );
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    },

    //加载线数据
    loadLines() {
        var promise = Cesium.GeoJsonDataSource.load('../static/data/chendu-daolu.json');
        promise.then((dataSource) => {
            this.viewer.dataSources.add(dataSource);
            let values = dataSource.entities.values;

            for (var i = 0; i < values.length; i++) {
                var line = values[i];
                line.polyline.material = new Cesium.PolylineGlowMaterialProperty({ //设置Glow材质
                    glowPower: 0.06,
                    color: Cesium.Color.ORANGERED.withAlpha(0.9)
                });
                line.polyline.width = 12;
            }
        }).otherwise(function(error) {
            console.log(error)
        });
    },

    //添加水体数据
    loadHelius() {
        //创建水体材质
        var waterMaterial = new Cesium.Material({
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

        fetch("../static/data/chendu-heliu.json").then(res => {
            return res.json();
        }).then(res => {
            let features = res.features;
            let coordinates, positions;
            features.map(feature => {
                coordinates = feature.geometry.coordinates[0];
                positions = this.coordinatesToPositions(coordinates);
                this.addHeliu(positions, waterMaterial);
            })
        })
    },

    //添加一条河流
    addHeliu(positions, material) {
        //创建水体geometry
        var polygon = new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(positions),
            vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
        });
        var primitive = new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: polygon
            }),
            appearance: new Cesium.EllipsoidSurfaceAppearance({
                aboveGround: true
            }),
            show: true
        });

        primitive.appearance.material = material;
        this.viewer.scene.primitives.add(primitive); //添加到场景 
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
                x: -1337790.7881094853,
                y: 5330396.094162445,
                z: 3231621.5380446212
            },
            orientation: {
                heading: 6.010538181825211,
                pitch: -0.6819480997380261,
                roll: 6.282163306739159,
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