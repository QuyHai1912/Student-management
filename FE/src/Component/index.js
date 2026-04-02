const titleAdsmin = [
  { id: 1, label: "Trang chủ", to: "/adsmin" },
  { id: 2, label: "Quản lý tài khoản", to: "/adsmin/account" },
  { id: 3, label: "Quản lý môn học", to: "/adsmin/subject" },
  { id: 4, label: "Quản lý lớp học", to: "/adsmin/class" },
  { id: 5, label: "Bảo trì hệ thống", to: "/adsmin/system" },
];

const titleTeacher = [
  { id: 1, label: "Trang chủ", to: "/teacher" },
  { id: 2, label: "Quản lý điểm", to: "/teacher/point" },
  { id: 3, label: "Quản lý môn học", to: "/teacher/class" },
];

const titleAdvisor = [
  { id: 1, label: "Trang chủ", to: "/advisor" },
  { id: 2, label: "Quản lý sinh viên", to: "/advisor/students" },
  { id: 3, label: "Thống kê", to: "/advisor/statistical" },
  { id: 4, label: "Xem cảnh báo", to: "/advisor/warnning" },
];

export { titleAdsmin, titleTeacher, titleAdvisor };
