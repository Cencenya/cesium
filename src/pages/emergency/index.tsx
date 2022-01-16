import { Suspense, Component, FC } from 'react';
import React from "react";
import { RouteComponentProps, Switch, Route, withRouter } from "react-router-dom";
import { Drawer } from 'antd'
interface EmergencyProps extends RouteComponentProps {

}
const Emergency: FC<EmergencyProps> = function ({ }) {
  return (
    <>
      <Drawer></Drawer>
      <Drawer></Drawer>
    </>
  )

}
export default Emergency;