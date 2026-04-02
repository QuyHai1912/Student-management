import classNames from "classnames/bind";
import styleHeader from "./HeaderLayout.module.scss";
import SeeDetailLayout from "../SeeDetailLayout";
import HandleAddItem from "../HandleAddItem";
import imgs from "~/asset/image";
import { useState } from "react";
import UpdateUser from "./UpdateUser";
import AddUser from "./AddUser";
import { jwtDecode } from "jwt-decode"; // ✅ Import đúng

const cls = classNames.bind(styleHeader);

function HeaderLayout({ title, role }) {
  const [userName, setUserName] = useState(null);

  const [openDetail, setOpenDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const [openForm, setOpenForm] = useState(false);
  const [edittingUser, setEdittingUser] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  const token = localStorage.getItem("token");

  // ============================
  // 🔥 LẤY accId TỪ TOKEN
  // ============================
  let accIdFromToken = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);

      accIdFromToken =
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      console.log("🔍 ACCID DECODED FROM TOKEN:", accIdFromToken);
    } catch (err) {
      console.error("❌ TOKEN DECODE ERROR:", err);
    }
  }

  // Hàm chuẩn hóa để so sánh
  const normalize = (str) => (str || "").trim().toLowerCase();

  // ============================
  // 🔥 XỬ LÝ MỞ FORM UPDATE/CREATE
  // ============================
  const handleOpenUpdate = async () => {
    if (!token || !accIdFromToken) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    try {
      const res = await fetch("https://localhost:7287/api/Users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const users = await res.json();

      console.log("📌 USERS LIST:", users);
      console.log("📌 ACCID NEED TO CHECK:", accIdFromToken);

      const existUser = users.find(
        (u) => normalize(u.accId) === normalize(accIdFromToken)
      );

      if (existUser) {
        console.log("✔ USER ĐÃ TỒN TẠI → MỞ FORM UPDATE");
        setIsNewUser(false);
        setEdittingUser(existUser);
      } else {
        console.log("➡ USER CHƯA TỒN TẠI → MỞ FORM CREATE");

        setIsNewUser(true);
        setEdittingUser({
          accId: accIdFromToken.trim(),
          name: "",
          email: "",
          birthday: "",
          gender: "",
          phoneNumber: "",
          address: { province: "", district: "", infor: "" },
        });
      }

      setOpenForm(true);
    } catch (error) {
      console.error("❌ FETCH USER ERROR:", error);
    }
  };

  // ============================
  // 🔥 SUBMIT FORM
  // ============================
  const handleSubmitForm = async (userData) => {
    try {
      const url = isNewUser
        ? "https://localhost:7287/api/Users"
        : `https://localhost:7287/api/Users/${userData.id}`;

      const method = isNewUser ? "POST" : "PUT";

      console.log("📤 SUBMIT USER DATA:", userData);

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        alert("Lỗi khi gửi dữ liệu!");
        console.log("❌ SERVER ERROR:", await res.text());
        return;
      }

      alert(isNewUser ? "Tạo user thành công!" : "Cập nhật user thành công!");
      setOpenForm(false);
    } catch (err) {
      console.error("❌ SUBMIT USER ERROR:", err);
    }
  };

  // Xem chi tiết
  const handleOpenDetail = async () => {
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    try {
      const res = await fetch("https://localhost:7287/api/Users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.log("❌ Không lấy được thông tin user");
        setDetailData(null);
        setOpenDetail(true);
        return;
      }

      const data = await res.json();
      console.log("📌 USER DETAIL DATA:", data);

      setDetailData(data);
      setOpenDetail(true);
    } catch (err) {
      console.error("❌ LỖI:", err);
      setDetailData(null);
      setOpenDetail(true);
    }
  };

  return (
    <div className={cls("wrapper")}>
      <div className={cls("logo")}>
        <img className={cls("logo--icon")} src={imgs.logo} alt="" />
      </div>

      <div className={cls("title")}>
        <h2 className={cls("title--text")}>{title}</h2>
      </div>

      {/* USER DROPDOWN */}
      <div className={cls("user")}>
        <h2 className={cls("user--name")}>{userName}</h2>
        <img className={cls("user--img")} src={imgs.user} alt="" />
        <ul className={cls("user--handle")}>
          <li className={cls("user--detail")} onClick={handleOpenUpdate}>
            Cập nhật
          </li>
          <li className={cls("user--detail")} onClick={handleOpenDetail}>
            Chi tiết
          </li>
        </ul>
      </div>
      {/* Form xem chi tiết */}

      <SeeDetailLayout
        title="Thông tin người dùng"
        open={openDetail}
        onClose={() => setOpenDetail(false)}
      >
        {detailData ? (
          <>
            <p className="label--detail">
              <strong className="label--properties">Họ tên: </strong>
              {detailData.name}
            </p>

            <p className="label--detail">
              <strong className="label--properties">Email: </strong>
              {detailData.email}
            </p>

            <p className="label--detail">
              <strong className="label--properties">Giới tính: </strong>
              {detailData.gender}
            </p>

            <p className="label--detail">
              <strong className="label--properties">Ngày sinh: </strong>
              {detailData.birthday}
            </p>

            <p className="label--detail">
              <strong className="label--properties">Số điện thoại: </strong>
              {detailData.phoneNumber}
            </p>

            <p className="label--detail">
              <strong className="label--properties">Địa chỉ: </strong>
              {`${detailData.address?.infor || ""}, ${
                detailData.address?.district || ""
              }, ${detailData.address?.province || ""}`}
            </p>
          </>
        ) : (
          <>
            <p className="label--detail" style={{ color: "red" }}>
              Người dùng chưa cập nhật thông tin!
            </p>
            <button
              onClick={(e) => {
                e.preventDefault();
                setOpenDetail(false);
                handleOpenUpdate();
              }}
              className="btn--submit"
              style={{ marginBottom: "20px", textAlign: "right" }}
            >
              Thêm thông tin
            </button>
          </>
        )}
      </SeeDetailLayout>

      {/* FORM UPDATE / CREATE USER */}
      {openForm && edittingUser && (
        <HandleAddItem open={openForm} onClose={() => setOpenForm(false)}>
          {isNewUser ? (
            <AddUser
              edittingUser={edittingUser}
              onSubmit={handleSubmitForm}
              onClose={() => setOpenForm(false)}
            />
          ) : (
            <UpdateUser
              edittingUser={edittingUser}
              onSubmit={handleSubmitForm}
              onClose={() => setOpenForm(false)}
            />
          )}
        </HandleAddItem>
      )}
    </div>
  );
}

export default HeaderLayout;
