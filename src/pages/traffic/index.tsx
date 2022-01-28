import { Suspense, Component, FC, useEffect, useState } from 'react';
import React from "react";
import { RouteComponentProps, Switch, Route, withRouter } from "react-router-dom";
import { Drawer, Button } from 'antd';
import LineChart from '../../components/chart/lineChart';
import BarChart from '../../components/chart/barChart';
import CardLayout from '../../components/cardLayout';
import { Text } from '../../components/common';
interface HomeProps extends RouteComponentProps {
  config: any
}
interface Props {
  [k: string]: any,
  config: any
}
interface States {

}
class Traffic extends Component<Props, States> {

  render() {
    const { config } = this.props
    console.log(config);

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
          <CardLayout config={config.population1} Chart={<LineChart data={config.population1.chart} />} />
          <CardLayout config={config.population2} Chart={<BarChart data={config.population2.chart} />} />
          <CardLayout config={config.population3} Chart={<Text data={config.population3.chart} />} />
        </Drawer>
        <Drawer
          placement="right"
          className={"drawer drawer-right arial"}
          closable={false}
          visible={true}
          maskClosable={false}
          mask={false}
        >
          <CardLayout config={config.population4} />
          <CardLayout config={config.population5} />
          <CardLayout config={config.population6} />
        </Drawer>

      </div>
    )
  }


}
export default Traffic;