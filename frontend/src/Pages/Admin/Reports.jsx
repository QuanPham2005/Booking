import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/UI/Card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const REPORT_STATUSES = {
  "report-1": "All",
  "report-2": "Pending",
  "report-3": "Approved",
  "report-4": "Rejected",
};

const VIEW_OPTIONS = [
  { value: "week", label: "Tuần này" },
  { value: "month", label: "Tháng này" },
  { value: "year", label: "Năm nay" },
];

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

export default function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [view, setView] = useState("year");
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailAppointments, setDetailAppointments] = useState([]);
  const [topInstructors, setTopInstructors] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => {
    return localStorage.getItem("jwtToken") || localStorage.getItem("Admin jwtToken") || "";
  };

  const getEmptyChartData = (viewMode) => {
    if (viewMode === "week") {
      return [
        { label: "Mon", Pending: 0, Approved: 0, Rejected: 0, Total: 0 },
        { label: "Tue", Pending: 0, Approved: 0, Rejected: 0, Total: 0 },
        { label: "Wed", Pending: 0, Approved: 0, Rejected: 0, Total: 0 },
        { label: "Thu", Pending: 0, Approved: 0, Rejected: 0, Total: 0 },
        { label: "Fri", Pending: 0, Approved: 0, Rejected: 0, Total: 0 },
        { label: "Sat", Pending: 0, Approved: 0, Rejected: 0, Total: 0 },
        { label: "Sun", Pending: 0, Approved: 0, Rejected: 0, Total: 0 },
      ];
    }

    if (viewMode === "month") {
      return Array.from({ length: 31 }, (_, index) => ({
        label: `${index + 1}`,
        Pending: 0,
        Approved: 0,
        Rejected: 0,
        Total: 0,
      }));
    }

    return [
      { label: "Jan", Pending: 0, Approved: 0, Rejected: 0, Total: 0 },
      { label: "Feb", Pending: 0, Approved: 0, Rejected: 0, Total: 0 },
      { label: "Mar", Pending: 0, Approved: 0, Rejected: 0, Total: 0 },
      { label: "Apr", Pending: 0, Approved: 0, Rejected: 0, Total: 0 },
      { label: "May", Pending: 0, Approved: 0, Rejected: 0, Total: 0 },
      { label: "Jun", Pending: 0, Approved: 0, Rejected: 0, Total: 0 },
      { label: "Jul", Pending: 0, Approved: 0, Rejected: 0, Total: 0 },
      { label: "Aug", Pending: 0, Approved: 0, Rejected: 0, Total: 0 },
      { label: "Sep", Pending: 0, Approved: 0, Rejected: 0, Total: 0 },
      { label: "Oct", Pending: 0, Approved: 0, Rejected: 0, Total: 0 },
      { label: "Nov", Pending: 0, Approved: 0, Rejected: 0, Total: 0 },
      { label: "Dec", Pending: 0, Approved: 0, Rejected: 0, Total: 0 },
    ];
  };

  const fetchReports = async (viewMode = "year") => {
    const token = getToken();
    if (!token) {
      setError("Không có token xác thực. Vui lòng đăng nhập lại.");
      return navigate("/admin/login");
    }

    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/reports?view=${encodeURIComponent(viewMode)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data.data?.reports || []);
      setTopInstructors(res.data.data?.topInstructors || []);
      setStatusDistribution(res.data.data?.statusDistribution || []);
      setChartData(res.data.data?.chartData || getEmptyChartData(viewMode));
      setView(viewMode);
    } catch (err) {
      console.warn("reports endpoint returned error", err);
      if (err?.response?.status === 401) {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("Admin Name");
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        navigate("/admin/login");
      } else {
        setError("Không thể tải báo cáo");
      }
      setReports([]);
      setTopInstructors([]);
      setChartData(getEmptyChartData(viewMode));
    } finally {
      setLoading(false);
    }
  };

  const fetchReportDetails = async (status) => {
    const token = getToken();
    if (!token) {
      setError("Không có token xác thực. Vui lòng đăng nhập lại.");
      return navigate("/admin/login");
    }

    try {
      setLoadingDetails(true);
      setError(null);
      const normalized = status === "All" ? "All" : status;
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/reports/appointments?status=${encodeURIComponent(normalized)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDetailAppointments(res.data.data?.appointments || []);
    } catch (err) {
      console.error("Fetch report details failed", err);
      if (err?.response?.status === 401) {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("Admin Name");
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        navigate("/admin/login");
      } else {
        setError("Không thể tải danh sách chi tiết");
      }
      setDetailAppointments([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (!getToken()) return navigate("/admin/login");
    fetchReports(view);
  }, [navigate]);

  const handleViewChange = (nextView) => {
    if (nextView === view) return;
    fetchReports(nextView);
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
    fetchReportDetails(report.status);
  };

  const detailHeaders = [
    { key: "id", label: "Mã" },
    { key: "studentName", label: "Sinh viên" },
    { key: "lecturerName", label: "Giảng viên" },
    { key: "date", label: "Ngày" },
    { key: "startTime", label: "Bắt đầu" },
    { key: "endTime", label: "Kết thúc" },
    { key: "status", label: "Trạng thái" },
    { key: "location", label: "Địa điểm" },
  ];

  const pieData = useMemo(() => {
    if (statusDistribution && statusDistribution.length > 0) {
      return statusDistribution.map((entry) => ({
        ...entry,
        color: entry.color ||
          (entry.name === 'Đã duyệt' ? '#22c55e' : entry.name === 'Từ chối' ? '#ef4444' : '#f59e0b')
      }));
    }

    const approved = reports.find((report) => report.status === 'Approved')?.count || 0;
    const rejected = reports.find((report) => report.status === 'Rejected')?.count || 0;
    const pending = reports.find((report) => report.status === 'Pending')?.count || 0;
    return [
      { name: 'Đã duyệt', value: approved, color: '#22c55e' },
      { name: 'Từ chối', value: rejected, color: '#ef4444' },
      { name: 'Chờ duyệt', value: pending, color: '#f59e0b' }
    ];
  }, [reports, statusDistribution]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Báo cáo tổng hợp</h1>
          <p className="text-sm text-slate-500 mt-1">Xem nhanh thống kê lịch hẹn, chi tiết theo trạng thái và biểu đồ xu hướng.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {loading ? (
          <div className="text-slate-500 col-span-4">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="text-red-600 col-span-4">{error}</div>
        ) : (
          reports.map((report) => {
            const active = selectedReport?.id === report.id;
            return (
              <button
                key={report.id}
                onClick={() => handleReportClick(report)}
                className={`rounded-3xl border p-5 text-left transition ${
                  active ? "border-udck-primary bg-udck-primary/10 shadow-lg" : "border-slate-200 bg-white hover:border-slate-300"
                }`}>
                <h2 className={`text-lg font-semibold ${active ? "text-udck-primary" : "text-slate-900"}`}>{report.title}</h2>
                <p className="mt-3 text-sm text-slate-500">{report.summary}</p>
              </button>
            );
          })
        )}
      </div>

      {selectedReport && (
        <Card className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Danh sách chi tiết: {selectedReport.title}</h2>
              <p className="text-sm text-slate-500">Hiển thị các lịch hẹn {selectedReport.status === 'All' ? 'tất cả' : selectedReport.status.toLowerCase()}.</p>
            </div>
            <div className="text-sm text-slate-600">{loadingDetails ? 'Đang tải...' : `${detailAppointments.length} dòng`}</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  {detailHeaders.map((header) => (
                    <th key={header.key} className="px-4 py-3 font-medium uppercase tracking-wide">{header.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingDetails ? (
                  <tr>
                    <td colSpan={detailHeaders.length} className="px-4 py-6 text-center text-slate-500">Đang tải danh sách...</td>
                  </tr>
                ) : detailAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={detailHeaders.length} className="px-4 py-6 text-center text-slate-500">Không có lịch hẹn nào.</td>
                  </tr>
                ) : (
                  detailAppointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{appointment.id}</td>
                      <td className="px-4 py-3">{appointment.studentName}</td>
                      <td className="px-4 py-3">{appointment.lecturerName}</td>
                      <td className="px-4 py-3">{appointment.date || '-'}</td>
                      <td className="px-4 py-3">{appointment.startTime || '-'}</td>
                      <td className="px-4 py-3">{appointment.endTime || '-'}</td>
                      <td className="px-4 py-3">{appointment.status}</td>
                      <td className="px-4 py-3">{appointment.location}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Bảng điều khiển báo cáo</h2>
            <p className="text-sm text-slate-500">Tỷ lệ trạng thái lịch hẹn và top 3 giảng viên có lịch hẹn nhiều nhất.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {VIEW_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleViewChange(option.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  view === option.value ? "bg-udck-primary text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}>
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Tỷ lệ trạng thái</h3>
            <div className="mt-6 flex items-center justify-center">
              <PieChart width={280} height={280}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </div>
            <div className="mt-6 space-y-3">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm font-medium text-slate-700">{entry.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Top 3 giảng viên có lịch tư vấn nhiều nhất</h3>
            <p className="mt-2 text-sm text-slate-500">Dựa trên số lượng lịch hẹn đã duyệt trong tháng hiện tại.</p>
            <div className="mt-5 space-y-3">
              {topInstructors.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-slate-500">
                  Chưa có dữ liệu giảng viên.
                </div>
              ) : (
                topInstructors.map((instructor, index) => (
                  <div key={instructor.lecturerName} className="grid grid-cols-12 gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="col-span-8 space-y-1">
                      <div className="text-sm font-semibold text-slate-900">{index + 1}. {instructor.lecturerName}</div>
                      <div className="text-sm text-slate-500"> {instructor.department}</div>
                    </div>
                    <div className="col-span-4 flex items-center justify-end">
                      <div className="rounded-full bg-udck-primary/10 px-4 py-2 text-sm font-semibold text-udck-primary">
                        {instructor.approvedCount} lịch
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
