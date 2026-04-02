import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import style from "./AddSubject.module.scss";

const cls = classNames.bind(style);

function AddSubjectForm({ onSubmit, onClose }) {
  const [errors, setErrors] = useState({});
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách loại môn học từ API Subjects
  useEffect(() => {
    fetch("https://localhost:7287/api/Subjects")
      .then((res) => res.json())
      .then((data) => {
        // Lấy danh sách type duy nhất
        const uniqueTypes = [...new Set(data.map((s) => s.type))];
        setTypes(uniqueTypes);
        setLoading(false);
      })
      .catch((err) => {
        console.error("FETCH SUBJECT TYPES ERROR:", err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const name = form.get("name").trim();
    const soTc = Number(form.get("soTc"));
    const curriculumTerm = Number(form.get("curriculumTerm"));
    const type = form.get("type");

    let newErrors = {};

    if (!name) newErrors.name = "Tên môn học không được để trống";
    if (isNaN(soTc) || soTc < 1 || soTc > 9)
      newErrors.soTc = "Số tín chỉ phải nằm trong khoảng 1 - 9";
    if (isNaN(curriculumTerm) || curriculumTerm < 1 || curriculumTerm > 8)
      newErrors.curriculumTerm = "Kì học phải nằm trong khoảng 1 - 8";
    if (!type) newErrors.type = "Vui lòng chọn loại môn học";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      name,
      soTc,
      curriculumTerm,
      type,
    });
  };

  return (
    <form className="add--form" onSubmit={handleSubmit}>
      <h2 className="form--title">Thêm môn học</h2>

      <div className="form--group">
        <label className="form--label">Tên môn học</label>
        <input className="form--input" name="name" />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

      <div className="form--group">
        <label className="form--label">Số tín chỉ</label>
        <input className="form--input" type="number" name="soTc" />
        {errors.soTc && <p className="error">{errors.soTc}</p>}
      </div>

      <div className="form--group">
        <label className="form--label">Kì học</label>
        <input className="form--input" type="number" name="curriculumTerm" />
        {errors.curriculumTerm && (
          <p className="error">{errors.curriculumTerm}</p>
        )}
      </div>

      <div className="form--group">
        <label className="form--label">Loại môn học</label>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <select className="form--input" name="type">
            <option value="">-- Chọn loại môn học --</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}

        {errors.type && <p className="error">{errors.type}</p>}
      </div>

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

export default AddSubjectForm;
