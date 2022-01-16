import { Suspense, Component, FC } from 'react';
import React from "react";
import { RouteComponentProps, Switch, Route, withRouter } from "react-router-dom";
import { Drawer } from 'antd'
interface EducationProps extends RouteComponentProps {

}
const Education: FC<EducationProps> = function ({ }) {
  return (
    <>
      <Drawer></Drawer>
      <Drawer></Drawer>
    </>
  )

}
export default Education;