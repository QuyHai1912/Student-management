import classNames from "classnames/bind";
import style from "./HandleAddItem.module.scss";

const cls = classNames.bind(style);

function HandleAddItem({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="wrapper--detail" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default HandleAddItem;
