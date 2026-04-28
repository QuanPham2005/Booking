import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/UI/Button";
import { Card } from "../../components/UI/Card";

export default function ManageLecturers() {
  const navigate = useNavigate();
  const [lecturers, setLecturers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);
  const [formData, setFormData] = useState({
    Username: "",
    Password: "",
    Email: "",
    Full_Name: "",
    Dept_ID: "",
    Major_ID: "",
  });
  const [loading, setLoading] = useState(true);
  const jwt = () => localStorage.getItem("jwtToken");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/teachers`,
        formData,
        { headers: { Authorization: `Bearer ${jwt()}` } }
      );
      toast.success("Đã thêm giảng viên thành công");
      setFormData({
        Username: "",
        Password: "",
        Email: "",
        Full_Name: "",
        Dept_ID: "",
        Major_ID: "",
      });
      const arr = (res.data.data && res.data.data.users) || [];
      if (Array.isArray(arr)) setLecturers(arr);
      else {
        const r2 = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/teachers`,
          { headers: { Authorization: `Bearer ${jwt()}` } }
        );
        const arr2 = (r2.data.data && r2.data.data.users) || [];
        setLecturers(Array.isArray(arr2) ? arr2 : []);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Không thể thêm giảng viên");
    }
  };

  useEffect(() => {
    if (!jwt()) return navigate("/admin/login");

    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/teachers`,
          { headers: { Authorization: `Bearer ${jwt()}` } }
        );
        const arr = (res.data.data && res.data.data.users) || [];
        setLecturers(Array.isArray(arr) ? arr : []);
      } catch {
        setLecturers([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchDepts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/departments`,
          { headers: { Authorization: `Bearer ${jwt()}` } }
        );
        setDepartments(res.data.data.departments || []);
      } catch (e) {
        console.error(e);
      }
    };

    const fetchMajors = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/majors`,
          { headers: { Authorization: `Bearer ${jwt()}` } }
        );
        setMajors(res.data.data.majors || []);
      } catch (e) {
        console.error(e);
      }
    };

    load();
    fetchDepts();
    fetchMajors();
  }, [navigate]);

  const remove = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/teachers/${id}`, { headers: { Authorization: `Bearer ${jwt()}` } });
      setLecturers((l) => l.filter((it) => it._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Quản lý giảng viên</h1>
        <p className="text-sm text-slate-500 mt-1">Tạo mới tài khoản giảng viên và quản lý danh sách</p>
      </div>

      {/* create form */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold">Thêm giảng viên mới</h3>
            <p className="text-sm text-gray-600">Tạo tài khoản và gán khoa/ngành tương ứng</p>
          </div>
        </div>
        <form onSubmit={handleCreate} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="Username"
            placeholder="Tên đăng nhập"
            value={formData.Username}
            onChange={handleInputChange}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-udck-primary"
            required
          />
          <input
            type="password"
            name="Password"
            placeholder="Mật khẩu"
            value={formData.Password}
            onChange={handleInputChange}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-udck-primary"
            required
          />
          <input
            type="email"
            name="Email"
            placeholder="Email"
            value={formData.Email}
            onChange={handleInputChange}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-udck-primary"
            required
          />
          <input
            type="text"
            name="Full_Name"
            placeholder="Họ và tên"
            value={formData.Full_Name}
            onChange={handleInputChange}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-udck-primary"
            required
          />
          <select
            name="Dept_ID"
            value={formData.Dept_ID}
            onChange={handleInputChange}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-udck-primary"
          >
            <option value="">-- Chọn khoa --</option>
            {departments.map((d) => (
              <option key={d.Dept_ID} value={d.Dept_ID}>
                {d.DeptName}
              </option>
            ))}
          </select>
          <select
            name="Major_ID"
            value={formData.Major_ID}
            onChange={handleInputChange}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-udck-primary"
          >
            <option value="">-- Chọn ngành --</option>
            {majors.map((m) => (
              <option key={m.Major_ID} value={m.Major_ID}>
                {m.MajorName}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <button type="submit" className="inline-flex items-center px-4 py-2 bg-udck-primary text-white rounded-lg">Thêm giảng viên</button>
        </div>
      </form>
      </Card>

      {loading ? (
        <div className="text-slate-500">Đang tải dữ liệu...</div>
      ) : (
        <Card className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Họ tên</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Khoa</th>
                <th className="px-4 py-2 text-left">Ngành</th>
                <th className="px-4 py-2 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {lecturers.map((l, i) => (
                <tr key={l._id || i} className="border-b odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{l.Full_Name || l.name || "-"}</td>
                  <td className="px-4 py-2">{l.Email || l.email || "-"}</td>
                  <td className="px-4 py-2">{l.DeptName || l.department || "-"}</td>
                  <td className="px-4 py-2">{l.major || "-"}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => remove(l._id)}>Xóa</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
