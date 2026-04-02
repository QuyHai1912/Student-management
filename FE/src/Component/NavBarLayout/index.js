import classNames from "classnames/bind";
import styleNavbar from "./NavbarLayout.module.scss";
import { NavLink, useNavigate } from "react-router-dom";

const cls = classNames.bind(styleNavbar);

function NavbarLayout({ title = [], onChangeTitle }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Bạn có chắc muốn đăng xuất không?");
    if (!confirmLogout) return;

    // Xóa token
    localStorage.removeItem("token");

    // Xóa role
    localStorage.setItem("role", ""); // hoặc "guest"

    // Điều hướng sang login
    navigate("/");
  };

  return (
    <nav className={cls("wrapper")}>
      <ul className={cls("list")}>
        {title.map((item) => {
          return (
            <li key={item.id} className={cls("item")}>
              <NavLink
                to={item.to}
                end
                onClick={() => onChangeTitle(item.label)}
                className={({ isActive }) =>
                  `${cls("item--link")} ${isActive ? "active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          );
        })}
      </ul>

      <button className="btnLogout" onClick={handleLogout}>
        Đăng xuất
      </button>
    </nav>
  );
}

export default NavbarLayout;
