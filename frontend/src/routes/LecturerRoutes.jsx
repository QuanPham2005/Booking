import { Routes, Route } from "react-router-dom";
import LecturerLayout from "../components/Layouts/LecturerLayout";
import Dashboard from "../Pages/Lecturer/Dashboard";
import Profile from "../Pages/Lecturer/Profile";
import ManageSlots from "../Pages/Lecturer/ManageSlots";
import PendingRequests from "../Pages/Lecturer/PendingRequests";
import Notifications from "../Pages/Lecturer/Notifications";

export const LecturerRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<LecturerLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="slots" element={<ManageSlots />} />
      <Route path="requests" element={<PendingRequests />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
};

export default LecturerRoutes;
