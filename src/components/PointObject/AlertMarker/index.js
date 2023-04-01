// 闪烁点
//author:https://blog.csdn.net/xietao20/article/details/108457857
export default class AlertMarker {
    constructor(options) {
        this.viewer = options.viewer;
        this.position = options.position;
        this.color = options.color || Cesium.Color.RED;
        this.iconUrl = options.iconUrl;
        this.pixelSize = options.pixelSize || 10;
        this.pixelMax = options.pixelMax || 50;
        this.outWidth = options.outWidth || 20;
        this.createMarker();
    }

    createMarker() {
        var markerOpacity = 1,
            a = true,
            pixelSize = this.pixelSize,
            n = true,
            outLineOpacity = .7,
            o = true,
            t = 0,
            pixelMax = this.pixelMax;
        this.markerEntity = this.viewer.entities.add({
            position: this.position
        })

        this.markerEntity.point = {
            color: new Cesium.CallbackProperty(() => {
                return a ? (markerOpacity -= .03,
                        markerOpacity <= 0 && (a = false)) : (markerOpacity = 1,
                        a = true),
                    this.color.withAlpha(markerOpacity)
            }, false),
            pixelSize: new Cesium.CallbackProperty((time, result) => {
                return n ? (pixelSize += 2,
                        pixelSize >= pixelMax && (n = false)) : (pixelSize = 10,
                        n = true),
                    pixelSize
            }, false),
            outlineColor: new Cesium.CallbackProperty(() => {
                return o ? (outLineOpacity -= .035,
                        outLineOpacity <= 0 && (o = false)) : (outLineOpacity = .7,
                        o = true),
                    this.color.withAlpha(outLineOpacity)
            }, false),
            outlineWidth: this.outWidth,
            scaleByDistance: new Cesium.NearFarScalar(1200, 1, 5200, 0.4),
        }

        if (this.iconUrl) {
            this.markerEntity.billboard = {
                image: this.iconUrl,
                scaleByDistance: new Cesium.NearFarScalar(1200, 1, 5200, 0.4), //设置随图缩放距离和比例
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000), //设置可见距离 10000米可见
            }
        }
    }

    remove() {
        this.viewer.entities.remove(this.markerEntity);
        this.markerEntity = undefined;
    }
}