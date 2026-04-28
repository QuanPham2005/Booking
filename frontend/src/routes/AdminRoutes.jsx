import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/Layouts/AdminLayout";
import AdminDashboard from "../Pages/Admin/Dashboard";
import ManageUsers from "../Pages/Admin/ManageUsers";
import ManageOrgUnits from "../Pages/Admin/ManageOrgUnits";
import Notifications from "../Pages/Admin/Notifications";
import Reports from "../Pages/Admin/Reports";

export const AdminRoutes = () => {
  return (
    <Routes>
      {/* parent is mounted at /admin/* from App.jsx */}
      <Route path="dashboard" element={<AdminLayout />}> 
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="org" element={<ManageOrgUnits />} />
        <Route path="students" element={<Navigate to="../users" replace />} />
        <Route path="lecturers" element={<Navigate to="../users" replace />} />
        <Route path="departments" element={<Navigate to="../org" replace />} />
        <Route path="majors" element={<Navigate to="../org" replace />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="reports" element={<Reports />} />
      </Route>
      {/* redirect bare /admin to dashboard */}
      <Route path="" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};


export default AdminRoutes;
