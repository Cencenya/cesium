// 双屏对比实例 
let cesiumInit = {
    initViewer1(el) {
        this.viewer1 = new Cesium.Viewer(el, {
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
                url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            })
        });
        this.viewer1._cesiumWidget._creditContainer.style.display = "none";
    },

    initViewer2(el) {
        this.viewer2 = new Cesium.Viewer(el, {
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
                url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            })
        });
        this.viewer2._cesiumWidget._creditContainer.style.display = "none";
    },


    setView() {
        let flyToOpts = {
            destination: {
                x: -2326807.2136660465,
                y: 5413668.646918782,
                z: 2452674.5745521043
            },
            orientation: {
                heading: 6.28318530717951,
                pitch: -1.5695650255332203,
                roll: 0
            },
            duration: 1
        };
        this.viewer1.scene.camera.flyTo(flyToOpts);
        this.viewer2.scene.camera.flyTo(flyToOpts);
    },

    destroy() {
        this.viewer1.entities.removeAll();
        this.viewer1.imageryLayers.removeAll(true);
        this.viewer1.destroy();

        this.viewer2.entities.removeAll();
        this.viewer2.imageryLayers.removeAll(true);
        this.viewer2.destroy();
    },
}
export default cesiumInit;