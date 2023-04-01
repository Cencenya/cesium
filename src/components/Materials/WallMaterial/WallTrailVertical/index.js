//  流动墙体材质类 垂直
//  color 颜色
//  duration 持续时间 毫秒 

function WallTrailVerticalMaterialProperty(color, duration) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
    this.duration = duration;
    this._time = (new Date()).getTime();
}
Object.defineProperties(WallTrailVerticalMaterialProperty.prototype, {
    isConstant: {
        get: function() {
            return false;
        }
    },
    definitionChanged: {
        get: function() {
            return this._definitionChanged;
        }
    },
    color: Cesium.createPropertyDescriptor('color')
});

WallTrailVerticalMaterialProperty.prototype.getType = function(time) {
    return 'WallTrailVertical';
}

WallTrailVerticalMaterialProperty.prototype.getValue = function(time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.image = Cesium.Material.WallTrailVerticalImage;
    result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
    return result;
}

WallTrailVerticalMaterialProperty.prototype.equals = function(other) {
    return this === other ||
        (other instanceof WallTrailVerticalMaterialProperty &&
            Cesium.Property.equals(this._color, other._color))
}
Cesium.WallTrailVerticalMaterialProperty = WallTrailVerticalMaterialProperty;
Cesium.Material.WallTrailVerticalType = 'WallTrailVertical';
Cesium.Material.WallTrailVerticalImage = "data:image/octet-stream;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAABCAYAAAAo2wu9AAAAOklEQVQoU2P8//+/McMoIDsEfv/+zcLKysrOwMDAAcVg9t+/fzmYmZkxxP/9+8fBxMSEIc7AwAAWAwD/kwzHVTmPqQAAAABJRU5ErkJggg==";
Cesium.Material.WallTrailVerticalSource =
    "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
 {\n\
      czm_material material = czm_getDefaultMaterial(materialInput);\n\
      vec2 st = materialInput.st;\n\
      vec4 colorImage = texture2D(image, vec2(fract(st.t - time), st.t));\n\
      material.alpha = colorImage.a * color.a;\n\
      material.diffuse =  1.5* color.rgb  ;\n\
      return material;\n\
  }";

Cesium.Material._materialCache.addMaterial(Cesium.Material.WallTrailVerticalType, {
    fabric: {
        type: Cesium.Material.WallTrailVerticalType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
            image: Cesium.Material.WallTrailVerticalImage,
            time: 0
        },
        source: Cesium.Material.WallTrailVerticalSource
    },
    translucent: function(material) {
        return true;
    }
});