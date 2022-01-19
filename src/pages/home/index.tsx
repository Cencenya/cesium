import { Suspense, Component, FC, useEffect, useState } from 'react';
import React from "react";
import { RouteComponentProps, Switch, Route, withRouter } from "react-router-dom";
import { Drawer, Button } from 'antd';
import { vw } from '../../utils/common';
import LineChart from '../../components/chart/lineChart'
import CardLayout from '../../components/cardLayout'
interface HomeProps extends RouteComponentProps {
  config: any
}
interface Props {
  [k: string]: any,
}
interface States {

}
class Home extends Component<Props, States> {
  render() {
    const { config } = this.props
    return (
      <div>
        <Drawer
          placement="left"
          className={"drawer drawer-left arial"}
          closable={false}
          visible={true}
          maskClosable={false}
          mask={false}
        >
          {/*
           1  传入组件作为参数 qs：cardlayout只负责渲染组件 如何将数据外面传入linechart组件？
           2  使用高阶组件 ==》 待完成！
          
          */}
          <CardLayout config={config.population} Chart={<LineChart data={config.population.chart} />} />
          {/* <CardLayout config={config.population} Chart={LineChart} /> */}
          {/* <CardLayout config={config.population} Chart={LineChart} /> */}
          {/* <CardLayout config={config.population} /> */}
          {/* <CardLayout config={config.population} /> */}
        </Drawer>
        <Drawer
          placement="right"
          className={"drawer drawer-right arial"}
          closable={false}
          visible={true}
          maskClosable={false}
          mask={false}
        >
          <CardLayout config={config.population} />
          <CardLayout config={config.population} />
          <CardLayout config={config.population} />
        </Drawer>

      </div>
    )
  }


}
export default Home;