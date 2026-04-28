import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MainLayout } from "../UI/MainLayout";
import PageTransition from "../UI/PageTransition";
import { House, User, Clock, CheckCircle, Bell } from "phosphor-react";

export const LecturerLayout = ({ title, notificationsCount = 0 }) => {
  const location = useLocation();
  const [user, setUser] = useState({});

  useEffect(() => {
    const userName = localStorage.getItem("Teacher Name") || "Người dùng";
    setUser({ name: userName });
  }, []);

  const items = [
      { path: "/lecturer/dashboard", label: "Dashboard", icon: <House size={20} weight="duotone" />, exact: true },
      { path: "/lecturer/dashboard/profile", label: "Hồ sơ cá nhân", icon: <User size={20} weight="duotone" /> },
      { path: "/lecturer/dashboard/slots", label: "Quản lý lịch rảnh", icon: <Clock size={20} weight="duotone" /> },
      { path: "/lecturer/dashboard/requests", label: "Yêu cầu tư vấn", icon: <CheckCircle size={20} weight="duotone" /> },
      { path: "/lecturer/dashboard/notifications", label: "Thông báo", icon: <Bell size={20} weight="duotone" /> },
  ];

  return (
    <MainLayout sidebarItems={items} title={title} notificationsCount={notificationsCount} user={user}>
      <PageTransition key={location.pathname}>
        <Outlet />
      </PageTransition>
    </MainLayout>
  );
};

export default LecturerLayout;
