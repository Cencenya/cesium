import React from "react";

export default class CesiumMap{
  static element;
  static init (id= 'cesiumContainer'){
    let dom = document.getElementById(id);
    if (dom) dom.remove();
    this.element = dom = document.createElement("div");
    dom.id = id;
    document.getElementById("root").appendChild(dom);
  }
}