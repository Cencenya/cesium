import { viewer, Cesium } from "./create";
// const configJson = require('../data/lishui111/tileset.json')
export const setTiles = () => {
  var tileset = new Cesium.Cesium3DTileset({
    name: "building",
    url: `${process.env.PUBLIC_URL}/data/lishui111/tileset.json`,
  });
  const _fragmentShader = `
      varying vec3 v_positionEC;
      void main(void){
          vec4 position = czm_inverseModelView * vec4(v_positionEC,1); // 位置
          float glowRange = 60.0; // 光环的移动范围(高度)
          gl_FragColor = vec4(0.2,  0.5, 1.0, 1.0); // 颜色
          gl_FragColor *= vec4(vec3(position.z / 30.0), 1.0); // 渐变
          // 动态光环
          float time = fract(czm_frameNumber / 360.0);  //  fract(x)  === x-floor(x) 取小数点位置
          time = abs(time - 0.5) * 2.0;
          float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
          //  clamp(x,minVal,maxVal) ==  min(max(x,minVal),maxVal)
          gl_FragColor.rgb += gl_FragColor.rgb * (1.0 - diff);
      }`;
  const _vertexShader = `
       void main(){
         vec4 position = czm_inverseModelView * vec4(v_positionEC,1);
         vertexColor = vec4(0.5f, 0.0f, 0.0f, 1.0f);
       }
  `
  tileset.tileVisible.addEventListener(function (tile: { content: any; }) {
    var content = tile.content;
    var featuresLength = content.featuresLength;
    for (var i = 0; i < featuresLength; i++) {
      let feature = content.getFeature(i)
      let model = feature.content._model
      if (
        _fragmentShader &&
        model &&
        model._sourcePrograms &&
        model._rendererResources
      ) {
        Object.keys(model._sourcePrograms).forEach(key => {
          // console.log(model._sourcePrograms);
          let program = model._sourcePrograms[key]
          model._rendererResources.sourceShaders[
            program.fragmentShader
          ] = _fragmentShader
        })
        model._shouldRegenerateShaders = true
      }
    }
  });
  tileset.readyPromise
    .then((tileset: any) => {
      viewer.scene.primitives.add(tileset);
      const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center);
      const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
      const offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 55);
      const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
      // const translation = Cesium.Cartesian3.fromArray([0, 0, 0]);
      const m = Cesium.Matrix4.fromTranslation(translation);
      tileset.modelMatrix = m;
      viewer.zoomTo(
        tileset,
        new Cesium.HeadingPitchRange(
          0.0,
          -0.5,
          tileset.boundingSphere.radius * 2.0
        )
      );
      tileset.style = new Cesium.Cesium3DTileStyle({
        color: {
          conditions: [["true", "rgba(135,206,250,1)"]],
        },
      });
    })
    .otherwise(function (error: any) {
      console.log(error);
    });
  viewer.scene.primitives.add(tileset);
};