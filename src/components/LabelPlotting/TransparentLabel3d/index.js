export default class TransparentLabel3d {
    constructor(viewer, position, label) {
        this.viewer = viewer;
        this.position = position;
        this.label = label;

        this.initDom();
        this.initEvent();
    }

    initDom() {
        this.$htmlContainer = document.createElement("div");
        this.$htmlContainer.innerHTML = this.label;
        this.$htmlContainer.style = "position:absolute;left:0px;bottom:0px;color:white;pointer-events: none"
        this.viewer.cesiumWidget.container.appendChild(this.$htmlContainer);
        this.viewer.scene.postRender.addEventListener(this.postRenderEvent, this);
    }

    initEvent() {
        this.viewer.scene.postRender.addEventListener(this.postRenderEventHandle, this);
    }

    postRenderEventHandle() {
        const canvasHeight = this.viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, this.position, windowPosition);
        this.$htmlContainer.style.bottom = canvasHeight - windowPosition.y + "px";
        const elWidth = this.$htmlContainer.offsetWidth;
        this.$htmlContainer.style.left = windowPosition.x - (elWidth / 2) + "px";

        const cameraPosition = this.viewer.camera.position;
        let height = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cameraPosition).height;
        let cameraHeight = height;
        height += this.viewer.scene.globe.ellipsoid.maximumRadius;
        if (!(Cesium.Cartesian3.distance(cameraPosition, this.position) > height)) {
            this.$htmlContainer.style.display = "block";
            if (cameraHeight < 23000000) {
                this.$htmlContainer.style.display = "block"
            } else {
                this.$htmlContainer.style.display = "none";
            }
        } else {
            this.$htmlContainer.style.display = "none";
        }
    }

    remove() {
        this.viewer.scene.postRender.removeEventListener(this.postRenderEventHandle, this);
    }
}