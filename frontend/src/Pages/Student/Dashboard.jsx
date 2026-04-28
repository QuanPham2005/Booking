import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CalendarBlank,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  MapPin,
  User,
  Bell,
  Warning,
  ArrowClockwise,
} from "phosphor-react";
import StudentLayout from "../../components/Layouts/StudentLayout";
import { Card, Button } from "../../components/UI";

// Memoized Skeleton components for better performance
const StatsSkeleton = memo(() => (
  <Card className="bg-white border-0 rounded-2xl p-6 animate-pulse shadow-sm">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="p-3 rounded-xl bg-gray-200 w-14 h-14 ml-4"></div>
    </div>
  </Card>
));

const AppointmentSkeleton = memo(() => (
  <Card className="bg-white border-0 rounded-2xl p-6 animate-pulse shadow-sm">
    <div className="flex items-start gap-4">
      <div className="bg-gray-200 p-3 rounded-xl flex-shrink-0 w-12 h-12"></div>
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  </Card>
));

const fadeUpVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Memoized Stats Card component
const StatsCard = memo(({ title, value, icon: Icon, color, isLoading }) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    green: "text-green-600 bg-green-50 border-green-100",
  };

  if (isLoading) {
    return <StatsSkeleton />;
  }

  return (
    <Card className={`bg-white border-0 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03] cursor-pointer group ${colorClasses[color] || colorClasses.blue}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2 group-hover:text-gray-800 transition-colors">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 ${colorClasses[color]?.replace('border-', 'bg-') || 'bg-blue-100'}`}>
          <Icon size={28} className={`${colorClasses[color]?.split(' ')[0] || 'text-blue-600'} group-hover:scale-110 transition-transform duration-300`} weight="duotone" />
        </div>
      </div>
    </Card>
  );
});

// Memoized Appointment Card component
const AppointmentCard = memo(({ appointment, onClick }) => {
  const getStatusIcon = (status) => {
    const st = status?.toLowerCase() || "";
    if (st.includes("completed")) return <CheckCircle size={20} className="text-green-500" weight="fill" />;
    if (st.includes("pending") || st.includes("chờ")) return <Clock size={20} className="text-yellow-500" weight="fill" />;
    if (st.includes("expired") || st.includes("quá hạn")) return <XCircle size={20} className="text-orange-500" weight="fill" />;
    if (st.includes("cancelled") || st.includes("hủy")) return <XCircle size={20} className="text-red-500" weight="fill" />;
    return <CalendarBlank size={20} className="text-blue-500" weight="fill" />;
  };

  const getStatusBadgeClass = (status) => {
    const st = status?.toLowerCase() || "";
    if (st.includes("completed")) return "bg-green-100 text-green-800";
    if (st.includes("pending") || st.includes("chờ")) return "bg-yellow-100 text-yellow-800";
    if (st.includes("expired") || st.includes("quá hạn")) return "bg-orange-100 text-orange-800";
    if (st.includes("cancelled") || st.includes("hủy")) return "bg-red-100 text-red-800";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <Card
      className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Lịch hẹn với ${appointment.lecturerName || appointment.name}`}
    >
      <div className="flex items-start gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300">
          <User size={24} className="text-white" weight="duotone" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors truncate">
              {appointment.lecturerName || appointment.name || "Giảng viên"}
            </h3>
            <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap transition-all duration-300 ${getStatusBadgeClass(appointment.status)}`}>
              {appointment.status || "Pending"}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            {appointment.domain && (
              <p className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md inline-block">
                {appointment.domain}
              </p>
            )}
            {(appointment.date || appointment.time) && (
              <div className="flex items-center gap-2 text-gray-600">
                <CalendarBlank size={16} className="text-blue-500" />
                <span className="font-medium">
                  {appointment.date}
                  {appointment.time && ` • ${appointment.time}`}
                </span>
              </div>
            )}
            {appointment.location && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={16} className="text-red-500" />
                <span className="font-medium">{appointment.location}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          {getStatusIcon(appointment.status)}
        </div>
      </div>
    </Card>
  );
});

const StudentDashboard = () => {
  const navigate = useNavigate();
  const studentName = localStorage.getItem("Student Name") || "Sinh viên";
  const [stats, setStats] = useState({
    upcoming: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
    expired: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const jwt_token = useCallback(() => localStorage.getItem("Student jwtToken"), []);

  const fetchData = useCallback(async (showToast = false) => {
    try {
      setLoading(true);
      const token = jwt_token();
      if (!token) {
        navigate("/student/login");
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/student/appointments/dashboard`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data.data || {};

      setStats({
        upcoming: data.upcoming || 0,
        pending: data.pending || 0,
        completed: data.completed || 0,
        cancelled: data.cancelled || 0,
        expired: data.expired || 0,
      });
      setAppointments(data.recentAppointments || []);

      if (showToast) {
        toast.success("Đã cập nhật dữ liệu!");
      }
    } catch (err) {
      console.error("[StudentDashboard] Fetch error:", err);
      toast.error("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [jwt_token, navigate]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData(true);
    setRefreshing(false);
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatusIcon = (status) => {
    const st = status?.toLowerCase() || "";
    if (st.includes("completed")) return <CheckCircle size={20} className="text-green-500" weight="fill" />;
    if (st.includes("pending") || st.includes("chờ")) return <Clock size={20} className="text-yellow-500" weight="fill" />;
    if (st.includes("expired") || st.includes("quá hạn")) return <XCircle size={20} className="text-orange-500" weight="fill" />;
    if (st.includes("cancelled") || st.includes("hủy")) return <XCircle size={20} className="text-red-500" weight="fill" />;
    return <CalendarBlank size={20} className="text-blue-500" weight="fill" />;
  };

  const getStatusBadgeClass = (status) => {
    const st = status?.toLowerCase() || "";
    if (st.includes("completed")) return "bg-green-100 text-green-800";
    if (st.includes("pending") || st.includes("chờ")) return "bg-yellow-100 text-yellow-800";
    if (st.includes("expired") || st.includes("quá hạn")) return "bg-orange-100 text-orange-800";
    if (st.includes("cancelled") || st.includes("hủy")) return "bg-red-100 text-red-800";
    return "bg-blue-100 text-blue-800";
  };

  const upcomingCount = stats.upcoming;

  // Filter appointments to only show valid upcoming ones
  const validAppointments = appointments.filter(apt => {
    const now = new Date();
    const scheduleAt = new Date(apt.scheduleAt || apt.date);
    const status = apt.Status || apt.status || 'Pending';

    // Only show Pending or Approved appointments that are in the future
    return (
      (status.toLowerCase().includes('pending') || status.toLowerCase().includes('approved')) &&
      scheduleAt > now
    );
  });

  return (
    <StudentLayout
      title={
        <div className="flex items-center gap-2">
          <span>Dashboard</span>
        </div>
      }
      notificationsCount={notificationsCount}
      user={{ name: studentName }}
    >
      <div className="space-y-6">
        {/* Greeting Banner */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-emerald-500 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-100">
              Xin chào, {studentName}!
            </h1>
            <p className="text-white/90 text-lg mb-8">
              Bạn có {upcomingCount} lịch hẹn sắp tới trong tuần này
            </p>
            <div className="flex items-center gap-4">
              <Link to="/student/dashboard/search">
                <Button
                  variant="primary"
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:border-white/50 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span>+ Đặt lịch tư vấn mới</span>
                </Button>
              </Link>
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/40 inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowClockwise size={20} className={`transition-transform duration-300 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Đang tải...' : 'Làm mới'}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { title: "Lịch hẹn sắp tới", value: stats.upcoming, icon: CalendarBlank, color: "blue" },
            { title: "Chờ duyệt", value: stats.pending, icon: Clock, color: "amber" },
            { title: "Đã hoàn thành", value: stats.completed, icon: CheckCircle, color: "green" },
          ].map((item) => (
            <motion.div key={item.title} variants={fadeUpVariants}>
              <StatsCard
                title={item.title}
                value={item.value}
                icon={item.icon}
                color={item.color}
                isLoading={loading}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Appointments List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Lịch hen sắp tới</h2>
            <Link to="/student/dashboard/appointments" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
              Xem tất cả <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              <AppointmentSkeleton />
              <AppointmentSkeleton />
              <AppointmentSkeleton />
            </div>
          ) : validAppointments.length === 0 ? (
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <CalendarBlank size={32} className="text-blue-600" />
              </div>
              <p className="text-gray-700 mb-4">
                Chưa có lịch hen nào.
              </p>
              <Link to="/student/dashboard/search" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl">
                <User size={20} />
                Tìm kiếm giảng viên ngay!
              </Link>
            </Card>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {validAppointments.slice(0, 3).map((apt) => (
                <motion.div key={apt.Appoint_ID || apt.id} variants={fadeUpVariants}>
                  <AppointmentCard
                    appointment={apt}
                    onClick={() => {
                      // Smooth scroll to top when clicking on appointment
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/student/dashboard/search" className="w-full">
            <Card className="flex items-center gap-4 bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.03] cursor-pointer border border-gray-200">
              <div className="bg-blue-100 p-4 rounded-xl flex items-center justify-center">
                <User size={32} className="text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-semibold text-blue-900 mb-1">Tìm giảng viên</div>
                <div className="text-sm text-gray-500">Xem danh sách và đặt lịch</div>
              </div>
            </Card>
          </Link>
          <Link to="/student/dashboard/appointments" className="w-full">
            <Card className="flex items-center gap-4 bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.03] cursor-pointer border border-gray-200">
              <div className="bg-emerald-100 p-4 rounded-xl flex items-center justify-center">
                <CalendarBlank size={32} className="text-emerald-600" />
              </div>
              <div>
                <div className="text-lg font-semibold text-emerald-900 mb-1">Quản lý lịch hẹn</div>
                <div className="text-sm text-gray-500">Xem và quản lý lịch của bạn</div>
              </div>
            </Card>
          </Link>
        </div>
        </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
