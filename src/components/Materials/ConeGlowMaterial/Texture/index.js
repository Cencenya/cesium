 //底部圆材质图片
 export function createBottomCircleTexture() {
     let canvas = document.createElement('canvas');
     canvas.width = 512;
     canvas.height = 512;
     let ctx = canvas.getContext('2d');

     let gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
     gradient.addColorStop(0.1, "rgba(255, 255, 255, 1.0)");
     gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.0)");
     gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.9)");
     gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.0)");
     gradient.addColorStop(0.9, "rgba(255, 255, 255, 0.2)");
     gradient.addColorStop(1.0, "rgba(255, 255, 255, 1.0)");

     ctx.clearRect(0, 0, 512, 512);
     ctx.beginPath();
     ctx.arc(256, 256, 256, 0, Math.PI * 2, true);
     //ctx.fillStyle = "rgb(0, 155, 255)";
     ctx.fillStyle = gradient;
     ctx.fill();
     ctx.restore();
     return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
 }

 //底部运动圆材质图片
 export function createBottomRotateCircleTexture() {
     let canvas = document.createElement('canvas');
     canvas.width = 512;
     canvas.height = 512;
     let ctx = canvas.getContext('2d');
     ctx.clearRect(0, 0, 512, 512);
     ctx.strokeStyle = "rgb(255, 255, 0)";
     ctx.setLineDash([80, 80]);
     ctx.lineWidth = 30;
     ctx.arc(256, 256, 241, 0, Math.PI * 2, true);
     ctx.stroke();
     return canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
 }