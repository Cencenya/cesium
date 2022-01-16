import { viewer, Cesium } from "./create";
import img from '../assets/image/strmingLine.png';
// import PolylineTrailMaterialProperty from './PolylineTrailMaterialProperty '

export const flyPath = () => {

  // 计算抛物线
  function parabolaEquation(options: any, resultOut?: any) {
    //方程 y=-(4h/L^2)*x^2+h h:顶点高度 L：横纵间距较大者
    // let h = options.height && options.height > 5000 ? options.height : 1000;
    // 抛物线高度由用户输入设置
    let h = options.height
    // math.abs() 函数返回指定数字 “x“ 的绝对值
    let L = Math.abs(options.pt1.lon - options.pt2.lon) > Math.abs(options.pt1.lat - options.pt2.lat) ? Math.abs(options.pt1.lon - options.pt2.lon) : Math.abs(options.pt1.lat - options.pt2.lat);
    // 细分顶点 点越多则越平滑
    // let num = options.num && options.num > 50 ? options.num : 100;
    // 由参数传入
    let num = options.num
    let result = [];
    // 细分率
    let dlt = L / num;
    if (Math.abs(options.pt1.lon - options.pt2.lon) > Math.abs(options.pt1.lat - options.pt2.lat)) {//以lon为基准
      let delLat = (options.pt2.lat - options.pt1.lat) / num;
      // 如果起始位置的经纬度大于结束位置的经纬度 则起始位置到结束位置的坐标属于负增长 将细分率取反
      if (options.pt1.lon - options.pt2.lon > 0) {
        dlt = -dlt;
      }
      for (let i = 0; i < num; i++) {
        //Math.pow() 函数返回基数（base）的指数（exponent）次幂，即 baseexponent 
        let tempH = h - Math.pow((-0.5 * L + Math.abs(dlt) * i), 2) * 4 * h / Math.pow(L, 2);
        let lon = options.pt1.lon + dlt * i;
        let lat = options.pt1.lat + delLat * i;
        result.push([lon, lat, tempH]);
      }
    } else {//以lat为基准
      let delLon = (options.pt2.lon - options.pt1.lon) / num;
      if (options.pt1.lat - options.pt2.lat > 0) {
        dlt = -dlt;
      }
      for (let i = 0; i < num; i++) {
        let tempH = h - Math.pow((-0.5 * L + Math.abs(dlt) * i), 2) * 4 * h / Math.pow(L, 2);
        let lon = options.pt1.lon + delLon * i;
        let lat = options.pt1.lat + dlt * i;
        result.push([lon, lat, tempH]);

      }
    }
    if (resultOut != undefined) {
      resultOut = result;
    }
    return result;
  }
  let mateial = new Cesium.CustomMaterialLine({
    image: img,
    color: Cesium.Color.LIGHTCORAL.withAlpha(0.8),
    duration: 30000
  })
  let center = { lon: 119.92288031584074, lat: 28.470939553526446 }
  let cities = [{ "lon": 119.91586283083622, "lat": 28.472368151655935 },
  { "lon": 119.91567398820665, "lat": 28.467127492661334 },
  { "lon": 119.92520396630458, "lat": 28.4648790616444 },
  { "lon": 119.9323990393223, "lat": 28.46762178674054 },
  { "lon": 119.93244999629187, "lat": 28.482715467576334 },
  { "lon": 119.93305538195578, "lat": 28.462685192557316 },
  { "lon": 119.91208783715726, "lat": 28.458615919184446 },
  { "lon": 119.91664524984556, "lat": 28.458349759734453 },
  { "lon": 119.91098278184678, "lat": 28.473228320776073 },
  ]


  for (let j = 0; j < cities.length; j++) {
    let points = parabolaEquation({ pt1: center, pt2: cities[j], height: 400, num: 100 });
    let pointArr = [];
    for (let i = 0; i < points.length; i++) {
      pointArr.push(points[i][0], points[i][1], points[i][2]);
    }
    viewer.entities.add({
      name: 'PolylineTrailLink' + j,
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(pointArr),
        width: 12,
        material: mateial
      }
    });
  }



  let r = 0,
    up = true
  const maxRadius = 100
  const minRadius = 20
  const step = 1

  function getRadius() {
    return new Cesium.CallbackProperty(function (time?: any, result?: any) {
      if (up) {
        r += step
      } else {
        r -= step
      }

      if (r >= maxRadius) {
        up = false
      }

      if (r <= minRadius) {
        up = true
      }
      return r
    }, false)
  }

  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(center.lon, center.lat, 1),
    ellipse: {
      semiMinorAxis: getRadius(),
      semiMajorAxis: getRadius(),
      material: new Cesium.ColorMaterialProperty(
        new Cesium.CallbackProperty(function (time?: any, result?: any) {
          return new Cesium.Color(64 / 255, 224 / 255, 208 / 255, 1 - r / maxRadius)
        })
      ),
      height: 10,
      outline: false
    }
  })

  // for (var i = 0; i < cities.length; i++) {
  //   viewer.entities.add({
  //     position: Cesium.Cartesian3.fromDegrees(cities[i].lon, cities[i].lat, 1),
  //     ellipse: {
  //       semiMinorAxis: getRadius(),
  //       semiMajorAxis: getRadius(),
  //       material: new Cesium.ColorMaterialProperty(
  //         new Cesium.CallbackProperty(function (time?: any, result?: any) {
  //           return new Cesium.Color(0, 191 / 255, 1, 1 - r / maxRadius)
  //         })
  //       ),
  //       height: 10,
  //       outline: false
  //     }
  //   });
  // }



}