import classNames from "classnames/bind";
import styleContentLayout from "./ContentLayout.module.scss";

const cls = classNames.bind(styleContentLayout);

function ContentLayout({ children }) {
  return (
    <div className={cls("wrapper")}>
      <div className={cls("content")}>{children}</div>
    </div>
  );
}

export default ContentLayout;
