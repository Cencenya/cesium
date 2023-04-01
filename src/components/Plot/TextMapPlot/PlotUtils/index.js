export function drawText(style) {
    const text = style.text;
    var c = document.createElement("canvas");
    const d = (text + "").length * style.fontSize;
    c.width = d;
    c.height = style.fontSize;
    var ctx = c.getContext("2d");

    ctx.fillStyle = style.color;
    ctx.font = "bold " + style.fontSize + "px 微软雅黑"; //设置字体
    ctx.textBaseline = 'hanging'; //在绘制文本时使用的当前文本基线 
    //绘制文本  
    ctx.fillText(text, 0, 0);
    return c;
}

export function point3dsToPoint2ds(point2d, height) {
    return Cesium.Cartesian3.fromDegrees(point2d[0], point2d[1], height);
}