import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/UI/Button";
import { Card } from "../../components/UI/Card";

export default function ManageStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [majors, setMajors] = useState([]);
  const [formData, setFormData] = useState({
    Username: "",
    Password: "",
    Email: "",
    Full_Name: "",
    Major_ID: "",
    ClassName: "",
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
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/students`,
        formData,
        { headers: { Authorization: `Bearer ${jwt()}` } }
      );
      toast.success("Đã thêm sinh viên thành công");
      setFormData({
        Username: "",
        Password: "",
        Email: "",
        Full_Name: "",
        Major_ID: "",
        ClassName: "",
      });
      // reload data
      fetchStudents();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Không thể thêm sinh viên");
    }
  };

  useEffect(() => {
    if (!jwt()) return navigate("/admin/login");
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/majors`, { headers: { Authorization: `Bearer ${jwt()}` } })
      .then((res) => setMajors((res.data.data && res.data.data.majors) || []))
      .catch(() => setMajors([]));
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/students`, { headers: { Authorization: `Bearer ${jwt()}` } })
      .then((res) => {
        const arr = (res.data.data && res.data.data.students) || [];
        setStudents(Array.isArray(arr) ? arr : []);
      })
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  }, [navigate]);

  const approve = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/approveStudent/${id}`, {}, { headers: { Authorization: `Bearer ${jwt()}` } });
      setStudents((s) => s.filter((st) => st._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const reject = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/rejectStudent/${id}`, { headers: { Authorization: `Bearer ${jwt()}` } });
      setStudents((s) => s.filter((st) => st._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Quản lý sinh viên</h1>
        <p className="text-sm text-slate-500 mt-1">Tạo mới và duyệt tài khoản sinh viên</p>
      </div>

      {/* create form */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold">Thêm sinh viên mới</h3>
            <p className="text-sm text-gray-600">Tạo tài khoản sinh viên nhanh chóng</p>
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
          <input
            type="text"
            name="ClassName"
            placeholder="Lớp"
            value={formData.ClassName}
            onChange={handleInputChange}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-udck-primary"
          />
        </div>
        <div className="mt-4">
          <button type="submit" className="inline-flex items-center px-4 py-2 bg-udck-primary text-white rounded-lg">Thêm sinh viên</button>
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
                <th className="px-4 py-2 text-left">Ngành</th>
                <th className="px-4 py-2 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {students.map((s, i) => (
                <tr key={s._id || i} className="border-b odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{s.Full_Name || s.name || "-"}</td>
                  <td className="px-4 py-2">{s.Email || s.email || "-"}</td>
                  <td className="px-4 py-2">{(s.Major && s.Major.MajorName) || s.major || "-"}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" onClick={() => approve(s._id)}>Duyệt</Button>
                      <Button variant="secondary" size="sm" onClick={() => reject(s._id)}>Từ chối</Button>
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
