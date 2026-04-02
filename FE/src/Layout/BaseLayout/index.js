import classNames from "classnames/bind";
import styleBaseLayout from "./BaseLayout.module.scss";
import HeaderLayout from "~/Component/HeaderLayout";
import NavbarLayout from "~/Component/NavBarLayout";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const cls = classNames.bind(styleBaseLayout);

function BaseLayout({ menuItems, defaultTitle = "Trang chủ", role }) {
  const [currentTitle, setCurrentTitle] = useState(defaultTitle);

  const handleChangeTitle = (newTitle) => {
    setCurrentTitle(newTitle);
  };

  return (
    <div className={cls("wrapper")}>
      <HeaderLayout title={currentTitle} role={role} />

      <div className={cls("content")}>
        <NavbarLayout title={menuItems} onChangeTitle={handleChangeTitle} />

        <Outlet />
      </div>
    </div>
  );
}

export default BaseLayout;
