import { lazy } from "react";
import Home from "../pages/home";
import Education from "../pages/education";
import Medical from "../pages/medical";
import Emergency from "../pages/emergency";
import Traffic from "../pages/traffic";
import Travel from "../pages/travel";
import Epidemic from "../pages/epidemic";

const routes = [
  {
    path: "/",
    exact: true,
    component: Home,
    title: "城市总览",
    icon: require("../assets/icon/city.svg").default,
    configPath: "./config/home.json",
  },
  {
    path: "/medical",
    title: "城市医疗",
    component: Medical,
    icon: require("../assets/icon/医院_填充.svg").default,
    configPath: "./config/analysis.json",
  },
  {
    path: "/education",
    title: "教育数据",
    component: Education,
    icon: require("../assets/icon/教育.svg").default,
    configPath: "./config/dispatch.json",
  },
  {
    path: "/emergency",
    title: "应急救援",
    component: Emergency,
    icon: require("../assets/icon/应急救援.svg").default,
    configPath: "./config/progress.json",
  },
  {
    path: "/traffic",
    title: "交通情况",
    component: Traffic,
    icon: require("../assets/icon/交通信息.svg").default,
    configPath: "./config/acceptance.json",
  },
  {
    path: "/travel",
    title: "旅游住宿",
    component: Travel,
    icon: require("../assets/icon/住宿.svg").default,
    configPath: "./config/audit.json",
  },
  {
    path: "/epidemic",
    title: "疫情管理",
    component: Epidemic,
    icon: require("../assets/icon/疫情.svg").default,
    configPath: "./config/injection.json",
  },
];
routes.forEach((r, i) => {
  if (i) {
    r.key = r.path.slice(1);
    r.component = lazy(() =>
      import(/* webpackChunkName: "page" */ `../pages${r.path}`)
    );
  } else r.key = "home";
});

export default routes;
