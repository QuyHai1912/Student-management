import classNames from "classnames/bind";
import style from "./ManageClass.module.scss";
import ContentLayout from "~/Component/ContentLayout";
import BaseTable from "~/Component/BaseTable";
import { useEffect, useState } from "react";

const cls = classNames.bind(style);

function ManageClass() {
  const token = localStorage.getItem("token");

  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  const [rows, setRows] = useState([]);
  const [showCondition, setShowCondition] = useState(false);

  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");

  // ================================
  // 📌 LOAD LIST LỚP GIÁO VIÊN ĐANG DẠY
  // ================================
  const loadClassList = () => {
    fetch("https://localhost:7287/api/Teachers/classes/current", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setClassList(data);
        if (data.length > 0) setSelectedClass(data[0].id);
      })
      .catch((e) => console.error("ERR LOAD CLASS:", e));
  };

  // ================================
  // 📌 LOAD SINH VIÊN THEO LỚP
  // ================================
  const loadAttendance = (classId) => {
    if (!classId) return;

    fetch(`https://localhost:7287/api/StudentSubjects/class/${classId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) =>
          a.studentName.localeCompare(b.studentName)
        );

        const mapped = sorted.map((item) => ({
          studentId: item.studentId,
          studentName: item.studentName,
          subjectId: item.subjectId,
          semesterId: item.semesterId,
          absent: item.soTietNghi ?? 0,
          total: item.soTiet ?? 0,
          point1: item.point1 ?? 0,
          point2: item.point2 ?? 0,
          point3: item.point3 ?? 0,
          isApproved: item.isApproved ?? 0, // ⭐ QUAN TRỌNG: dùng y như ManagePoint
        }));

        setRows(mapped);
        setEditing(null);
      })
      .catch((e) => console.error("ERR LOAD ATTEND:", e));
  };

  // ================================
  // 📌 CLICK SỬA
  // ================================
  const handleEditClick = (row) => {
    setEditing(row.studentId);
    setEditValue(row.absent);
  };

  // ================================
  // 📌 LƯU SỐ TIẾT NGHỈ
  // ================================
  const handleSaveClick = async (row) => {
    const newValue = Number(editValue);

    if (isNaN(newValue) || newValue < 0 || newValue > row.total) {
      alert("Số tiết nghỉ không hợp lệ!");
      return;
    }

    await fetch(
      `https://localhost:7287/api/StudentSubjects/student-subject/${row.studentId}/${row.subjectId}/${row.semesterId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          point1: row.point1,
          point2: row.point2,
          point3: row.point3,
          soTietNghi: newValue,
        }),
      }
    );

    setEditing(null);
    loadAttendance(selectedClass);
  };

  // ================================
  // 📌 TABLE DATA
  // ================================
  const tableData = rows.map((row) => {
    const isEditing = editing === row.studentId;
    const over30 = row.absent > row.total * 0.3;

    return {
      ...row,

      absentDisplay: isEditing ? (
        <input
          type="number"
          className={cls("edit-input")}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
        />
      ) : (
        row.absent
      ),

      examStatus: !showCondition ? (
        "—"
      ) : row.absent > row.total ? (
        <span className={cls("fail-text")}>Lỗi dữ liệu</span>
      ) : over30 ? (
        <span className={cls("fail-text")}>Học lại</span>
      ) : (
        <span className={cls("pass-text")}>Đủ điều kiện</span>
      ),
    };
  });

  const columns = [
    { key: "studentId", title: "Mã sinh viên" },
    { key: "studentName", title: "Tên sinh viên" },
    { key: "absentDisplay", title: "Số tiết nghỉ" },
    { key: "total", title: "Tổng tiết" },
    { key: "examStatus", title: "Điều kiện thi" },
  ];

  // ================================
  // INIT LOAD
  // ================================
  useEffect(() => {
    loadClassList();
  }, []);

  useEffect(() => {
    if (selectedClass) loadAttendance(selectedClass);
  }, [selectedClass]);

  return (
    <ContentLayout>
      <h2 className={cls("head--text")}>
        Chỉnh sửa / Nhập số tiết nghỉ của sinh viên
      </h2>

      {/* SELECT CLASS */}
      <div className="wrapper--btn">
        <div className={cls("choose--class")}>
          <p className={cls("choose--text")}>Chọn lớp môn học</p>

          <select
            className={cls("choose--value")}
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.classId}
              </option>
            ))}
          </select>
        </div>

        <button
          className={cls("btn--case")}
          onClick={() => setShowCondition(true)}
        >
          Xét điều kiện thi
        </button>
      </div>

      {/* TABLE */}
      <BaseTable
        columns={columns}
        data={tableData}
        height="450px"
        renderAction={(row) => {
          // ⭐ Nếu lớp đã duyệt → KHÔNG CHO SỬA, giống ManagePoint
          if (row.isApproved === 1) {
            return (
              <button className="btn--approved" disabled>
                Đã duyệt
              </button>
            );
          }

          if (editing === row.studentId) {
            return (
              <button
                className="btn--save"
                onClick={() => handleSaveClick(row)}
              >
                Lưu
              </button>
            );
          }

          return (
            <button className="btn--edit" onClick={() => handleEditClick(row)}>
              Sửa
            </button>
          );
        }}
      />
    </ContentLayout>
  );
}

export default ManageClass;
