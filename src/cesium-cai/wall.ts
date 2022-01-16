import { viewer, Cesium } from "./create";
// 隔离墙体
export const Wall = (positions: any) => {
  let alp = 1;
  let num = 0;
  //绘制墙
  viewer.entities.add({
    name: "动态立体墙",
    wall: {
      show: true,
      positions: positions,
      material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.CRIMSON, 3000),
      // material: new Cesium.ImageMaterialProperty({
      //   image: `${process.env.PUBLIC_URL}/red.png`,
      //   transparent: true,
      //   color: new Cesium.CallbackProperty(function () {
      //     if ((num % 2) === 0) {
      //       alp -= 0.005;
      //     } else {
      //       alp += 0.005;
      //     }

      //     if (alp <= 0.3) {
      //       num++;
      //     } else if (alp >= 1) {
      //       num++;
      //     }
      //     return Cesium.Color.WHITE.withAlpha(alp)
      //     //entity的颜色透明 并不影响材质，并且 entity也会透明
      //   }, false)
      // })
    }

  })
}