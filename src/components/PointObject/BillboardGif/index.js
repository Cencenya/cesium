import SuperGif from "../../../../static/lib/libgif"

export default class BillboardGif {
    constructor(viewer, position, gifUrl) {
        this.viewer = viewer;
        this.position = position;

        let img = document.createElement("img");
        img.src = gifUrl;
        img.onload = () => {
            this.loadGif(img);
        }
    }

    loadGif(img) {
        this.superGif = new SuperGif({
            gif: img
        });

        this.superGif.load(() => {
            this.billboardEntity = this.viewer.entities.add({
                position: this.position,
                billboard: {
                    image: new Cesium.CallbackProperty(() => {
                        return this.superGif.get_canvas().toDataURL("image/png");
                    }, false),
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                    scaleByDistance: new Cesium.NearFarScalar(500, 1.0, 2000, 0.1)
                }
            });
        });
    }

    remove() {
        this.viewer.entities.remove(this.billboardEntity);
    }

}