import { Suspense, Component, FC } from 'react';
import React from "react";
import { RouteComponentProps, Switch, Route, withRouter } from "react-router-dom";
import { Drawer } from 'antd'
interface TrafficProps extends RouteComponentProps {

}
const Traffic: FC<TrafficProps> = function ({ }) {
  return (
    <>
      <Drawer></Drawer>
      <Drawer></Drawer>
    </>
  )

}
export default Traffic;