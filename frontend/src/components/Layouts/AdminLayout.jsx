import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import MainLayout from "../UI/MainLayout";
import {
  House,
  Users,
  Stack,
  ChartBar,
  Bell,
} from "phosphor-react";

const adminItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <House size={20} weight="duotone" />, exact: true },
  { label: "Quản lý người dùng", path: "/admin/dashboard/users", icon: <Users size={20} weight="duotone" /> },
  { label: "Quản lý Khoa/Ngành", path: "/admin/dashboard/org", icon: <Stack size={20} weight="duotone" /> },
  { label: "Notifications", path: "/admin/dashboard/notifications", icon: <Bell size={20} weight="duotone" /> },
  { label: "Reports", path: "/admin/dashboard/reports", icon: <ChartBar size={20} weight="duotone" /> },
];

export const AdminLayout = ({ notificationsCount = 0, user }) => {
  const location = useLocation();
  const segment = location.pathname.split("/").pop() || "dashboard";
  const titles = {
    dashboard: "Dashboard quản trị",
    users: "Quản lý người dùng",
    org: "Quản lý Khoa/Ngành",
    students: "Quản lý sinh viên",
    lecturers: "Quản lý giảng viên",
    departments: "Quản lý khoa",
    majors: "Quản lý ngành",
    notifications: "Thông báo hệ thống",
    reports: "Báo cáo tổng hợp",
  };
  const title = titles[segment] || "Admin";

  return (
    <MainLayout
      sidebarItems={adminItems}
      title={title}
      notificationsCount={notificationsCount}
      user={user || { name: localStorage.getItem("Admin Name") || "Admin" }}
      headerProps={{ bgClass: "bg-udck-primary text-white", textClass: "text-white" }}
    >
      <div className="px-6 py-6 bg-udck-muted min-h-screen">
        <Outlet />
      </div>
    </MainLayout>
  );
};

export default AdminLayout;
