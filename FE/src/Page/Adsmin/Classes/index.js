import classNames from "classnames/bind";
import styleClasses from "./AdsminClasses.module.scss";
import ContentLayout from "~/Component/ContentLayout";
import ActionMenu from "~/Component/ActionMenu";
import BaseTable from "~/Component/BaseTable";
import { useState, useEffect } from "react";
import HandleAddItem from "~/Component/HandleAddItem";
import SeeDetailLayout from "~/Component/SeeDetailLayout";
import AddClasses from "./AddClasses";

const cls = classNames.bind(styleClasses);

function AdsminClass() {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjects, setSubjects] = useState([]);

  const [openModal, setOpenModal] = useState(false);

  const [detailData, setDetailData] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);

  const [broswerList, setBroswerList] = useState([]);
  const [openListBroswer, setOpenListBroswer] = useState(false);

  const [loadingBroswer, setLoadingBroswer] = useState(false); // ⭐ LOADING

  const token = localStorage.getItem("token");

  const columns = [
    { key: "classId", title: "Mã lớp học" },
    { key: "subjectName", title: "Tên môn học" },
    { key: "teacherName", title: "Giảng viên" },
    { key: "currentStudents", title: "Số lượng" },
    { key: "room", title: "Phòng học" },
  ];

  // ========================= LOAD CLASS LIST =========================
  const loadClasses = () => {
    fetch("https://localhost:7287/api/Classes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setClasses(data);
        setFilteredClasses(data);

        const uniqueSubjects = [...new Set(data.map((i) => i.subjectName))];
        setSubjects(uniqueSubjects);
      })
      .catch((err) => console.error("FETCH CLASSES ERROR:", err));
  };

  useEffect(() => {
    loadClasses();
    loadBroswerList();
  }, []);

  // ========================= FILTER BY SUBJECT =========================
  const handleFilterSubject = (value) => {
    setSelectedSubject(value);

    if (value === "") setFilteredClasses(classes);
    else
      setFilteredClasses(classes.filter((item) => item.subjectName === value));
  };

  // ========================= ADD CLASS =========================
  const handleAddClass = (newData) => {
    fetch("https://localhost:7287/api/Classes/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tạo lớp");
        return res.json();
      })
      .then(() => {
        alert("Tạo lớp thành công!");
        setOpenModal(false);
        loadClasses();
      })
      .catch((err) => console.error("CREATE CLASS ERROR:", err));
  };

  // ========================= CLASS DETAIL =========================
  const handleDetail = (row) => {
    fetch("https://localhost:7287/api/Classes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const detail = data.find((c) => c.classId === row.classId);
        setDetailData(detail);
        setOpenDetail(true);
      })
      .catch(console.error);
  };

  // ========================= DELETE CLASS =========================
  const handleDelete = (row) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa lớp học ${row.classId} không?`
    );
    if (!confirmDelete) return;

    fetch(`https://localhost:7287/api/Classes/soft/${row.classId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Không thể xóa lớp học");
        return res.text();
      })
      .then(() => {
        alert("Xóa lớp học thành công!");
        loadClasses();
      })
      .catch((err) => {
        console.error("DELETE CLASS ERROR:", err);
        alert("Xóa thất bại! Vui lòng thử lại.");
      });
  };

  // =======================================================================
  //          >>>>>>>>>>>>>   LOAD LIST CẦN DUYỆT  <<<<<<<<<<<<<<
  // =======================================================================

  const loadBroswerList = async () => {
    try {
      setLoadingBroswer(true); // ⭐ BẮT ĐẦU LOADING

      const resPending = await fetch(
        "https://localhost:7287/api/StudentSubjects/class/status?approved=false",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const resApproved = await fetch(
        "https://localhost:7287/api/StudentSubjects/class/status?approved=true",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const listPending = await resPending.json();
      const listApproved = await resApproved.json();

      const merged = [...listPending, ...listApproved];

      const filtered = merged.filter(
        (item) =>
          (item.isApproved === false && item.hasSubmitted === true) ||
          (item.isApproved === true && item.hasSubmitted === false)
      );

      filtered.sort((a, b) => {
        const aPending = a.isApproved === false && a.hasSubmitted === true;
        const bPending = b.isApproved === false && b.hasSubmitted === true;
        return aPending === bPending ? 0 : aPending ? -1 : 1;
      });

      setBroswerList(filtered);
    } catch (err) {
      console.error("LOAD BROWSER ERROR:", err);
    } finally {
      setLoadingBroswer(false); // ⭐ TẮT LOADING
    }
  };

  // ========================= APPROVE CLASS =========================
  const handleBroswer = (row) => {
    if (!window.confirm("Bạn có chắc muốn duyệt lớp này?")) return;

    fetch(
      `https://localhost:7287/api/StudentSubjects/class/${row.classId}/approve`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Duyệt thất bại!");
        return res.text();
      })
      .then(() => {
        alert("Duyệt thành công!");
        loadBroswerList();
      })
      .catch((err) => console.error("APPROVE ERROR:", err));
  };

  // ========================= BROWSER TABLE COLUMNS =========================
  const columnsBroswer = [
    { key: "id", title: "ID" },
    { key: "className", title: "ID lớp học" },
    { key: "subjectId", title: "ID môn học" },
    { key: "statusView", title: "Trạng thái" },
  ];

  const broswerListFiltered = broswerList.filter(
    (item) =>
      item.isApproved === true ||
      (item.isApproved === false && item.hasSubmitted === true)
  );

  const broswerListDisplay = broswerListFiltered.map((item) => ({
    ...item,
    id: item.classId,
    statusView:
      item.isApproved === true ? (
        <span style={{ color: "green", fontWeight: "600" }}>Đã duyệt</span>
      ) : (
        <span style={{ color: "red", fontWeight: "600" }}>Chờ duyệt</span>
      ),
  }));

  return (
    <ContentLayout>
      <div className="wrapper--btn">
        <div className={cls("wrapper--left")}>
          <button
            className={`${cls("btn--add")} button--add`}
            onClick={() => setOpenModal(true)}
          >
            Thêm lớp học
          </button>

          <div className={cls("wrapper--choose")}>
            <p className={cls("choose--label")}>Chọn môn học</p>

            <select
              className="form--input"
              value={selectedSubject}
              onChange={(e) => handleFilterSubject(e.target.value)}
            >
              <option value="">-- Tất cả môn học --</option>

              {subjects.map((sub, index) => (
                <option key={index} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          className={`${cls("btn--browse")} btn--right`}
          onClick={() => {
            setOpenListBroswer(true);
            loadBroswerList(); // ⭐ tải lại khi mở modal
          }}
        >
          Danh sách lớp cần duyệt
        </button>
      </div>

      {/* TABLE LIST CLASS */}
      <BaseTable
        columns={columns}
        data={filteredClasses}
        renderAction={(row) => (
          <ActionMenu
            onDelete={() => handleDelete(row)}
            onDetail={() => handleDetail(row)}
          />
        )}
      />

      {/* MODAL ADD CLASS */}
      <HandleAddItem open={openModal} onClose={() => setOpenModal(false)}>
        <AddClasses
          onSubmit={handleAddClass}
          onClose={() => setOpenModal(false)}
        />
      </HandleAddItem>

      {/* MODAL DETAIL */}
      <SeeDetailLayout
        title="Chi tiết lớp học"
        open={openDetail}
        onClose={() => setOpenDetail(false)}
      >
        {detailData && (
          <>
            <p className="label--detail">
              <strong className="label--properties">Mã lớp:</strong>{" "}
              {detailData.classId}
            </p>
            <p className="label--detail">
              <strong className="label--properties">Mã môn:</strong>{" "}
              {detailData.subjectId}
            </p>
            <p className="label--detail">
              <strong className="label--properties">Tên môn học:</strong>{" "}
              {detailData.subjectName}
            </p>
            <p className="label--detail">
              <strong className="label--properties">Giảng viên:</strong>{" "}
              {detailData.teacherName}
            </p>
            <p className="label--detail">
              <strong className="label--properties">Kì học:</strong>{" "}
              {detailData.semesterId}
            </p>
            <p className="label--detail">
              <strong className="label--properties">Thứ:</strong>{" "}
              {detailData.dayOfWeek}
            </p>
            <p className="label--detail">
              <strong className="label--properties">Tiết học:</strong>{" "}
              {detailData.startPeriod} – {detailData.endPeriod}
            </p>
            <p className="label--detail">
              <strong className="label--properties">Phòng học:</strong>{" "}
              {detailData.room}
            </p>
          </>
        )}
      </SeeDetailLayout>

      {/* ===================== LIST NEED APPROVE ===================== */}
      <SeeDetailLayout
        title="Danh sách lớp cần duyệt"
        open={openListBroswer}
        onClose={() => setOpenListBroswer(false)}
      >
        {loadingBroswer ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div className={cls("loading--spinner")} />
            <p style={{ marginTop: "10px", fontWeight: 600 }}>
              Đang tải dữ liệu...
            </p>
          </div>
        ) : (
          <BaseTable
            columns={columnsBroswer}
            data={broswerListDisplay}
            renderAction={(row) => (
              <>
                {row.isApproved === false && row.hasSubmitted === true ? (
                  <button
                    className={cls("btn--broswer")}
                    onClick={() => handleBroswer(row)}
                  >
                    Duyệt
                  </button>
                ) : (
                  <button className={cls("btn--approved")} disabled>
                    Đã duyệt
                  </button>
                )}
              </>
            )}
          />
        )}
      </SeeDetailLayout>
    </ContentLayout>
  );
}

export default AdsminClass;
