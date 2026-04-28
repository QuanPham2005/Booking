import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Studentsignup from "./components/Signup/Student";
import Studentlogin from "./components/Login/StudentForm";
import Lecturerlogin from "./components/Login/LecturerForm";
import AdminLogin from "./components/Login/AdminForm";
import LandingPage from "./Pages/LandingPage";

// route groups
import StudentRoutes from "./routes/StudentRoutes";
import LecturerRoutes from "./routes/LecturerRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import PageTransition from "./components/UI/PageTransition";

import Navbar from "./components/UI/Navbar";
import NotFound from "./Pages/NotFound";
import TodayDate from "./components/UI/TodayDate";
import Spinner from "./components/UI/Spinner";

// legacy pages (to be removed later)
import ApproveStudent from "./Pages/ApproveStudent";

function App() {
  const location = useLocation();

  useEffect(() => {
    // Clear all login session when app starts
    // Uncomment the line below if you want to clear localStorage on every app reload
    // localStorage.clear();
    
    // Or if you want to clear only auth-related data:
    localStorage.removeItem("Teacher jwtToken");
    localStorage.removeItem("Student jwtToken");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("Student Name");
    localStorage.removeItem("Teacher Name");
    localStorage.removeItem("Admin Name");
    localStorage.removeItem("email");
    sessionStorage.clear();
    document.documentElement.classList.remove("dark");
  }, []);

  // Chỉ ẩn Navbar/TodayDate trong khu vực dashboard sau đăng nhập.
  // Các trang login/signup nên hiển thị đồng nhất cho cả Student/Teacher/Admin.
  const hideNav =
    location.pathname.startsWith("/student/dashboard") ||
    location.pathname.startsWith("/lecturer/dashboard") ||
    location.pathname.startsWith("/admin/dashboard");

  return (
    <>
      {!hideNav && <Navbar />}
      {!hideNav && <TodayDate />}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <LandingPage />
              </PageTransition>
            }
          />
          <Route
            path="/student/login"
            element={
              <PageTransition>
                <Studentlogin />
              </PageTransition>
            }
          />
          <Route
            path="/student/signup"
            element={
              <PageTransition>
                <Studentsignup />
              </PageTransition>
            }
          />
          <Route
            path="/teacher/login"
            element={
              <PageTransition>
                <Lecturerlogin />
              </PageTransition>
            }
          />
          <Route
            path="/admin/login"
            element={
              <PageTransition>
                <AdminLogin />
              </PageTransition>
            }
          />

          {/* role-based routes */}
          <Route path="/student/*" element={<StudentRoutes />} />
          <Route path="/lecturer/*" element={<LecturerRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />

          {/* legacy / misc */}
          <Route
            path="/student/notapproved"
            element={
              <PageTransition>
                <ApproveStudent />
              </PageTransition>
            }
          />
          <Route
            path="/spinner"
            element={
              <PageTransition>
                <Spinner />
              </PageTransition>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
