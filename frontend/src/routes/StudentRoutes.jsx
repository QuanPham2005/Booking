import { Routes, Route } from "react-router-dom";
import StudentDashboard from "../Pages/Student/Dashboard";
import SearchLecturer from "../Pages/Student/SearchLecturer";
import StudentLecturerDetail from "../Pages/Student/StudentLecturerDetail";
import BookAppointment from "../Pages/Student/BookAppointment";
import MyAppointments from "../Pages/Student/MyAppointments";
import Notifications from "../Pages/Student/Notifications";

export const StudentRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="dashboard/search" element={<SearchLecturer />} />
      <Route path="dashboard/lecturer/:id" element={<StudentLecturerDetail />} />
      <Route path="dashboard/book/form" element={<BookAppointment />} />
      <Route path="dashboard/appointments" element={<MyAppointments />} />
      <Route path="dashboard/notifications" element={<Notifications />} />
    </Routes>
  );
};

export default StudentRoutes;
