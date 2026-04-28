/**
 * StudentLayout: wraps pages with sidebar and header for student role
 */
import React from "react";
import { useLocation } from "react-router-dom";
import { MainLayout } from "../UI/MainLayout";
import PageTransition from "../UI/PageTransition";
import {
  House,
  MagnifyingGlass,
  Calendar,
  Bell,
} from "phosphor-react";

export const StudentLayout = ({ title, notificationsCount = 0, user, children }) => {
  const location = useLocation();
  const items = [
    {
      path: "/student/dashboard",
      label: "Dashboard",
      icon: <House size={20} weight="duotone" />,
      exact: true,
    },
    {
      path: "/student/dashboard/search",
      label: "Giảng viên",
      icon: <MagnifyingGlass size={20} weight="duotone" />,
    },
    {
      path: "/student/dashboard/appointments",
      label: "Lịch hẹn của tôi",
      icon: <Calendar size={20} weight="duotone" />,
    },
    {
      path: "/student/dashboard/notifications",
      label: "Thông báo",
      icon: <Bell size={20} weight="duotone" />,
    },
  ];

  return (
    <MainLayout sidebarItems={items} title={title} notificationsCount={notificationsCount} user={user}>
      <PageTransition key={location.pathname}>{children}</PageTransition>
    </MainLayout>
  );
};

export default StudentLayout;
