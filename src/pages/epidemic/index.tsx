import { Suspense, Component, FC, useEffect, useState } from 'react';
import React from "react";
import { RouteComponentProps, Switch, Route, withRouter } from "react-router-dom";
import { Drawer, Button } from 'antd';
import { vw } from '../../utils/common';
import CardLayout from '../../components/cardLayout'
interface HomeProps extends RouteComponentProps {
  config: any
}
interface Props {
  [k: string]: any,
  config: any
}
interface States {

}
class Epidemic extends Component<Props, States> {
  render() {
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
          <CardLayout config={{}} />
          <CardLayout config={{}} />
          <CardLayout config={{}} />
        </Drawer>
        <Drawer
          placement="right"
          className={"drawer drawer-right arial"}
          closable={false}
          visible={true}
          maskClosable={false}
          mask={false}
        >
          <CardLayout config={{}} />
          <CardLayout config={{}} />
          <CardLayout config={{}} />
        </Drawer>

      </div>
    )
  }


}
export default Epidemic;