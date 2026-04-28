import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/UI/Button";
import { Card } from "../../components/UI/Card";

export default function ManageDepartments() {
  const navigate = useNavigate();
  const [depts, setDepts] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);
  const jwt = () => localStorage.getItem("jwtToken");

  useEffect(() => {
    if (!jwt()) return navigate("/admin/login");
    fetch();
  }, [navigate]);

  const fetch = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/departments`, { headers: { Authorization: `Bearer ${jwt()}` } });
      const arr = (res.data.data && res.data.data.departments) || [];
      setDepts(Array.isArray(arr) ? arr : []);
    } catch (e) {
      console.error("Department load failed", e);
      setDepts([]);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/departments/${editing.Dept_ID}`, { DeptName: name }, { headers: { Authorization: `Bearer ${jwt()}` } });
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/departments`, { DeptName: name }, { headers: { Authorization: `Bearer ${jwt()}` } });
      }
      setName("");
      setEditing(null);
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete department?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/departments/${id}`, { headers: { Authorization: `Bearer ${jwt()}` } });
      fetch();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Quản lý khoa</h1>
        <p className="text-sm text-slate-500 mt-1">Thêm, chỉnh sửa và xóa danh mục khoa</p>
      </div>
      <Card className="mb-4">
        <form onSubmit={save} className="flex gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên khoa" className="px-3 py-2 border rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-udck-primary" />
          <Button type="submit">{editing ? "Cập nhật" : "Thêm mới"}</Button>
        </form>
      </Card>
      <Card className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Tên khoa</th>
              <th className="px-4 py-2 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {depts.map((d, i) => (
              <tr key={d.Dept_ID || i} className="border-b odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{d.DeptName}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => { setEditing(d); setName(d.DeptName); }}>Sửa</Button>
                    <Button variant="danger" size="sm" onClick={() => remove(d.Dept_ID)}>Xóa</Button>
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
