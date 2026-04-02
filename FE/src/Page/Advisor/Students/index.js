import classNames from "classnames/bind";
import style from "./Students.module.scss";
import ContentLayout from "~/Component/ContentLayout";
import { useState, useEffect } from "react";
import BaseTable from "~/Component/BaseTable";
import SeeDetailLayout from "~/Component/SeeDetailLayout";

const cls = classNames.bind(style);

function StudentLayout() {
  const [openDetail, setOpenDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const [data, setData] = useState([]); // dữ liệu đang hiển thị
  const [originalData, setOriginalData] = useState([]); // dữ liệu gốc theo kỳ
  const [semester, setSemester] = useState("All");

  const [searchText, setSearchText] = useState("");

  const columns = [
    { key: "studentId", title: "Mã sinh viên" },
    { key: "name", title: "Tên sinh viên" },
    { key: "gpa", title: "GPA" },
  ];

  const token = localStorage.getItem("token");

  // ================================
  // 🔥 HÀM LOAD DANH SÁCH SINH VIÊN
  // ================================
  const loadStudents = async (sem) => {
    try {
      let url = "";
      let result = [];

      if (sem === "All") {
        url = "https://localhost:7287/api/Statistics/gpa/student-average";

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const apiData = await res.json();

        result = apiData.map((item) => ({
          studentId: item.studentId,
          name: item.name,
          gpa: item.avgGPA ? item.avgGPA.toFixed(2) : "0.00",
        }));
      } else {
        url = `https://localhost:7287/api/Statistics/advisor/gpa-by-semester/${sem}`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const apiData = await res.json();

        result = apiData.data.map((item) => ({
          studentId: item.studentId,
          name: item.name,
          gpa: item.gpa ? item.gpa.toFixed(2) : "0.00",
        }));
      }

      // Lưu dữ liệu gốc + hiển thị ban đầu
      setOriginalData(result);
      setData(result);
    } catch (err) {
      console.error("Load students error", err);
    }
  };

  // Gọi API theo kỳ học
  useEffect(() => {
    loadStudents(semester);
    setSearchText(""); // reset tìm kiếm khi đổi kỳ
  }, [semester]);

  // =============================================
  // 🔍 HÀM TÌM KIẾM SINH VIÊN THEO TÊN (REALTIME)
  // =============================================
  const handleSearchChange = (text) => {
    setSearchText(text);

    const filtered = originalData.filter((student) =>
      student.name.toLowerCase().includes(text.toLowerCase())
    );

    setData(filtered);
  };

  // =============================================
  // 🔥 HÀM LOAD CHI TIẾT SINH VIÊN
  // =============================================
  const loadDetail = async (studentId) => {
    try {
      const url = "https://localhost:7287/api/Advisors/students";

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const apiData = await res.json();

      const student = apiData.find((x) => x.studentId === studentId);

      setDetailData(student);
    } catch (err) {
      console.error("Load detail error", err);
    }
  };

  return (
    <ContentLayout>
      <div className="wrapper--btn">
        {/* <h2>Quản lý sinh viên</h2> */}

        {/* ================= SEARCH BOX ================= */}
        <div>
          <span className={cls("label--search")}>Tìm kiếm sinh viên: </span>
          <input
            className="input--search"
            type="text"
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Nhập tên sinh viên cần tìm ..."
          />
        </div>

        <div className={cls("choose--class")}>
          <p className={cls("choose--text")}>Chọn kì học: </p>

          <select
            className={cls("choose--value")}
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="All">All</option>
            <option value="1">Kì 1</option>
            <option value="2">Kì 2</option>
            <option value="3">Kì 3</option>
            <option value="4">Kì 4</option>
            <option value="5">Kì 5</option>
            <option value="6">Kì 6</option>
            <option value="7">Kì 7</option>
            <option value="8">Kì 8</option>
          </select>
        </div>
      </div>

      <BaseTable
        columns={columns}
        data={data}
        renderAction={(row) => (
          <button
            className={`${cls("btn--detail")} btn--submit`}
            onClick={() => {
              loadDetail(row.studentId);
              setOpenDetail(true);
            }}
          >
            Xem chi tiết
          </button>
        )}
      />

      {/* =================== CHI TIẾT SINH VIÊN =================== */}
      <SeeDetailLayout
        title="Chi tiết sinh viên"
        open={openDetail}
        onClose={() => setOpenDetail(false)}
      >
        {detailData && (
          <>
            <p className="label--detail">
              <strong className="label--properties">Mã sinh viên:</strong>{" "}
              {detailData.studentId}
            </p>

            <p className="label--detail">
              <strong className="label--properties">Tên sinh viên:</strong>{" "}
              {detailData.name}
            </p>

            <p className="label--detail">
              <strong className="label--properties">Email:</strong>{" "}
              {detailData.email}
            </p>

            <p className="label--detail">
              <strong className="label--properties">Số điện thoại:</strong>{" "}
              {detailData.phoneNumber}
            </p>

            <p className="label--detail">
              <strong className="label--properties">Giới tính:</strong>{" "}
              {detailData.gender}
            </p>

            <p className="label--detail">
              <strong className="label--properties">Ngày sinh:</strong>{" "}
              {detailData.birthday}
            </p>
          </>
        )}
      </SeeDetailLayout>
    </ContentLayout>
  );
}

export default StudentLayout;
