// 路由配置 
import items from "./category"

let rs = [];
let index = 1;
items.forEach(item => {
    // console.log(item.categoryName);
    item.items.forEach(i => {
        i.index = index;
        rs.push(i);
        console.log(index + "." + i.meta.title)
        index++;
    })
})
let routes = rs;
export default routes;