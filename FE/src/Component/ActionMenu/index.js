// ⚠️ DÙNG BẢN HEADLESS
import Tippy from "@tippyjs/react/headless";
import classNames from "classnames/bind";
import styleAction from "./ActionMenu.module.scss";
import { useState } from "react";

const cls = classNames.bind(styleAction);

function ActionMenu({ onEdit, onDelete, onDetail }) {
  const hasEdit = typeof onEdit === "function";
  const hasDelete = typeof onDelete === "function";
  const hasDetail = typeof onDetail === "function";

  const [open, setOpen] = useState(false);

  const handleEdit = () => {
    onEdit && onEdit();
    setOpen(false); // bấm xong đóng menu
  };

  const handleDelete = () => {
    onDelete && onDelete();
    setOpen(false);
  };
  const handleDetail = () => {
    onDelete && onDetail();
    setOpen(false);
  };

  return (
    <Tippy
      interactive
      visible={open} // controlled
      placement="bottom-end"
      onClickOutside={() => setOpen(false)} // click ngoài -> đóng
      render={(attrs) => (
        <div className={cls("wrapper")} tabIndex={-1} {...attrs}>
          {hasEdit && (
            <button className={cls("btnEdit")} onClick={handleEdit}>
              Sửa
            </button>
          )}
          {hasDelete && (
            <button className={cls("btnDelete")} onClick={handleDelete}>
              Xóa
            </button>
          )}
          {hasDetail && (
            <button className={cls("btnDetail")} onClick={handleDetail}>
              Chi tiết
            </button>
          )}
        </div>
      )}
    >
      <button
        className={cls("btnCategory")}
        onClick={() => setOpen((prev) => !prev)} // toggle mở/đóng
      >
        <i className="fa-solid fa-ellipsis" />
      </button>
    </Tippy>
  );
}

export default ActionMenu;
