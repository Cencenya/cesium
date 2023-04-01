// 粒子系统标绘类  
export default class ParticlePlotBase {
    constructor(viewer, geoFeature) {
        this.viewer = viewer;
        this.properties = geoFeature.properties;
        this.coordinates = geoFeature.geometry.coordinates; //[x,y,z]

        this.properties.plotBase = "Particle";

        this.style = this.properties.style;
        this.position = Cesium.Cartesian3.fromDegrees(this.coordinates[0], this.coordinates[1], this.coordinates[2]);
    }



    setSelected(isSelected) {

    }

    toGeoJson() {
        return {
            type: "Feature",
            properties: this.properties,
            geometry: {
                type: "Point",
                coordinates: this.coordinates
            }
        };
    }
}