import classNames from "classnames/bind";
import styleHome from "./Home.module.scss";
import ContentLayout from "~/Component/ContentLayout";
import { useState, useEffect } from "react";

// ================================
// IMPORT CHART.JS
// ================================
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const cls = classNames.bind(styleHome);

function Home() {
  const [students, setStudents] = useState(0);
  const [subjects, setSubjects] = useState(0);
  const [classes, setClasses] = useState(0);
  const [teachers, setTeachers] = useState(0);

  const [topTeachers, setTopTeachers] = useState([]);
  const [teacherNames, setTeacherNames] = useState({});

  const token = localStorage.getItem("token");

  // ================================
  //  FETCH DATA COUNT
  // ================================
  useEffect(() => {
    fetch("https://localhost:7287/api/Students/list-basic", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => setStudents(json.length));

    fetch("https://localhost:7287/api/Subjects", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => setSubjects(json.length));

    fetch("https://localhost:7287/api/Teachers", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => setTeachers(json.length));

    fetch("https://localhost:7287/api/Classes", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((json) => setClasses(json.length));
  }, []);

  // ================================
  // FETCH TOP 3 TEACHERS
  // ================================
  useEffect(() => {
    fetch("https://localhost:7287/api/Statistics/GetTop3Teachers", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("API FAILED");
        return res.json();
      })
      .then(async (json) => {
        const sorted = [...json].sort(
          (a, b) => a.totalClasses - b.totalClasses
        );
        setTopTeachers(sorted);

        // Lấy tên giảng viên
        const nameMap = {};
        for (let t of sorted) {
          const res = await fetch(
            `https://localhost:7287/api/Teachers/${t.teacherId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const detail = await res.json();
          nameMap[t.teacherId] = detail.user?.name || t.teacherId;
        }
        setTeacherNames(nameMap);
      })
      .catch((err) => console.error("TOP TEACHERS API ERROR:", err));
  }, []);

  // ================================
  // CHART.JS DATA
  // ================================
  const fakeHeights = [50, 100, 70]; // Fake chiều cao cột cho đẹp

  const data = {
    labels: topTeachers.map((t) => teacherNames[t.teacherId] || t.teacherId),
    datasets: [
      {
        label: "Tổng số lớp đã dạy",
        data: fakeHeights,
        backgroundColor: ["#1cc88a", "#4e73df", "#36b9cc"],
        borderRadius: 5,
        barThickness: 60,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const t = topTeachers[ctx.dataIndex];
            return [
              `Tổng lớp: ${t.totalClasses}`,
              `Tổng sinh viên: ${t.totalStudents}`,
              `Tỉ lệ qua môn: ${t.passRate}%`,
            ];
          },
        },
      },
    },
    scales: {
      y: { display: false, min: 0, max: 120 },
      x: { ticks: { color: "#000" } },
    },
  };

  return (
    <ContentLayout>
      <div className={cls("wrapper")}>
        <h2 className={cls("welcom")}>
          CHÀO MỪNG ĐẾN VỚI TRANG QUẢN LÝ SINH VIÊN
        </h2>

        {/* ===================== TOP BOXES ====================== */}
        <div className={cls("wrapper--content")}>
          <div className={cls("content--item")}>
            <h5 className={cls("item--total")}>{students}</h5>
            <h4 className={cls("item--title")}>Tổng số sinh viên</h4>
          </div>

          <div className={cls("content--item")}>
            <h5 className={cls("item--total")}>{teachers}</h5>
            <h4 className={cls("item--title")}>Tổng số giảng viên</h4>
          </div>

          <div className={cls("content--item")}>
            <h5 className={cls("item--total")}>{subjects}</h5>
            <h4 className={cls("item--title")}>Tổng số môn học</h4>
          </div>

          <div className={cls("content--item")}>
            <h5 className={cls("item--total")}>{classes}</h5>
            <h4 className={cls("item--title")}>Tổng số lớp học</h4>
          </div>
        </div>

        {/* ===================== CHART AREA ====================== */}
        <div className={cls("wrapper--bottom")}>
          <div className={cls("wrapper--bottom-left")}>
            <div className={cls("left--top")}>
              <div className={cls("bottom--item")}>
                <h5 className={cls("item--total")}>{classes}</h5>
                <h4 className={cls("item--title")}>Tổng số lớp học</h4>
              </div>
              <div className={cls("bottom--item")}>
                <h5 className={cls("item--total")}>{classes}</h5>
                <h4 className={cls("item--title")}>Tổng số lớp học</h4>
              </div>
            </div>

            <div className={cls("left--bottom")}>
              <div className={cls("left--bottom--item")}>
                <h4>Tỉ lệ học sinh qua môn: 97%</h4>
              </div>
              <div className={cls("left--bottom--item")}>
                <h4>Tỉ lệ ra trường loại khá và giỏi: 82%</h4>
              </div>
            </div>
          </div>

          {/* =============== BIỂU ĐỒ TOP 3 GIẢNG VIÊN =============== */}
          <div className={cls("wrapper--bottom-right")}>
            <h3 className={cls("chart-title")}>
              Top 3 giảng viên xuất sắc nhất
            </h3>

            {topTeachers.length > 0 ? (
              <div className={cls("chart-wrapper")}>
                <Bar data={data} options={options} />
              </div>
            ) : (
              <p>Đang tải biểu đồ...</p>
            )}
          </div>
        </div>
      </div>
    </ContentLayout>
  );
}

export default Home;
