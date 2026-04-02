import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import loginStyles from "./Login.module.scss";
import img from "../../asset/image";
const cls = classNames.bind(loginStyles);

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ NEW
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    let err = {};

    if (!username.trim()) err.username = "Tên đăng nhập không được để trống";
    if (!password.trim()) err.password = "Mật khẩu không được để trống";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ---------------- HANDLE SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await fetch("https://localhost:7287/api/Accounts/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setServerError("Sai tên đăng nhập hoặc mật khẩu!");
        return;
      }

      const data = await res.json();

      const maintenance = localStorage.getItem("maintenance");

      // ❗ Chặn TEACHER & ADVISOR khi bảo trì
      if (
        maintenance === "on" &&
        data.role !== "Admin" &&
        data.role !== "Adsmin"
      ) {
        setServerError("Hệ thống đang bảo trì, vui lòng quay lại sau!");
        return;
      }

      // Lưu token + role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      if (data.userId) localStorage.setItem("userId", data.userId);
      if (data.username) localStorage.setItem("username", data.username);

      // Điều hướng theo role
      switch (data.role) {
        case "Admin":
        case "Adsmin":
          navigate("/adsmin");
          break;
        case "Teacher":
          navigate("/teacher");
          break;
        case "Advisor":
          navigate("/advisor");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setServerError("Không thể kết nối đến server!");
    }
  };

  // ============================ FORGOT PASSWORD ============================
  const handleForgotPassword = async () => {
    if (!username.trim()) {
      alert("Vui lòng nhập tên đăng nhập trước!");
      return;
    }

    try {
      const res = await fetch(
        "https://localhost:7287/api/Accounts/request-reset",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        }
      );

      if (!res.ok) {
        alert("Tài khoản không tồn tại.");
        return;
      }

      alert("Yêu cầu reset thành công!");
    } catch (err) {
      console.error("RESET ERROR:", err);
      alert("Không thể kết nối đến server!");
    }
  };

  return (
    <div className={cls("login")}>
      <div className={cls("wrapper--form")}>
        <img src={img.logo} className={cls("form--logo")} />
        <h2 className={cls("form--univer")}>ĐẠI HỌC CÔNG NGHIỆP HÀ NỘI</h2>
        <h2 className={cls("form--name")}>
          TRƯỜNG CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG
        </h2>

        <form className={cls("form")} onSubmit={handleSubmit}>
          {serverError && <p className={cls("error--server")}>{serverError}</p>}

          {/* USERNAME */}
          <div className={cls("wrapper--input")}>
            <label className={cls("form--label")}>Tên đăng nhập</label>
            <input
              placeholder="Ex: quynh"
              className={cls("form--input")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <p className={cls("error")}>{errors.username}</p>
            )}
          </div>

          {/* PASSWORD (with eye icon) */}
          <div className={cls("wrapper--input")}>
            <label className={cls("form--label")}>Mật khẩu</label>

            <div className={cls("password-wrapper")}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className={cls("form--input")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* 👁️ EYE BUTTON */}
              <span
                className={cls("eye-icon")}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "🙈"}
              </span>
            </div>

            {errors.password && (
              <p className={cls("error")}>{errors.password}</p>
            )}
          </div>

          <p className={cls("form--forget")} onClick={handleForgotPassword}>
            Quên mật khẩu?
          </p>

          <button className={cls("form--btnLog")} type="submit">
            Đăng nhập
          </button>

          <p className={cls("form--text")}>
            Login<b>@haui.edu.vn</b>
          </p>
        </form>
      </div>

      <div className={cls("wrapper--infor")}>
        <p className={cls("infor--text")}>lorem16</p>
      </div>
    </div>
  );
}

export default Login;
