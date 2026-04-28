import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/UI/Card";
import { Users, UserCheck, Calendar, TrendingUp } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ students: 0, lecturers: 0, appointments: 0, majors: 0 });
  const [statusChart, setStatusChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const jwt = () => localStorage.getItem("jwtToken");

  useEffect(() => {
    if (!jwt()) {
      navigate("/admin/login");
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const headers = { Authorization: `Bearer ${jwt()}` };
        const [statsRes, appointmentsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/stats`, { headers }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/appointments`, { headers }).catch(() => ({ data: { data: [] } })),
        ]);
        const rawStats = statsRes.data.data || {};
        const d = rawStats.stats || rawStats;
        setStats({
          students: d.students || 0,
          lecturers: d.lecturers || 0,
          appointments: d.appointments || 0,
          majors: d.majors || 0,
        });

        const appointmentRows = appointmentsRes.data?.data?.appointments || appointmentsRes.data?.data || [];
        const list = Array.isArray(appointmentRows) ? appointmentRows : [];
        const statusMap = list.reduce(
          (acc, row) => {
            const status = String(row?.Status || "").toLowerCase();
            if (status.includes("approved") || status.includes("đã duyệt")) acc.approved += 1;
            else if (status.includes("rejected") || status.includes("từ chối")) acc.rejected += 1;
            else acc.pending += 1;
            return acc;
          },
          { approved: 0, pending: 0, rejected: 0 }
        );
        setStatusChart([
          { name: "Đã duyệt", value: statusMap.approved, color: "#1d9a6c" },
          { name: "Chờ duyệt", value: statusMap.pending, color: "#2f6db2" },
          { name: "Từ chối", value: statusMap.rejected, color: "#d9534f" },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  if (loading) return <div className="p-6 text-slate-500">Đang tải dashboard...</div>;

  const totalHandled = (statusChart[0]?.value || 0) + (statusChart[1]?.value || 0) + (statusChart[2]?.value || 0);
  const completionRate = totalHandled ? Math.round(((statusChart[0]?.value || 0) / totalHandled) * 100) : 0;
  const summaryCards = [
    { label: "Tổng sinh viên", value: stats.students, icon: Users, iconBg: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "Giảng viên", value: stats.lecturers, icon: UserCheck, iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
    { label: "Lịch hẹn (tháng)", value: stats.appointments, icon: Calendar, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
    { label: "Tỷ lệ duyệt", value: `${completionRate}%`, icon: TrendingUp, iconBg: "bg-slate-100", iconColor: "text-slate-700" },
  ];
  const entityChart = [
    { name: "Sinh viên", value: stats.students },
    { name: "Giảng viên", value: stats.lecturers },
    { name: "Lịch hẹn", value: stats.appointments },
    { name: "Ngành", value: stats.majors },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-[#154e8a] via-[#1e67ad] to-[#1f9b8f] p-8 text-white shadow-lg">
        <h2 className="text-4xl font-bold">Hệ thống tư vấn UDCK</h2>
        <p className="mt-2 text-white/90 text-lg">Quản lý và thống kê toàn hệ thống</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {summaryCards.map((item) => (
          <Card key={item.label} className="border border-slate-200 !p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-2 text-4xl font-semibold text-slate-900">{item.value}</p>
              </div>
              <div className={`rounded-2xl p-3 ${item.iconBg}`}>
                <item.icon className={`h-6 w-6 ${item.iconColor}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="border border-slate-200 shadow-sm">
          <h3 className="text-3xl font-semibold text-slate-800 mb-4">Biểu đồ tổng quan</h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={entityChart} margin={{ top: 8, right: 20, bottom: 8, left: 0 }}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#2f6db2" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <h3 className="text-3xl font-semibold text-slate-800 mb-4">Trạng thái lịch hẹn</h3>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusChart} dataKey="value" nameKey="name" outerRadius={110} label>
                  {statusChart.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800">Gợi ý vận hành</h3>
        <div className="mt-2 text-sm text-slate-600 space-y-1">
          <p>- Ưu tiên xử lý các lịch hẹn đang chờ duyệt để tăng tỷ lệ hoàn thành.</p>
          <p>- Theo dõi biểu đồ trạng thái để cân bằng tỉ lệ duyệt/từ chối giữa các khoa.</p>
        </div>
      </Card>
    </div>
  );
}
