import classNames from "classnames/bind";
import style from "./AddAccount.module.scss";
const cls = classNames.bind(style);

function AddAccountModal({ open, onClose, onSubmit }) {
  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
      role: formData.get("role"),
    };

    onSubmit(data);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className={cls("modal")} onClick={(e) => e.stopPropagation()}>
        <h2 className={cls("modal--head")}>Thêm tài khoản</h2>

        <form className={cls("modal--form")} onSubmit={handleSubmit}>
          <div className={cls("form--wrapper")}>
            <label className={cls("form--label")}>Tên đăng nhập</label>
            <input className={cls("form--input")} name="username" required />
          </div>
          <div className={cls("form--wrapper")}>
            <label className={cls("form--label")}>Mật khẩu</label>
            <input
              className={cls("form--input")}
              name="password"
              type="password"
              required
            />
          </div>
          <div className={cls("form--wrapper")}>
            <label className={cls("form--label")}>Quyền</label>
            <select name="role">
              <option value="Admin">Adsmin</option>
              <option value="Teacher">Teacher</option>
              <option value="Advisor">Advisor</option>
            </select>
          </div>
          <div className={`${cls("form--action")} wrapper--btn`}>
            <button
              className={`${cls("btn--close")} btn--close`}
              type="button"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              className={`${cls("btn--submit")} btn--submit`}
              type="submit"
            >
              Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAccountModal;
