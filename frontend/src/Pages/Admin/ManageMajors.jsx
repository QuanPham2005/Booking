import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/UI/Button";
import { Card } from "../../components/UI/Card";

export default function ManageMajors() {
  const navigate = useNavigate();
  const [majors, setMajors] = useState([]);
  const [depts, setDepts] = useState([]);
  const [majorId, setMajorId] = useState("");
  const [name, setName] = useState("");
  const [deptId, setDeptId] = useState("");
  const [editing, setEditing] = useState(null);
  const jwt = () => localStorage.getItem("jwtToken");

  useEffect(() => {
    if (!jwt()) return navigate("/admin/login");
    fetchAll();
  }, [navigate]);

  const fetchAll = async () => {
    try {
      const [majRes, deptRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/majors`, { headers: { Authorization: `Bearer ${jwt()}` } }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/departments`, { headers: { Authorization: `Bearer ${jwt()}` } }),
      ]);
      setMajors((majRes.data.data && majRes.data.data.majors) || []);
      setDepts((deptRes.data.data && deptRes.data.data.departments) || []);
    } catch (e) {
      console.error(e);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/majors/${editing.Major_ID}`,
          { Major_ID: majorId || undefined, MajorName: name, Dept_ID: deptId },
          { headers: { Authorization: `Bearer ${jwt()}` } }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/majors`,
          { Major_ID: majorId || undefined, MajorName: name, Dept_ID: deptId },
          { headers: { Authorization: `Bearer ${jwt()}` } }
        );
      }
      setMajorId("");
      setName("");
      setDeptId("");
      setEditing(null);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete major?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/majors/${id}`, { headers: { Authorization: `Bearer ${jwt()}` } });
      fetchAll();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Quản lý ngành</h1>
        <p className="text-sm text-slate-500 mt-1">Quản trị danh mục ngành theo từng khoa</p>
      </div>
      <Card className="mb-4">
        <form onSubmit={save} className="mb-4 flex gap-2 flex-wrap">
          <input
            value={majorId}
            onChange={(e) => setMajorId(e.target.value)}
            placeholder="Mã ngành (tùy chọn)"
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-udck-primary"
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên ngành"
            className="px-3 py-2 border rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-udck-primary"
          />
          <select
            value={deptId}
            onChange={(e) => setDeptId(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-udck-primary"
          >
            <option value="">Chọn khoa</option>
            {depts.map((d) => (
              <option key={d.Dept_ID} value={d.Dept_ID}>{d.DeptName}</option>
            ))}
          </select>
          <Button type="submit">{editing ? "Cập nhật" : "Thêm mới"}</Button>
        </form>
      </Card>

      <Card className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Ngành</th>
              <th className="px-4 py-2 text-left">Khoa</th>
              <th className="px-4 py-2 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {majors.map((m, i) => (
              <tr key={m.Major_ID || i} className="border-b odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{m.MajorName}</td>
                <td className="px-4 py-2">{m.DeptName || "-"}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => { setEditing(m); setMajorId(String(m.Major_ID)); setName(m.MajorName); setDeptId(m.Dept_ID); }}>Sửa</Button>
                    <Button variant="danger" size="sm" onClick={() => remove(m.Major_ID)}>Xóa</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
