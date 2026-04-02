import { Navigate } from "react-router-dom";

export default function RequireRole({ children, roles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const maintenance = localStorage.getItem("maintenance"); // "on" | "off"

  // Chưa đăng nhập → quay về login
  if (!token) return <Navigate to="/" replace />;

  // Nếu hệ thống BẢO TRÌ và role KHÔNG phải Admin → chặn ngay
  if (maintenance === "on" && role !== "Admin" && role !== "Adsmin") {
    return (
      <div style={{ padding: 40, textAlign: "center", fontSize: 22 }}>
        <h2>Hệ thống đang bảo trì</h2>
        <p>Vui lòng quay lại sau!</p>
      </div>
    );
  }

  // Nếu role KHÔNG thuộc quyền cho phép của route → đá về login
  if (!roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
