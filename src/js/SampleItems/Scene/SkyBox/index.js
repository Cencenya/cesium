//自定义天空盒
import appConfig from "@/js/appConfig"
import "@/components/Scene/SkyBoxOnGround"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.load3dtiles();
        this.initSkyBox();
        this.viewer.scene.skyBox = this.farSkyBox;

        //如果高度小于某个值 显示近景天空盒 否则显示远景天空盒
        this.viewer.scene.postRender.addEventListener(() => {
            let p = this.viewer.camera.position
            if (Cesium.Cartographic.fromCartesian(p).height < 2500) {
                this.viewer.scene.skyBox = this.groundSkyBox;
            } else {
                this.viewer.scene.skyBox = this.farSkyBox;
            }
        })
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
            skyAtmosphere: false, //关闭地球光环
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: appConfig.imageryProvider
            }),
        });
        this.viewer.scene.globe.depthTestAgainstTerrain = true;
        this.viewer._cesiumWidget._creditContainer.style.display = "none";
    },

    //改变天空盒
    changeSkyBox(index) {
        let flyToOpts = {
            destination: {
                x: -1573556.399109955,
                y: 5327839.961767385,
                z: 3123210.094581469
            },
            orientation: {
                heading: 2.8892116353659993,
                pitch: -0.1270872675001098,
                roll: 0.000723327810702834
            }
        };
        this.viewer.scene.camera.flyTo(flyToOpts);
        this.viewer.scene.skyBox = this.groundSkyBox = this.groundSkyBoxs[index];
    },

    //初始化天空盒
    initSkyBox() {
        this.farSkyBox = new Cesium.SkyBox({ //远景天空盒
            sources: {
                positiveX: "../../static/images/skybox/04/px.jpg",
                positiveY: "../../static/images/skybox/04/py.jpg",
                positiveZ: "../../static/images/skybox/04/pz.jpg",
                negativeX: "../../static/images/skybox/04/nx.jpg",
                negativeY: "../../static/images/skybox/04/ny.jpg",
                negativeZ: "../../static/images/skybox/04/nz.jpg"
            }
        });

        //根据需要选择
        this.groundSkyBoxs = [];
        //近景天空盒
        let groundSkyBox1 = new Cesium.GroundSkyBox({
            sources: {
                positiveX: "../../static/images/skybox/01/px.png",
                negativeX: "../../static/images/skybox/01/nx.png",
                positiveY: "../../static/images/skybox/01/py.png",
                negativeY: "../../static/images/skybox/01/ny.png",
                positiveZ: "../../static/images/skybox/01/pz.png",
                negativeZ: "../../static/images/skybox/01/nz.png"
            }
        });
        this.groundSkyBoxs.push(groundSkyBox1);
        this.groundSkyBox = groundSkyBox1;

        let groundSkyBox2 = new Cesium.GroundSkyBox({
            sources: {
                positiveX: "../../static/images/skybox/02/px.jpg",
                positiveY: "../../static/images/skybox/02/py.jpg",
                positiveZ: "../../static/images/skybox/02/pz.jpg",
                negativeX: "../../static/images/skybox/02/nx.jpg",
                negativeY: "../../static/images/skybox/02/ny.jpg",
                negativeZ: "../../static/images/skybox/02/nz.jpg"
            }
        });
        this.groundSkyBoxs.push(groundSkyBox2);

        let groundSkyBox3 = new Cesium.GroundSkyBox({
            sources: {
                positiveX: "../../static/images/skybox/03/px.jpg",
                positiveY: "../../static/images/skybox/03/py.jpg",
                positiveZ: "../../static/images/skybox/03/pz.jpg",
                negativeX: "../../static/images/skybox/03/nx.jpg",
                negativeY: "../../static/images/skybox/03/ny.jpg",
                negativeZ: "../../static/images/skybox/03/nz.jpg"
            }
        });
        this.groundSkyBoxs.push(groundSkyBox3);
    },

    //飞到远处看到远景天空盒
    flyToHome() {
        let flyToOpts = {
            destination: {
                x: -45802988.9566341,
                y: -41512897.1313383,
                z: 42860387.48041018
            },
            orientation: {
                heading: 1.2536256744910776,
                pitch: -1.49857771791951,
                roll: 0.03727351623405806
            }
        };
        this.viewer.scene.camera.flyTo(flyToOpts);
    },

    //加载3dtiles数据
    load3dtiles() {
        let tileset = this.viewer.scene.primitives.add(
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
        let cartographic = Cesium.Cartographic.fromCartesian(
            tileset.boundingSphere.center
        );
        let surface = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            cartographic.height
        );
        let offset = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude, 55
        );
        let translation = Cesium.Cartesian3.subtract(
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