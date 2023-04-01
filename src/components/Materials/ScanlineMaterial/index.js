//扫描线材质 
function ScanlineMaterialProperty(color, speed) {
    this._definitionChanged = new Cesium.Event();
    this.color = color || Cesium.Color.YELLOW;
    this.speed = speed || 10;
}
Object.defineProperties(ScanlineMaterialProperty.prototype, {
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
ScanlineMaterialProperty.prototype.getType = function(time) {
    return 'Scanline';
}
ScanlineMaterialProperty.prototype.getValue = function(time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this.color, time, Cesium.Color.WHITE, result.color);
    result.speed = this.speed;
    return result;
}
ScanlineMaterialProperty.prototype.equals = function(other) {
    return this === other ||
        (other instanceof ScanlineMaterialProperty &&
            Cesium.Property.equals(this.color, other.color) &&
            Cesium.Property.equals(this.speed, other.speed))
}
Cesium.ScanlineMaterialProperty = ScanlineMaterialProperty;
Cesium.Material.ScanlineType = 'Scanline';
Cesium.Material.ScanlineSource =
    `uniform vec4 color;
uniform float speed;
float circle(vec2 uv, float r, float blur) {
  float d = length(uv) * 2.0;
  float c = smoothstep(r+blur, r, d);
  return c;
}
czm_material czm_getMaterial(czm_materialInput materialInput)
{
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st - 0.5;
  material.diffuse =2.8 * color.rgb;
  material.emission = vec3(0);
  float t =fract(czm_frameNumber * speed / 1000.0);
  float s = 0.3;
  float radius1 = smoothstep(.0, s, t) * 0.5;
  float alpha1 = circle(st, radius1, 0.01) * circle(st, radius1, -0.01);
  float alpha2 = circle(st, radius1, 0.01 - radius1) * circle(st, radius1, 0.01);
  float radius2 = 0.5 + smoothstep(s, 1.0, t) * 0.5;
  float alpha3 = circle(st, radius1, radius2 + 0.01 - radius1) * circle(st, radius1, -0.01);
  material.alpha = smoothstep(1.0, s, t) * (alpha1 + alpha2*0.1 + alpha3*0.1);
  material.alpha *=color.a ;
  return material;
} `;

Cesium.Material._materialCache.addMaterial(Cesium.Material.ScanlineType, {
    fabric: {
        type: Cesium.Material.ScanlineType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
            time: 0,
            speed: 10,
        },
        source: Cesium.Material.ScanlineSource
    },
    translucent: function(material) {
        return true;
    }
});