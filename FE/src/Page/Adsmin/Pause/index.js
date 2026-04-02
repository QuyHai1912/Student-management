import classNames from "classnames/bind";
import stylePause from "./AdsminPause.module.scss";
import ContentLayout from "~/Component/ContentLayout";
import { useState, useEffect } from "react";

const cls = classNames.bind(stylePause);

function AdsminPause() {
  // Lấy trạng thái bảo trì từ localStorage khi load trang
  const [checkBox, setCheckBox] = useState(
    localStorage.getItem("maintenance") === "on" ? "Bật" : "Tắt"
  );

  const handleChange = (e) => {
    if (e.target.checked) {
      setCheckBox("Bật");
      localStorage.setItem("maintenance", "on");
    } else {
      setCheckBox("Tắt");
      localStorage.setItem("maintenance", "off");
    }
  };

  return (
    <ContentLayout>
      <div>
        <h2 className={cls("pause--head")}>Bảo trì hệ thống</h2>
        <p className={cls("pause--title")}>
          Bật chế độ bảo trì để tạm ngưng hoạt động của hệ thống
        </p>

        <input
          className={cls("pause--checkbox")}
          type="checkbox"
          checked={checkBox === "Bật"}
          onChange={handleChange}
        />

        <p className={cls("pause--foot")}>Chế độ bảo trì ({checkBox})</p>
      </div>
    </ContentLayout>
  );
}

export default AdsminPause;
