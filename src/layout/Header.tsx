import { Suspense, CSSProperties, Component, FC, useEffect, useMemo } from 'react';
import React from "react";
import { RouteComponentProps, Switch, NavLink, withRouter } from "react-router-dom";
import routers from '../config/routers';
import Icon from '../components/Icon';
import UnorderedListOutlined from "@ant-design/icons";
import { vw } from '../utils/common';
import routes from '../config/routers'

interface HeaderProps extends RouteComponentProps {
  title: string;
  enTitle?: string;
  bg?: boolean; //显示背景
  template?: string;
  style?: CSSProperties;
  className?: string;
}
const calcMenuGroupMarginX = (title: string, menuList: { title: string }[]) => {
  // home-32,
  const menuWidth =
    (menuList || []).reduce(
      (w: number, item) => (w += item.title.length > 2 ? Math.min(6, item.title.length) * 14 : 32),
      0
    ) + 32;
  return Math.min(
    Math.floor(
      (1920 - (40 + 80 + 18 + title.length * 38) - menuWidth - 10) /
      ((menuList || []).length + 2) /
      2
    ),
    32
  );
};
const Header: FC<HeaderProps> = function ({ title, enTitle, bg, style, className = "", ...rest }) {
  const marginX = useMemo(() => calcMenuGroupMarginX(title, routes), [routes]);
  const renderMenuItem = (item: any, i: number) => (
    <li
      key={i}
      className={"pointer"}
      style={{ margin: `0 ${vw(marginX)}`, paddingBottom: 4 }}
    >
      {item.icon ? <Icon src={item.icon} /> : <UnorderedListOutlined />}
      <div>{item.title}</div>
    </li>
  );
  useEffect(() => {
    // console.log(Icon);

  }, [])
  return (
    <div className={'header-box'}>
      <div className={'header-L'}>
        <div className="title">丽水中心城市·数字孪生平台</div>
        <div className="entitle">LISHUI CENTRAL CITY·VISUAL DIGITAL TWIN INFORMATION PLATFORM</div>
      </div>
      <ul className={'header-R'}>
        {routers.map(({ key, path, ...rest }, i) => (
          <NavLink
            to={{ pathname: path, state: { key } }}
            activeStyle={{ color: "#32C5FF" }}
            key={i}
            exact
          >
            {renderMenuItem(rest, i)}
          </NavLink>
        )

        )}
      </ul>
    </div>
  )

}
export default withRouter(Header);