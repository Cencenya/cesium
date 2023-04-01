// 视频融合参数调整

import appConfig from "@/js/appConfig"
import EntityEdit from "@/components/CesiumTools/EntityEdit"

let cesiumInit = {
    init(el) {
        this.initViewer(el);
        this.initEdit();
        this.addVideoRegion();
        this.load3dtiles();
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
        this.viewer.scene.globe.depthTestAgainstTerrain = true; //默认为false
    },

    //初始化编辑
    initEdit() {
        this.edit = new EntityEdit(this.viewer);
        this.edit.activate();
        this.edit.EditEndEvent.addEventListener((result) => {
            console.log(result)
        })
    },

    //添加多边形
    addVideoRegion() {
        let positions = [
            { x: -1573799.2415401086, y: 5327922.240904413, z: 3122749.3887000578 }, { x: -1573794.3118143044, y: 5327921.335518321, z: 3122744.7344062133 }, { x: -1573809.8067735473, y: 5327924.73463202, z: 3122721.3949625622 }, { x: -1573812.9883513628, y: 5327922.442747317, z: 3122723.51010485 }, { x: -1573823.2090096928, y: 5327914.678773423, z: 3122733.0927493796 }, { x: -1573826.8395776816, y: 5327909.88053902, z: 3122736.798227939 }, { x: -1573825.432025198, y: 5327905.581082746, z: 3122744.4121885784 }, { x: -1573820.0546888283, y: 5327911.606606755, z: 3122745.6105908584 }, { x: -1573805.4179177827, y: 5327915.239309875, z: 3122763.8471152373 }
        ]
        this.videoRegionEntity = this.viewer.entities.add({
            Type: "EditablePolygon",
            polygon: {
                hierarchy: positions,
                material: document.getElementById("video"), // Cesium.Color.RED.withAlpha(0.4),
                perPositionHeight: true,
                stRotation: 0
            },
        })
    },

    //调整视频角度
    updateStRotation(value) {
        this.videoRegionEntity.polygon.stRotation = new Cesium.CallbackProperty(e => {
            return Cesium.Math.toRadians(value);
        }, false);
    },

    //获取坐标
    getPositions() {
        return this.videoRegionEntity.polygon.hierarchy;
    },

    //设置视角
    setView() {
        let flyToOpts = {
            destination: {
                x: -1573945.6641479672,
                y: 5328097.759567323,
                z: 3122663.665384485
            },
            orientation: {
                heading: 6.0339033541872675,
                pitch: -0.6157449486079702,
                roll: 6.2823150452131475
            },
            duration: 1
        };
        this.viewer.scene.camera.setView(flyToOpts);
    },

    //加载三维模型
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

    destroy() {
        this.viewer.entities.removeAll();
        this.viewer.imageryLayers.removeAll(true);
        this.viewer.destroy();
    },
}
export default cesiumInit;