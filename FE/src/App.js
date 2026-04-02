import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Page/LoginPage";

import AdsminLayout from "./Layout/AdsminLayout";
import Home from "./Page/Home";
import AdsminAcount from "./Page/Adsmin/Account";
import AdsminClass from "./Page/Adsmin/Classes";
import AdsminPause from "./Page/Adsmin/Pause";
import AdsminSubject from "./Page/Adsmin/Subject";

import TeacherLayout from "./Layout/TeacherLayout";
import ManagePoint from "./Page/Teacher/ManagePoint";
import ManageClass from "./Page/Teacher/ManageClass";

import AdvisorLayout from "./Layout/AdvisorLayout";
import StatisticalLayout from "./Page/Advisor/Statistical";
import WarnningLayout from "./Page/Advisor/Warnning";
import StudentLayout from "./Page/Advisor/Students";

import RequireAuth from "./Component/RequireAuth/RequireAuth";
import RequireRole from "./Component/RequireRole/RequireRole";

// import RequireAuth from "./Component/RequireAuth";
// import RequireRole from "./Component/RequireRole";

function App() {
  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* ---------------- ADMIN ---------------- */}
        <Route
          path="/adsmin"
          element={
            <RequireRole roles={["Admin", "Adsmin"]}>
              <AdsminLayout />
            </RequireRole>
          }
        >
          <Route index element={<Home />} />
          <Route path="account" element={<AdsminAcount />} />
          <Route path="subject" element={<AdsminSubject />} />
          <Route path="class" element={<AdsminClass />} />
          <Route path="system" element={<AdsminPause />} />
        </Route>

        {/* ---------------- TEACHER ---------------- */}
        <Route
          path="/teacher"
          element={
            <RequireRole roles={["Teacher"]}>
              <TeacherLayout />
            </RequireRole>
          }
        >
          <Route index element={<Home />} />
          <Route path="point" element={<ManagePoint />} />
          <Route path="class" element={<ManageClass />} />
        </Route>

        {/* ---------------- ADVISOR ---------------- */}
        <Route
          path="/advisor"
          element={
            <RequireRole roles={["Advisor"]}>
              <AdvisorLayout />
            </RequireRole>
          }
        >
          <Route index element={<Home />} />
          <Route path="students" element={<StudentLayout />} />
          <Route path="statistical" element={<StatisticalLayout />} />
          <Route path="warnning" element={<WarnningLayout />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
