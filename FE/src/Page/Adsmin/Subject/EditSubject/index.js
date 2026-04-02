import { useState } from "react";
import classNames from "classnames/bind";
import style from "./EditSubject.module.scss";

const cls = classNames.bind(style);

function EditSubject({ editingSubject, onSubmit, onClose }) {
  const [errors, setErrors] = useState({});

  if (!editingSubject) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const name = form.get("name").trim();
    const soTc = Number(form.get("soTc"));
    const curriculumTerm = Number(form.get("curriculumTerm"));
    const type = form.get("type").trim();

    let newErrors = {};

    if (!name) newErrors.name = "Tên môn học không được để trống";

    if (isNaN(soTc) || soTc < 1 || soTc > 9) {
      newErrors.soTc = "Số tín chỉ phải nằm trong khoảng 1 - 9";
    }

    if (isNaN(curriculumTerm) || curriculumTerm < 1 || curriculumTerm > 8) {
      newErrors.curriculumTerm = "Kì học phải nằm trong khoảng 1 - 8";
    }

    if (!type) newErrors.type = "Loại môn học không được để trống";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    onSubmit({
      id: editingSubject.id, // ✔ Lấy id từ props
      name,
      soTc,
      curriculumTerm,
      type,
      status: editingSubject.status, // ✔ Gửi status kèm theo
    });
  };

  return (
    <form className="add--form" onSubmit={handleSubmit}>
      <h2 className="form--title">Sửa môn học</h2>

      <div className="form--group">
        <label className="form--label">Tên môn học</label>
        <input
          className="form--input"
          name="name"
          defaultValue={editingSubject.name}
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

      <div className="form--group">
        <label className="form--label">Số tín chỉ</label>
        <input
          className="form--input"
          type="number"
          name="soTc"
          defaultValue={editingSubject.soTc}
        />
        {errors.soTc && <p className="error">{errors.soTc}</p>}
      </div>

      <div className="form--group">
        <label className="form--label">Kì học</label>
        <input
          className="form--input"
          type="number"
          name="curriculumTerm"
          defaultValue={editingSubject.curriculumTerm}
        />
        {errors.curriculumTerm && (
          <p className="error">{errors.curriculumTerm}</p>
        )}
      </div>

      <div className="form--group">
        <label className="form--label">Loại môn học</label>
        <input
          className="form--input"
          name="type"
          defaultValue={editingSubject.type}
        />
        {errors.type && <p className="error">{errors.type}</p>}
      </div>

      <div className="actions">
        <button type="button" className="btn--close" onClick={onClose}>
          Hủy
        </button>
        <button type="submit" className={`${cls("btn--submit")} btn--submit`}>
          Cập nhật
        </button>
      </div>
    </form>
  );
}

export default EditSubject;
