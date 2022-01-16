import { viewer, Cesium } from "./create";

export const boundaryLine = (id, lon: number, lat: number, height: number, img) => {
  viewer.entities.add({
    id,
    position: Cesium.Cartesian3.fromDegrees(lon, lat, height),
    polyline: {//竖线
      show: true,
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        lon, lat, 0,
        lon, lat, height
      ]),
      width: 10,
      material: new Cesium.CustomMaterialLine({
        image: img,
        color: Cesium.Color.PLUM.withAlpha(0.8),
        duration: 10000
      }),
    },
  })
}