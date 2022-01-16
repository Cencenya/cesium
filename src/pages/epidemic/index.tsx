import { Suspense, Component, FC } from 'react';
import React from "react";
import { RouteComponentProps, Switch, Route, withRouter } from "react-router-dom";
import { Drawer } from 'antd'
interface EpidemicProps extends RouteComponentProps {

}
const Epidemic: FC<EpidemicProps> = function ({ }) {
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
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
      <Drawer
        placement="right"
        className={"drawer drawer-right arial"}
        closable={false}
        visible={true}
        maskClosable={false}
        mask={false}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>

    </div>
  )

}
export default Epidemic;