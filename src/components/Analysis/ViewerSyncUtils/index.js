export default class ViewerSyncUtils {
    constructor(viewer1, viewer2) {
        this.viewer1 = viewer1;
        this.viewer2 = viewer2;
        this.focusIndex = 0;
    }

    //同步或者取消同步
    sync(isSync) {
        this.isSync = isSync;
        if (isSync) {
            this.startSync();
        } else {
            this.cancelSync();
        }
    }

    startSync() {
        this.viewer1.scene.postRender.addEventListener(this.syncVEventHandle, this);
        //为容器1注册鼠标移入事件
        let _this = this;
        this.viewer1.container.onmouseenter = e => {
                _this.focusIndex = 0;
            }
            //为容器2注册鼠标移入事件
        _this.viewer2.container.onmouseenter = e => {
            _this.focusIndex = 1;
        }
    }

    cancelSync() {
        this.viewer1.container.onmouseenter = undefined;
        this.viewer2.container.onmouseenter = undefined;
        this.viewer1.scene.postRender.removeEventListener(this.syncVEventHandle, this);
    }

    syncVEventHandle() {
        if (!this.isSync) return;
        if (this.focusIndex == 0) {
            this.syncV2ToV1();
        } else {
            this.syncV1ToV2();
        }
    }

    //同步viewer2到viewer1
    syncV2ToV1() {
        this.viewer2.camera.setView({
            destination: this.viewer1.camera.position,
            orientation: {
                direction: this.viewer1.camera._direction,
                up: this.viewer1.camera.up,
                heading: this.viewer1.camera.heading,
                pitch: this.viewer1.camera.pitch,
                roll: this.viewer1.camera.roll
            }
        });
    }

    //同步viewer2到viewer1
    syncV1ToV2() {
        this.viewer1.camera.setView({
            destination: this.viewer2.camera.position,
            orientation: {
                direction: this.viewer2.camera._direction,
                up: this.viewer2.camera.up,
                heading: this.viewer2.camera.heading,
                pitch: this.viewer2.camera.pitch,
                roll: this.viewer2.camera.roll
            }
        });
    }
}