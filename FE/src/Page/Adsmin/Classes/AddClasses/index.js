import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import style from "./AddClasses.module.scss";

const cls = classNames.bind(style);

function AddClasses({ onSubmit, onClose }) {
  const [errors, setErrors] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [loadingTeacher, setLoadingTeacher] = useState(false);
  const token = localStorage.getItem("token");

  // ===== GET SUBJECT LIST =====
  useEffect(() => {
    fetch("https://localhost:7287/api/Subjects", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSubjects(data))
      .catch(console.error);
  }, []);

  // ===== FILTER SUBJECTS WHEN TYPING =====
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredSubjects([]);
      return;
    }

    setFilteredSubjects(
      subjects.filter((s) =>
        s.name.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText, subjects]);

  // ===== SELECT SUBJECT =====
  const handleSelectSubject = (sub) => {
    setSelectedSubject(sub);
    setSearchText(sub.name);
    setFilteredSubjects([]);

    loadTeachers(sub.id);
  };

  // ===== LOAD TEACHERS BY SUBJECT =====
  const loadTeachers = (subjectId) => {
    setLoadingTeacher(true);

    fetch(`https://localhost:7287/api/Teachers/by-subject/${subjectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setTeachers(data))
      .catch(console.error)
      .finally(() => setLoadingTeacher(false));
  };

  // ===== VALIDATE =====
  const validate = (data) => {
    let err = {};

    if (!selectedSubject) err.subject = "Vui lòng chọn môn học";
    if (!data.teacherId) err.teacherId = "Vui lòng chọn giảng viên";
    if (!data.semesterId) err.semesterId = "Vui lòng nhập kì học";
    if (!data.dayOfWeek) err.dayOfWeek = "Vui lòng nhập thứ";
    if (!data.startPeriod) err.startPeriod = "Nhập tiết bắt đầu";
    if (!data.endPeriod) err.endPeriod = "Nhập tiết kết thúc";
    if (!data.room.trim()) err.room = "Vui lòng nhập phòng học";
    if (!data.maxStudents) err.maxStudents = "Nhập số lượng tối đa";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ===== SUBMIT FORM =====
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      className: "", // backend tự tạo
      subjectId: selectedSubject.id,
      semesterId: e.target.semesterId.value,
      teacherId: e.target.teacherId.value,
      maxStudents: Number(e.target.maxStudents.value),
      dayOfWeek: Number(e.target.dayOfWeek.value),
      startPeriod: Number(e.target.startPeriod.value),
      endPeriod: Number(e.target.endPeriod.value),
      room: e.target.room.value,
      type: selectedSubject.type,
      note: "",
    };

    if (!validate(data)) return;

    onSubmit(data); // gửi dữ liệu lên AdsminClass
  };

  return (
    <form className="add--form" onSubmit={handleSubmit}>
      <h2 className="form--title">Thêm lớp học</h2>

      {/* MÔN HỌC */}
      <div className={`${cls("form--suggest")} form--group`}>
        <label className="form--label">Môn học</label>

        <input
          className="form--input"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            setSelectedSubject(null);
          }}
          placeholder="Nhập tên môn học..."
        />

        {/* DANH SÁCH GỢI Ý */}
        {filteredSubjects.length > 0 && (
          <ul className={cls("suggest--list")}>
            {filteredSubjects.map((sub) => (
              <li
                key={sub.id}
                onClick={() => handleSelectSubject(sub)}
                className={cls("suggest--item")}
              >
                {sub.id} - {sub.name}
              </li>
            ))}
          </ul>
        )}

        {errors.subject && <p className="error">{errors.subject}</p>}
      </div>

      {/* GIẢNG VIÊN */}
      <div className="form--group">
        <label className="form--label">Giảng viên</label>

        {loadingTeacher ? (
          <p>Đang tải giảng viên...</p>
        ) : teachers.length === 0 ? (
          <p>Không có giảng viên cho môn này</p>
        ) : (
          <select className="form--input" name="teacherId">
            <option value="">-- Chọn giảng viên --</option>
            {teachers.map((t) => (
              <option key={t.teacherId} value={t.teacherId}>
                {t.name}
              </option>
            ))}
          </select>
        )}

        {errors.teacherId && <p className="error">{errors.teacherId}</p>}
      </div>

      {/* KÌ HỌC */}
      <div className="form--group">
        <label className="form--label">Kì học</label>
        <input className="form--input" type="number" name="semesterId" />
        {errors.semesterId && <p className="error">{errors.semesterId}</p>}
      </div>

      {/* THỨ */}
      <div className="form--group">
        <label className="form--label">Thứ</label>
        <input className="form--input" type="number" name="dayOfWeek" />
        {errors.dayOfWeek && <p className="error">{errors.dayOfWeek}</p>}
      </div>

      {/* TIẾT BẮT ĐẦU */}
      <div className="form--group">
        <label className="form--label">Tiết bắt đầu</label>
        <input className="form--input" type="number" name="startPeriod" />
        {errors.startPeriod && <p className="error">{errors.startPeriod}</p>}
      </div>

      {/* TIẾT KẾT THÚC */}
      <div className="form--group">
        <label className="form--label">Tiết kết thúc</label>
        <input className="form--input" type="number" name="endPeriod" />
        {errors.endPeriod && <p className="error">{errors.endPeriod}</p>}
      </div>

      {/* PHÒNG HỌC */}
      <div className="form--group">
        <label className="form--label">Phòng học</label>
        <input className="form--input" name="room" />
        {errors.room && <p className="error">{errors.room}</p>}
      </div>

      {/* SỐ LƯỢNG TỐI ĐA */}
      <div className="form--group">
        <label className="form--label">Số lượng tối đa</label>
        <input className="form--input" type="number" name="maxStudents" />
        {errors.maxStudents && <p className="error">{errors.maxStudents}</p>}
      </div>

      {/* BUTTON */}
      <div className="actions">
        <button type="button" className="btn--close" onClick={onClose}>
          Hủy
        </button>
        <button type="submit" className="btn--submit">
          Tạo
        </button>
      </div>
    </form>
  );
}

export default AddClasses;
