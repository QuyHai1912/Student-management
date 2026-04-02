import classNames from "classnames/bind";
import style from "./Statistical.module.scss";
import ContentLayout from "~/Component/ContentLayout";
import { useState, useEffect } from "react";

// Chart.js
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const cls = classNames.bind(style);

function StatisticalLayout() {
  const [gpaData, setGpaData] = useState([]);

  // ---------------- CALL API GPA ----------------
  const fetchGPA = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "https://localhost:7287/api/Statistics/gpa/student-average",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setGpaData(data);
    } catch (err) {
      console.error("Error fetching GPA:", err);
    }
  };

  useEffect(() => {
    fetchGPA();
  }, []);

  // ---------------- PHÂN LOẠI GPA ----------------
  const count = {
    excellent: 0, // Xuất sắc > 9.2
    good: 0, // Giỏi > 8
    pretty: 0, // Khá > 6.6
    average: 0, // Trung bình > 5.5
    weak: 0, // Yếu <= 5.5
  };

  gpaData.forEach((item) => {
    const gpa = item.avgGPA;

    if (gpa > 9.2) count.excellent++;
    else if (gpa > 8) count.good++;
    else if (gpa > 6.6) count.pretty++;
    else if (gpa > 5.5) count.average++;
    else count.weak++;
  });

  // ---------------- CHUẨN BỊ DỮ LIỆU BIỂU ĐỒ ----------------
  const chartData = {
    labels: [
      "Xuất sắc (>9.2)",
      "Giỏi (>8)",
      "Khá (>6.6)",
      "Trung bình (>5.5)",
      "Yếu (<=5.5)",
    ],
    datasets: [
      {
        label: "Số lượng sinh viên",
        data: [
          count.excellent,
          count.good,
          count.pretty,
          count.average,
          count.weak,
        ],
        backgroundColor: [
          "#4CAF50",
          "#64B5F6",
          "#FFD54F",
          "#FFB74D",
          "#E57373",
        ],
        borderRadius: 0,
        barThickness: 80,
      },
    ],
  };

  const maxValue = Math.max(
    count.excellent,
    count.good,
    count.pretty,
    count.average,
    count.weak
  );

  // ---------------- PLUGIN HIỆN SỐ TRÊN ĐẦU CỘT ----------------
  const showValueOnTop = {
    id: "showValueOnTop",
    afterDraw(chart) {
      const { ctx } = chart;

      chart.data.datasets.forEach((dataset, i) => {
        const meta = chart.getDatasetMeta(i);

        meta.data.forEach((bar, index) => {
          const value = dataset.data[index];

          // Không hiển thị nếu giá trị = 0 để tránh rối
          if (value === 0) return;

          ctx.save();
          ctx.font = "bold 14px sans-serif";
          ctx.fillStyle = "#000";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";

          const x = bar.x;
          const y = bar.y - 8; // cách đỉnh cột 8px

          ctx.fillText(value, x, y);
          ctx.restore();
        });
      });
    },
  };

  // ---------------- OPTIONS ----------------
  const options = {
    responsive: true,
    maintainAspectRatio: false,

    // Quan trọng! Không có animation plugin sẽ không vẽ text
    animation: {
      duration: 1,
    },

    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Số lượng sinh viên: ${context.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        suggestedMin: 0,
        suggestedMax: maxValue + 50,
      },
    },
  };

  return (
    <ContentLayout>
      <div className={cls("wrapper")}>
        <h2 className={cls("title")}>Thống kê xếp loại GPA</h2>

        <div style={{ width: "100%", height: "550px", paddingTop: "20px" }}>
          <Bar data={chartData} options={options} plugins={[showValueOnTop]} />
        </div>
      </div>
    </ContentLayout>
  );
}

export default StatisticalLayout;
