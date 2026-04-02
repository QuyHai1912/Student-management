import classNames from "classnames/bind";
import style from "./ManagePoint.module.scss";
import ContentLayout from "~/Component/ContentLayout";
import BaseTable from "~/Component/BaseTable";
import { useEffect, useState } from "react";

const cls = classNames.bind(style);

function ManagePoint() {
  const token = localStorage.getItem("token");

  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");

  const [scoreList, setScoreList] = useState([]);
  const [columns, setColumns] = useState([]);

  const [editingRows, setEditingRows] = useState({});

  // Tiện ích Làm sạch ID
  const cleanId = (value) => String(value ?? "").trim();

  // ============================================================
  // 1) LOAD DANH SÁCH LỚP
  // ============================================================
  const loadClassList = () => {
    fetch("https://localhost:7287/api/Teachers/classes/current", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setClassList(data);

        if (data.length > 0) {
          const first = data[0].id;
          setSelectedClass(first);
          loadScoreList(first);
        }
      });
  };

  // ============================================================
  // 2) LOAD DANH SÁCH ĐIỂM
  // ============================================================
  const loadScoreList = (classId) => {
    fetch(`https://localhost:7287/api/StudentSubjects/class/${classId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => ({
          ...item,
          pointTotal: Number(item.pointTotal).toFixed(2),
        }));

        setScoreList(formatted);
        setEditingRows({});
        generateColumns();
      });
  };

  // ============================================================
  // 3) TẠO CỘT
  // ============================================================
  const generateColumns = () => {
    setColumns([
      { key: "studentId", title: "Mã sinh viên" },
      { key: "studentName", title: "Tên sinh viên" },
      { key: "point1", title: "TX1" },
      { key: "point2", title: "TX2" },
      { key: "point3", title: "Cuối kỳ" },
      { key: "pointTotal", title: "Trung bình" },
    ]);
  };

  // ============================================================
  // 4) RENDER BẢNG + EDIT
  // ============================================================
  const tableData = scoreList.map((row) => {
    const isEditing = editingRows[row.studentId] !== undefined;
    const editValues = editingRows[row.studentId] || row;

    const makeInput = (key) => (
      <input
        type="number"
        className={cls("edit-input")}
        min={0}
        max={10}
        step={0.1}
        value={editValues[key] ?? ""}
        onChange={(e) => {
          let v = e.target.value;

          if (v === "") {
            setEditingRows({
              ...editingRows,
              [row.studentId]: { ...editValues, [key]: "" },
            });
            return;
          }

          let num = Number(v);
          if (isNaN(num) || num < 0 || num > 10) {
            alert("❌ Điểm phải từ 0 đến 10!");
            return;
          }

          setEditingRows({
            ...editingRows,
            [row.studentId]: { ...editValues, [key]: num },
          });
        }}
      />
    );

    return {
      ...row,
      point1: isEditing ? makeInput("point1") : row.point1,
      point2: isEditing ? makeInput("point2") : row.point2,
      point3: isEditing ? makeInput("point3") : row.point3,
      pointTotal: Number(row.pointTotal).toFixed(2),
    };
  });

  // ============================================================
  // 5) LƯU ĐIỂM 1 SINH VIÊN
  // ============================================================
  const handleSave = (row) => {
    const edit = editingRows[row.studentId];
    if (!edit) return;

    const bodyData = {
      point1: Number(edit.point1),
      point2: Number(edit.point2),
      point3: Number(edit.point3),
      soTietNghi: row.soTietNghi, // KHÔNG thay đổi
    };

    const studentId = cleanId(row.studentId);
    const subjectId = cleanId(row.subjectId);
    const semesterId = cleanId(row.semesterId);

    fetch(
      `https://localhost:7287/api/StudentSubjects/student-subject/${studentId}/${subjectId}/${semesterId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Update failed");
        return res.json();
      })
      .then(() => {
        const updated = scoreList.map((i) =>
          cleanId(i.studentId) === studentId
            ? {
                ...i,
                ...bodyData,
                pointTotal: (
                  (bodyData.point1 + bodyData.point2 + bodyData.point3) /
                  3
                ).toFixed(2),
              }
            : i
        );
        setScoreList(updated);

        const newEdit = { ...editingRows };
        delete newEdit[row.studentId];
        setEditingRows(newEdit);

        alert("✔ Lưu thành công!");
      })
      .catch(() => alert("❌ Lưu thất bại!"));
  };

  // ============================================================
  // 6) EXPORT FILE
  // ============================================================
  const handleExport = () => {
    fetch(
      `https://localhost:7287/api/StudentSubjects/class/${selectedClass}/export`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Diem_${selectedClass}.xlsx`;
        a.click();
      });
  };

  // ============================================================
  // ⭐ 7) GỬI DUYỆT ĐIỂM
  // ============================================================
  const handleSubmitScore = () => {
    if (!selectedClass) {
      alert("❌ Bạn chưa chọn lớp!");
      return;
    }

    if (!window.confirm("Bạn có chắc muốn gửi duyệt điểm lớp này?")) return;

    fetch(
      `https://localhost:7287/api/StudentSubjects/class/${selectedClass}/submit`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.text();
      })
      .then(() => {
        alert("✔ Gửi duyệt điểm thành công!");
        loadScoreList(selectedClass);
      })
      .catch(() => alert("❌ Gửi duyệt điểm thất bại!"));
  };

  // ============================================================
  // INIT
  // ============================================================
  useEffect(() => {
    loadClassList();
  }, []);

  useEffect(() => {
    if (selectedClass) loadScoreList(selectedClass);
  }, [selectedClass]);

  return (
    <ContentLayout>
      <div className="wrapper--btn">
        <div className={cls("head--left")}>
          <h2 className={cls("head--text")}>Nhập/Sửa điểm sinh viên</h2>

          <div className={cls("choose--class")}>
            <p className={cls("choose--text")}>Chọn lớp môn học</p>

            <select
              className={cls("choose--value")}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.subjectName} – {c.classId}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button className="btn--submit" onClick={handleSubmitScore}>
          Gửi duyệt
        </button>
      </div>

      <BaseTable
        columns={columns}
        data={tableData}
        height="450px"
        renderAction={(row) => {
          if (row.isApproved === 1)
            return (
              <button className="btn--approved" disabled>
                Đã duyệt
              </button>
            );

          if (editingRows[row.studentId])
            return (
              <button className="btn--save" onClick={() => handleSave(row)}>
                Lưu
              </button>
            );

          return (
            <button
              className="btn--edit"
              onClick={() =>
                setEditingRows({ ...editingRows, [row.studentId]: row })
              }
            >
              Sửa
            </button>
          );
        }}
      />

      <div className={`${cls("wrapper--foot")} wrapper--btn`}>
        <button className={cls("btn--print")} onClick={handleExport}>
          Xuất file
        </button>
      </div>
    </ContentLayout>
  );
}

export default ManagePoint;
