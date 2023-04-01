 //扫描圆材质
 function ScanCircleMaterialProperty(color) {
     this._definitionChanged = new Cesium.Event();
     this._color = undefined;
     this._colorSubscription = undefined;
     this.color = color;
 }
 Object.defineProperties(ScanCircleMaterialProperty.prototype, {
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
 ScanCircleMaterialProperty.prototype.getType = function(time) {
     return 'ScanCircle';
 }
 ScanCircleMaterialProperty.prototype.getValue = function(time, result) {
     if (!Cesium.defined(result)) {
         result = {};
     }
     result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
     result.image = Cesium.Material.ScanCircleImage;
     return result;
 }
 ScanCircleMaterialProperty.prototype.equals = function(other) {
     return this === other ||
         (other instanceof ScanCircleMaterialProperty &&
             Cesium.Property.equals(this._color, other._color))
 }
 Cesium.ScanCircleMaterialProperty = ScanCircleMaterialProperty;
 Cesium.Material.ScanCircleType = 'ScanCircle';
 Cesium.Material.ScanCircleImage = '../../static/images/effects/scancircle.png';
 Cesium.Material.ScanCircleSource =
     "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
{\n\
     czm_material material = czm_getDefaultMaterial(materialInput);\n\
     vec2 st = materialInput.st;\n\
     vec4 colorImage = texture2D(image,  vec2(st ));\n\
     material.alpha = colorImage.a * color.a;\n\
     material.diffuse =  1.5* color.rgb  ;\n\
     return material;\n\
 }";

 Cesium.Material._materialCache.addMaterial(Cesium.Material.ScanCircleType, {
     fabric: {
         type: Cesium.Material.ScanCircleType,
         uniforms: {
             color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
             image: Cesium.Material.ScanCircleImage,
             time: 0
         },
         source: Cesium.Material.ScanCircleSource
     },
     translucent: function(material) {
         return true;
     }
 });