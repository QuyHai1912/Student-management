import classNames from "classnames/bind";
import style from "./SeeDetailLayout.module.scss";

const cls = classNames.bind(style);

function SeeDetailLayout({ title, open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="wrapper--detail" onClick={(e) => e.stopPropagation()}>
        <h2 className="detail--heading">{title}</h2>
        <form>{children}</form>
        <button className="btn--close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default SeeDetailLayout;
