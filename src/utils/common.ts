export const vh = (px) => (px / 1080) * 100 + "vh";
export const vw = (px) => (px / 1920) * 100 + "vw";
export const fontChart = (font) => {
  let clientwidth = window.innerWidth 
  || document.documentElement.clientWidth
  || document.body.clientWidth;
  console.log(clientwidth);
  
  if(!clientwidth) return ;
  let fontsize = 100 *(clientwidth / 3200);
  console.log(fontsize);
  
  return font * fontsize
}