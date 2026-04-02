import { useState } from "react";
import classNames from "classnames/bind";
import style from "./UpdateUser.module.scss";

const cls = classNames.bind(style);

function UpdateUser({ edittingUser, onSubmit, onClose }) {
  const [errors, setErrors] = useState({});

  if (!edittingUser) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    // Lấy dữ liệu từ input
    const name = form.get("name").trim();
    const email = form.get("email").trim();
    const birthday = form.get("birthday").trim();
    const gender = form.get("gender");
    const phoneNumber = form.get("phoneNumber").trim();

    const province = form.get("province").trim();
    const district = form.get("district").trim();
    const infor = form.get("infor").trim();

    let newErrors = {};

    // Validate
    if (!name) newErrors.name = "Họ tên không được để trống";
    if (!email) newErrors.email = "Email không được để trống";
    if (!birthday) newErrors.birthday = "Ngày sinh không được để trống";
    if (!gender) newErrors.gender = "Vui lòng chọn giới tính";
    if (!phoneNumber) {
      newErrors.phoneNumber = "Số điện thoại không được để trống";
    } else if (phoneNumber.startsWith("0")) {
      newErrors.phoneNumber = "Số điện thoại không được bắt đầu bằng số 0";
    } else if (!/^[1-9][0-9]{8,}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ (ít nhất 9 số)";
    }

    if (!province) newErrors.province = "Tỉnh/Thành phố không được để trống";
    if (!district) newErrors.district = "Huyện/Thị xã không được để trống";
    if (!infor) newErrors.infor = "Địa chỉ chi tiết không được để trống";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Gửi đúng cấu trúc API User yêu cầu
    onSubmit({
      id: edittingUser.id, // Giữ nguyên Id
      name,
      email,
      birthday,
      gender,
      phoneNumber: Number(phoneNumber),
      accId: edittingUser.accId, // Không cho sửa accId
      address: {
        province,
        district,
        infor,
      },
    });
  };

  return (
    <form className="add--form" onSubmit={handleSubmit}>
      <h2 className="form--title">Cập nhật thông tin người dùng</h2>

      {/* HỌ TÊN */}
      <div className="form--group">
        <label className="form--label">Họ và tên:</label>
        <input
          className="form--input"
          name="name"
          defaultValue={edittingUser.name}
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

      {/* EMAIL */}
      <div className="form--group">
        <label className="form--label">Email:</label>
        <input
          className="form--input"
          name="email"
          type="email"
          defaultValue={edittingUser.email}
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>

      {/* NGÀY SINH */}
      <div className="form--group">
        <label className="form--label">Ngày sinh:</label>
        <input
          className="form--input"
          type="date"
          name="birthday"
          defaultValue={edittingUser.birthday}
        />
        {errors.birthday && <p className="error">{errors.birthday}</p>}
      </div>

      {/* GIỚI TÍNH */}
      <div className="form--group">
        <label className="form--label">Giới tính:</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="gender"
              value="Nam"
              defaultChecked={edittingUser.gender === "Nam"}
            />
            Nam
          </label>

          <label>
            <input
              type="radio"
              name="gender"
              value="Nữ"
              defaultChecked={edittingUser.gender === "Nữ"}
            />
            Nữ
          </label>
        </div>
        {errors.gender && <p className="error">{errors.gender}</p>}
      </div>

      {/* SỐ ĐIỆN THOẠI */}
      <div className="form--group">
        <label className="form--label">Số điện thoại:</label>
        <input
          className="form--input"
          type="number"
          name="phoneNumber"
          defaultValue={edittingUser.phoneNumber}
        />
        {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
      </div>

      <h3 className="form--address">Địa chỉ</h3>

      {/* PROVINCE */}
      <div className="form--group">
        <label className="form--label">Tỉnh/Thành phố:</label>
        <input
          className="form--input"
          name="province"
          defaultValue={edittingUser.address?.province}
        />
        {errors.province && <p className="error">{errors.province}</p>}
      </div>

      {/* DISTRICT */}
      <div className="form--group">
        <label className="form--label">Quận/Huyện:</label>
        <input
          className="form--input"
          name="district"
          defaultValue={edittingUser.address?.district}
        />
        {errors.district && <p className="error">{errors.district}</p>}
      </div>

      {/* INFOR */}
      <div className="form--group">
        <label className="form--label">Địa chỉ chi tiết:</label>
        <input
          className="form--input"
          name="infor"
          defaultValue={edittingUser.address?.infor}
        />
        {errors.infor && <p className="error">{errors.infor}</p>}
      </div>

      {/* BUTTONS */}
      <div className="actions">
        <button type="button" className="btn--close" onClick={onClose}>
          Hủy
        </button>
        <button type="submit" className={`${cls("btn--submit")} btn--submit`}>
          Lưu thay đổi
        </button>
      </div>
    </form>
  );
}

export default UpdateUser;
