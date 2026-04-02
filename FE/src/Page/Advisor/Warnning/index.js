import classNames from "classnames/bind";
import style from "./Warnning.module.scss";
import ContentLayout from "~/Component/ContentLayout";
import { useState, useEffect } from "react";
import BaseTable from "~/Component/BaseTable";
import SeeDetailLayout from "~/Component/SeeDetailLayout";
import emailjs from "@emailjs/browser";

const cls = classNames.bind(style);

function WarnningLayout() {
  const emailTo = "quynguyen.19122004@gmail.com";

  const [openLayout, setOpenLayout] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState("");
  const [data, setData] = useState([]);

  const token = localStorage.getItem("token");

  // EmailJS config
  const SERVICE_ID = "service_43v9jua";
  const TEMPLATE_ID = "template_ae6nwz3";
  const PUBLIC_KEY = "7i9JZ4xjWIm4sPIwa";

  // =============================
  // ⚡ FETCH API GPA + FILTER
  // =============================
  useEffect(() => {
    fetch("https://localhost:7287/api/Statistics/gpa/student-average", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => {
        const filtered = json
          .filter((s) => s.avgGPA < 6)
          .map((s) => {
            const gpaRaw = s.avgGPA;
            const gpaFloor = Math.floor(gpaRaw * 100) / 100; // làm tròn xuống

            return {
              studentId: s.studentId,
              name: s.name,
              gpa: gpaFloor.toFixed(2), // luôn hiển thị 2 số thập phân
              statistical:
                gpaRaw < 5.5 ? (
                  <span style={{ color: "red" }}>Sinh viên yếu</span>
                ) : (
                  <span style={{ color: "orange" }}>Sinh viên trung bình</span>
                ),
            };
          });

        setData(filtered);
      })
      .catch((err) => console.error("FETCH GPA ERROR:", err));
  }, []);

  const columns = [
    { key: "studentId", title: "Mã sinh viên" },
    { key: "name", title: "Tên sinh viên" },
    { key: "gpa", title: "GPA" },
    { key: "statistical", title: "Cảnh báo" },
  ];

  // =============================
  // ⚡ GỬI EMAIL BẰNG EMAILJS
  // =============================
  const sendWarning = async () => {
    if (!selectedStudent) {
      alert("⚠ Không có sinh viên được chọn!");
      return;
    }
    if (!message.trim()) {
      alert("⚠ Hãy nhập nội dung cảnh báo!");
      return;
    }

    const templateParams = {
      title: "Cảnh báo học tập",
      student_name: selectedStudent.name,
      gpa: selectedStudent.gpa, // gửi GPA đã format vào template
      message: message,
      email: emailTo,
      name: "Cố vấn học tập",
    };

    try {
      const response = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );

      console.log("EmailJS response:", response);
      alert("✅ Gửi cảnh báo thành công!");

      setMessage("");
      setOpenLayout(false);
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("❌ Gửi email thất bại. Kiểm tra EmailJS.");
    }
  };

  return (
    <ContentLayout>
      <h2 className={cls("head--text")}>
        Cảnh báo trình trạng học tập của sinh viên
      </h2>

      <BaseTable
        columns={columns}
        data={data}
        renderAction={(row) => (
          <button
            className={cls("btn--warn")}
            onClick={() => {
              setSelectedStudent(row);
              setOpenLayout(true);
            }}
          >
            Gửi cảnh báo
          </button>
        )}
      />

      {/* Layout gửi email */}
      <SeeDetailLayout
        title="Gửi cảnh báo"
        open={openLayout}
        onClose={() => setOpenLayout(false)}
      >
        <div className={cls("form--warnning")}>
          <label className={cls("form--label")}>
            Cố vấn gửi thông tin cảnh báo tới sinh viên
          </label>

          <textarea
            className={cls("form--input")}
            placeholder="Nhập nội dung cảnh báo..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button
          className={cls("btn--send")}
          onClick={(e) => {
            e.preventDefault();
            sendWarning();
          }}
        >
          Gửi
        </button>
      </SeeDetailLayout>
    </ContentLayout>
  );
}

export default WarnningLayout;
