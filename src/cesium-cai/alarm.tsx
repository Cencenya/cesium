const Cesium = window['Cesium'];
export const setAlarm = (
  viewer: any,
  cartographicCenter: any,
  maxRadius: number,
  scanColor: any,
  duration: number
) => {
  var ScanSegmentShader =
    `uniform sampler2D colorTexture;
        uniform sampler2D depthTexture;
        varying vec2 v_textureCoordinates;
        uniform vec4 u_scanCenterEC;
        uniform vec3 u_scanPlaneNormalEC;
        uniform float u_radius;
        uniform vec4 u_scanColor;
        vec4 toEye(in vec2 uv, in float depth)
        {
            vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));
            vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);
            posInCamera =posInCamera / posInCamera.w;
            return posInCamera;
        }
        vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)
        {
            vec3 v01 = point -planeOrigin;
            float d = dot(planeNormal, v01) ;
            return (point - planeNormal * d);
        }
        float getDepth(in vec4 depth)
        {
            float z_window = czm_unpackDepth(depth);
            z_window = czm_reverseLogDepth(z_window);
            float n_range = czm_depthRange.near;
            float f_range = czm_depthRange.far;
            return (2.0 * z_window - n_range - f_range) / (f_range - n_range);
        }
        void main()
        {
            gl_FragColor = texture2D(colorTexture, v_textureCoordinates);
            float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));
            vec4 viewPos = toEye(v_textureCoordinates, depth);
            vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);
            float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);
            if(dis < u_radius)
            {
                float f = 1.0 -abs(u_radius - dis) / u_radius;
                f = pow(f, 4.0);
                gl_FragColor = mix(gl_FragColor, u_scanColor, f);
            }
        }`;

  var _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
  var _Cartesian4Center = new Cesium.Cartesian4(
    _Cartesian3Center.x,
    _Cartesian3Center.y,
    _Cartesian3Center.z,
    1
  );
  var _CartographicCenter1 = new Cesium.Cartographic(
    cartographicCenter.longitude,
    cartographicCenter.latitude,
    cartographicCenter.height + 500
  );
  var _Cartesian3Center1 = Cesium.Cartographic.toCartesian(
    _CartographicCenter1
  );
  var _Cartesian4Center1 = new Cesium.Cartesian4(
    _Cartesian3Center1.x,
    _Cartesian3Center1.y,
    _Cartesian3Center1.z,
    1
  );
  var _time = new Date().getTime();
  var _scratchCartesian4Center = new Cesium.Cartesian4();
  var _scratchCartesian4Center1 = new Cesium.Cartesian4();
  var _scratchCartesian3Normal = new Cesium.Cartesian3();
  var ScanPostStage = new Cesium.PostProcessStage({
    fragmentShader: ScanSegmentShader,
    uniforms: {
      u_scanCenterEC: function () {
        return Cesium.Matrix4.multiplyByVector(
          viewer.camera._viewMatrix,
          _Cartesian4Center,
          _scratchCartesian4Center
        );
      },
      u_scanPlaneNormalEC: function () {
        var temp = Cesium.Matrix4.multiplyByVector(
          viewer.camera._viewMatrix,
          _Cartesian4Center,
          _scratchCartesian4Center
        );
        var temp1 = Cesium.Matrix4.multiplyByVector(
          viewer.camera._viewMatrix,
          _Cartesian4Center1,
          _scratchCartesian4Center1
        );
        _scratchCartesian3Normal.x = temp1.x - temp.x;
        _scratchCartesian3Normal.y = temp1.y - temp.y;
        _scratchCartesian3Normal.z = temp1.z - temp.z;
        Cesium.Cartesian3.normalize(
          _scratchCartesian3Normal,
          _scratchCartesian3Normal
        );
        return _scratchCartesian3Normal;
      },
      u_radius: function () {
        return (
          (maxRadius * ((new Date().getTime() - _time) % duration)) / duration
        );
      },
      u_scanColor: scanColor,
    },
  });
  viewer.scene.postProcessStages.add(ScanPostStage);
  // return ScanPostStage;
};