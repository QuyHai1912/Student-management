import classNames from "classnames/bind";
import styleSubject from "./AdsminSubject.module.scss";
import ContentLayout from "~/Component/ContentLayout";
import BaseTable from "~/Component/BaseTable";
import ActionMenu from "~/Component/ActionMenu";
import { useState, useEffect } from "react";
import SeeDetailLayout from "~/Component/SeeDetailLayout";
import HandleAddItem from "~/Component/HandleAddItem";
import AddSubjectForm from "./AddSubject";
import EditSubject from "./EditSubject";

const cls = classNames.bind(styleSubject);

function AdsminSubject() {
  const [subject, setSubject] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const [openDetail, setOpenDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const [filterTerm, setFilterTerm] = useState("all");

  // === SEARCH STATE ===
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const columns = [
    { key: "id", title: "Mã môn học" },
    { key: "name", title: "Tên môn học" },
    { key: "soTc", title: "Số tín chỉ" },
    { key: "curriculumTerm", title: "Kì học" },
  ];

  const loadData = () => {
    fetch("https://localhost:7287/api/Subjects")
      .then((res) => res.json())
      .then((json) => {
        setSubject(json);
      })
      .catch((err) => console.error("API ERROR:", err));
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================= ADD SUBJECT =================
  const handleAddSubject = (newData) => {
    fetch("https://localhost:7287/api/Subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newData),
    })
      .then((res) => res.json())
      .then(() => {
        setOpenModal(false);
        alert("Thêm môn học mới thành công!");
        loadData();
      })
      .catch((err) => console.error("ADD ERROR:", err));
  };

  // ======================================
  // 🔍 REALTIME SEARCH
  // ======================================
  const handleSearchChange = (value) => {
    setSearchText(value);

    if (value.trim() === "") {
      setSearchResult(null);
      return;
    }

    const result = subject.filter((s) =>
      s.name.toLowerCase().includes(value.toLowerCase())
    );

    setSearchResult(result);
  };

  // ======================================
  // 🔎 CLICK BUTTON "TÌM"
  // ======================================
  const handleSearchClick = () => {
    if (searchText.trim() === "") {
      setSearchResult(null);
      return;
    }

    const result = subject.filter((s) =>
      s.name.toLowerCase().includes(searchText.toLowerCase())
    );

    setSearchResult(result);
  };

  // ======================================
  // 🎯 COMBINE SEARCH + FILTER TERM
  // ======================================
  let filteredSubjectsFinal = subject;

  // 1. Lọc theo kỳ học
  if (filterTerm !== "all") {
    filteredSubjectsFinal = filteredSubjectsFinal.filter(
      (s) => String(s.curriculumTerm) === String(filterTerm)
    );
  }

  // 2. Lọc theo tìm kiếm
  if (searchResult !== null) {
    filteredSubjectsFinal = filteredSubjectsFinal.filter((s) =>
      s.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  // ======================================
  // 🗑 DELETE SUBJECT
  // ======================================
  const handleDelete = (row) => {
    const isConfirm = window.confirm(
      `Bạn có chắc chắn muốn xoá môn học "${row.name}" (${row.id}) không?`
    );

    if (!isConfirm) return;

    fetch(`https://localhost:7287/api/Subjects/${row.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("DELETE FAILED");
      })
      .then(() => {
        loadData();
      })
      .catch((err) => {
        console.error("DELETE ERROR:", err);
        alert("Không thể xoá môn học. Vui lòng thử lại!");
      });
  };

  // ======================================
  // ✏️ EDIT SUBJECT
  // ======================================
  const handleEdit = (row) => {
    setEditingSubject(row);
    setOpenEdit(true);
  };

  const handleSubmitEdit = (updated) => {
    fetch(`https://localhost:7287/api/Subjects/${updated.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: updated.type,
        name: updated.name,
        soTc: updated.soTc,
        curriculumTerm: updated.curriculumTerm,
        status: updated.status,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed");
        return res.text();
      })
      .then(() => {
        loadData();
        setOpenEdit(false);
      })
      .catch((err) => console.error("UPDATE ERROR:", err));
  };

  // ======================================
  // 📌 DETAIL SUBJECT
  // ======================================
  const handleDetail = (row) => {
    fetch(`https://localhost:7287/api/Subjects/${row.id}`)
      .then((res) => res.json())
      .then((detail) => {
        setDetailData(detail);
        setOpenDetail(true);
      })
      .catch((err) => console.error("DETAIL ERROR:", err));
  };

  return (
    <ContentLayout>
      <div className="wrapper--btn">
        <button
          className={`${cls("btn--add")} button--add`}
          onClick={() => setOpenModal(true)}
        >
          Thêm môn học
        </button>

        {/* ================= SEARCH BOX ================= */}
        <div>
          <span className={cls("label--search")}>Tìm kiếm môn học: </span>
          <input
            className="input--search"
            type="input"
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Nhập tên môn học cần tìm ..."
          />
        </div>

        {/* ================= FILTER TERM ================= */}
        <div className={cls("wrapper--option")}>
          <p className={cls("option--label")}>Kì học: </p>
          <select
            className={cls("option--value")}
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
          >
            <option value="all">All</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ==================== SHOW TABLE OR MESSAGE ==================== */}
      {filteredSubjectsFinal.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "18px",
            color: "red",
          }}
        >
          Không có môn học cần tìm
        </p>
      ) : (
        <BaseTable
          columns={columns}
          data={filteredSubjectsFinal}
          renderAction={(row) => (
            <ActionMenu
              onDelete={() => handleDelete(row)}
              onEdit={() => handleEdit(row)}
              onDetail={() => handleDetail(row)}
            />
          )}
        />
      )}

      {/* ==================== ADD SUBJECT ==================== */}
      <HandleAddItem open={openModal} onClose={() => setOpenModal(false)}>
        <AddSubjectForm
          onSubmit={handleAddSubject}
          onClose={() => setOpenModal(false)}
        />
      </HandleAddItem>

      {/* ==================== EDIT SUBJECT ==================== */}
      {openEdit && editingSubject && (
        <HandleAddItem open={openEdit} onClose={() => setOpenEdit(false)}>
          <EditSubject
            editingSubject={editingSubject}
            onSubmit={handleSubmitEdit}
            onClose={() => setOpenEdit(false)}
          />
        </HandleAddItem>
      )}

      {/* ==================== DETAIL SUBJECT ==================== */}
      {openDetail && detailData && (
        <SeeDetailLayout
          title="Xem chi tiết môn học"
          open={openDetail}
          onClose={() => setOpenDetail(false)}
        >
          <p className="label--detail">
            <strong className="label--properties">Mã môn:</strong>{" "}
            {detailData.id}
          </p>
          <p className="label--detail">
            <strong className="label--properties">Tên môn học:</strong>{" "}
            {detailData.name}
          </p>
          <p className="label--detail">
            <strong className="label--properties">Loại môn học:</strong>{" "}
            {detailData.type}
          </p>
          <p className="label--detail">
            <strong className="label--properties">Số tín chỉ:</strong>{" "}
            {detailData.soTc}
          </p>
          <p className="label--detail">
            <strong className="label--properties">Kì học:</strong>{" "}
            {detailData.curriculumTerm}
          </p>
        </SeeDetailLayout>
      )}
    </ContentLayout>
  );
}

export default AdsminSubject;
