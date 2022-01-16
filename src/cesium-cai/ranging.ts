import { viewer, Cesium } from "./create";


export const handleRanging = () => {
  // 声明三维对象
  let scene = viewer.scene;
  let globe = new Cesium.Globe
  // 开启点击事件
  viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
    // 开启深度检测
    globe.depthTestAgainstTerrain = true;

    viewer.render();
    let pickPosition = viewer.scene.pickPosition(movement.position);
    if (!pickPosition) {
      globe.depthTestAgainstTerrain = false;
      return;
    }

    let p = Cesium.Cartographic.fromCartesian(pickPosition);
    addPosition(pickPosition);

    globe.depthTestAgainstTerrain = false;
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  let positions: any[] = [];
  let lavels: any[] = [];
  let line: any;

  function caculDistance() {
    let dis = 0;
    for (let i = 1; i < positions.length; i++) {
      dis += Cesium.Cartesian3.distance(positions[i], positions[i - 1]);
    }

    return dis
  }

  function addPosition(pos: any) {
    positions.push(pos);



    if (positions.length >= 2) {
      if (!line) {

        line = viewer.entities.add({
          polyline: {
            positions: positions,
            width: 10.0,
            material: new Cesium.PolylineGlowMaterialProperty({
              color: Cesium.Color.DEEPSKYBLUE,
              glowPower: 0.25
            })
          }
        })
      } else {
        line.polyline.positions = positions;
      }
    }

    let distance = caculDistance();

    let label = viewer.entities.add({
      position: pos,
      point: {
        color: Cesium.Color.RED,
        pixelSize: 10,
        outlineColor: Cesium.Color.YELLOW,
        outlineWidth: 2
      },
      label: {
        heightReference: 2000,
        pixelOffset: new Cesium.Cartesian2(0, -80),
        show: true,
        showBackground: true,
        font: '14px monospace',
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        // pixelOffset: new Cesium.Cartesian2(15, 0),
        text: distance.toFixed(2) + '米'
      }
    });
  }

}

export const cancleRanging = () => {
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
}