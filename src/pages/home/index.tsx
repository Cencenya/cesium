import { Suspense, Component, FC, useState } from 'react';
import React from "react";
import { RouteComponentProps, Switch, Route, withRouter } from "react-router-dom";
import { Drawer, Button } from 'antd'
interface HomeProps extends RouteComponentProps {

}
const Home: FC<HomeProps> = function ({ }) {
  return (
    <div>
      <Drawer
        placement="left"
        className={"drawer drawer-left arial"}
        closable={false}
        visible={true}
        maskClosable={false}
        mask={false}
        width={450}
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
        width={450}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>

    </div>
  )

}
export default Home;