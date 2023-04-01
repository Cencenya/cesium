export default class SceneTooltip {
    constructor(viewer) {
        this.viewer = viewer;
        this.initEvent();
    }

    initEvent() {
        new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas).setInputAction(((e) => {
            let id = this.viewer.scene.pick(e.endPosition);
            if (!id || !id.id) {
                this.hide();
                return; // 没有拾取到对象 直接返回 不做任何操作
            }
            if (!id.id.tooltip) return;
            let pickPosition = this.viewer.scene.pickPosition(e.endPosition);
            if (!pickPosition) {
                pickPosition = this.viewer.scene.camera.pickEllipsoid(e.endPosition, this.viewer.scene.globe.ellipsoid);
            }
            if (!pickPosition) return;
            this.show(id.id.tooltip, pickPosition);
        }), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    }

    initDom() {
        this.$htmlContainer = document.createElement("div");
        this.$htmlContainer.classList.add("tooltip-container");
        this.viewer.cesiumWidget.container.appendChild(this.$htmlContainer);
    }

    show(tooltip, position) {
        if (!this.$htmlContainer) {
            this.initDom();
        }
        this.$htmlContainer.style.display = "block";
        this.$htmlContainer.innerHTML = tooltip;
        this.setPosition(position);
    }

    setPosition(position) {
        const canvasHeight = this.viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(this.viewer.scene, position, windowPosition);
        this.$htmlContainer.style.bottom = canvasHeight - windowPosition.y + 20 + "px";
        const elWidth = this.$htmlContainer.offsetWidth;
        this.$htmlContainer.style.left = windowPosition.x - (elWidth / 2) + "px";
    }

    hide() {
        if (!this.$htmlContainer) {
            return;
        }
        this.$htmlContainer.style.display = "none";
    }

    destory() {

    }
}