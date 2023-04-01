//生成材质图片（上下运动）
export function getTexture() {
    let color = "#ffffff"; //白色
    let canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 1;
    let ctx = canvas.getContext('2d');
    let grd = ctx.createLinearGradient(100, 0, 0, 1);

    //第一个渐变色
    let cColor = Cesium.Color.fromCssColorString(color);
    color = cColor.withAlpha(0.8).toCssColorString();
    grd.addColorStop(0, color);

    //第二个渐变色
    color = cColor.withAlpha(0.2).toCssColorString();
    grd.addColorStop(0.2, color);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 100, 1);
    return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}

//条纹升腾
export function getTexture1() {
    let color = "#ffffff"; //白色
    let canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 20;
    let ctx = canvas.getContext('2d');
    let grd = ctx.createLinearGradient(100, 0, 0, 20);

    //第一个渐变色
    let cColor = Cesium.Color.fromCssColorString(color);
    color = cColor.withAlpha(0.2).toCssColorString();
    grd.addColorStop(0, color);

    //第二个渐变色
    color = cColor.withAlpha(0.8).toCssColorString();
    grd.addColorStop(0.5, color);

    //第三个渐变色
    color = cColor.withAlpha(0.8).toCssColorString();
    grd.addColorStop(0.6, color);

    //第四个渐变色
    color = cColor.withAlpha(0.2).toCssColorString();
    grd.addColorStop(1, color);


    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 100, 20);
    return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}

//左右循环  
export function getTexture2() {
    let color = "#ffffff"; //白色
    let canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    let ctx = canvas.getContext('2d');

    var grd = ctx.createRadialGradient(50, 50, 5, 50, 50, 50);

    //第一个渐变色
    let cColor = Cesium.Color.fromCssColorString(color);
    color = cColor.withAlpha(0.6).toCssColorString();
    grd.addColorStop(0, color);

    //第二个渐变色
    color = cColor.withAlpha(0.1).toCssColorString();
    grd.addColorStop(1, color);

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 100, 100);

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 100, 100);
    return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
}