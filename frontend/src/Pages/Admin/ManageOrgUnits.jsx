import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { PencilSimple, Trash } from "phosphor-react";
import { Card } from "../../components/UI/Card";
import { Button } from "../../components/UI/Button";

export default function ManageOrgUnits() {
  const navigate = useNavigate();
  const jwt = () => localStorage.getItem("jwtToken");
  const normalizeToken = (token) => {
    if (!token) return null;
    const trimmed = String(token).trim();
    if (trimmed === "null" || trimmed === "undefined" || trimmed === "") return null;
    return trimmed;
  };
  const getHeaders = () => {
    const token = normalizeToken(jwt());
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const [activeTab, setActiveTab] = useState("departments");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [majors, setMajors] = useState([]);

  const [deptForm, setDeptForm] = useState({ Dept_ID: "", DeptName: "" });
  const [majorForm, setMajorForm] = useState({ Major_ID: "", MajorName: "", Dept_ID: "" });
  const [editingDept, setEditingDept] = useState(null);
  const [editingMajor, setEditingMajor] = useState(null);
  const [expandedDeptId, setExpandedDeptId] = useState(null);

  const loadAll = async () => {
    const token = normalizeToken(jwt());
    if (!token) {
      navigate("/admin/login");
      return;
    }

    setLoading(true);
    try {
      const [deptRes, majorRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/departments`, { headers: getHeaders() }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/majors`, { headers: getHeaders() }),
      ]);
      setDepartments((deptRes.data.data && deptRes.data.data.departments) || []);
      setMajors((majorRes.data.data && majorRes.data.data.majors) || []);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/admin/login");
        return;
      }
      toast.error("Không thể tải dữ liệu khoa/ngành");
      setDepartments([]);
      setMajors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [navigate]);

  const startCreate = () => {
    if (showCreate) {
      setShowCreate(false);
      setEditingDept(null);
      setEditingMajor(null);
      return;
    }
    setShowCreate(true);
    setEditingDept(null);
    setEditingMajor(null);
    setDeptForm({ Dept_ID: "", DeptName: "" });
    setMajorForm({ Major_ID: "", MajorName: "", Dept_ID: "" });
  };

  const saveDepartment = async (e) => {
    e.preventDefault();
    if (!deptForm.DeptName.trim()) {
      toast.error("Vui lòng nhập tên khoa");
      return;
    }
    try {
      if (editingDept) {
        await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/departments/${editingDept.Dept_ID}`,
          { Dept_ID: deptForm.Dept_ID || undefined, DeptName: deptForm.DeptName.trim() },
          { headers: getHeaders() }
        );
        toast.success("Đã cập nhật khoa");
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/departments`,
          { Dept_ID: deptForm.Dept_ID || undefined, DeptName: deptForm.DeptName.trim() },
          { headers: getHeaders() }
        );
        toast.success("Đã thêm khoa");
      }
      setShowCreate(false);
      setDeptForm({ Dept_ID: "", DeptName: "" });
      setEditingDept(null);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể lưu khoa");
    }
  };

  const saveMajor = async (e) => {
    e.preventDefault();
    if (!majorForm.MajorName.trim() || !majorForm.Dept_ID) {
      toast.error("Vui lòng nhập tên ngành và chọn khoa");
      return;
    }
    try {
      const payload = { Major_ID: majorForm.Major_ID || undefined, MajorName: majorForm.MajorName.trim(), Dept_ID: majorForm.Dept_ID };
      if (editingMajor) {
        await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/majors/${editingMajor.Major_ID}`, payload, { headers: getHeaders() });
        toast.success("Đã cập nhật ngành");
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/majors`, payload, { headers: getHeaders() });
        toast.success("Đã thêm ngành");
      }
      setShowCreate(false);
      setMajorForm({ Major_ID: "", MajorName: "", Dept_ID: "" });
      setEditingMajor(null);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể lưu ngành");
    }
  };

  const removeDepartment = async (deptId) => {
    if (!window.confirm("Bạn có chắc muốn xóa khoa này?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/departments/${deptId}`, { headers: getHeaders() });
      toast.success("Đã xóa khoa");
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xóa khoa");
    }
  };

  const removeMajor = async (majorId) => {
    if (!window.confirm("Bạn có chắc muốn xóa ngành này?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/majors/${majorId}`, { headers: getHeaders() });
      toast.success("Đã xóa ngành");
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Không thể xóa ngành");
    }
  };

  const openEditDepartment = (dept) => {
    setActiveTab("departments");
    setEditingDept(dept);
    setDeptForm({ Dept_ID: dept.Dept_ID ? String(dept.Dept_ID) : "", DeptName: dept.DeptName || "" });
    setShowCreate(true);
  };

  const openEditMajor = (major) => {
    setActiveTab("majors");
    setEditingMajor(major);
    setMajorForm({
      Major_ID: major.Major_ID ? String(major.Major_ID) : "",
      MajorName: major.MajorName || "",
      Dept_ID: major.Dept_ID ? String(major.Dept_ID) : "",
    });
    setShowCreate(true);
  };

  const majorsByDept = useMemo(() => {
    const map = {};
    majors.forEach((m) => {
      const key = String(m.Dept_ID || "");
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [majors]);

  const getMajorDeptName = (major) =>
    major?.DeptName ||
    major?.MajorDepartment?.DeptName ||
    departments.find((d) => String(d.Dept_ID) === String(major?.Dept_ID))?.DeptName ||
    "-";

  return (
    <div className="space-y-5">
      <Card className="border border-slate-200 !p-0 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="inline-flex rounded-full bg-slate-100 p-1">
              <button
                className={`px-5 py-2 rounded-full text-sm font-medium ${activeTab === "departments" ? "bg-udck-primary text-white" : "text-slate-600"}`}
                onClick={() => setActiveTab("departments")}
              >
                Khoa
              </button>
              <button
                className={`px-5 py-2 rounded-full text-sm font-medium ${activeTab === "majors" ? "bg-udck-primary text-white" : "text-slate-600"}`}
                onClick={() => setActiveTab("majors")}
              >
                Ngành
              </button>
            </div>
            <Button onClick={startCreate}>+ Thêm mới</Button>
          </div>
        </div>

        {showCreate && (
          <div className="p-5 border-b border-slate-200 bg-slate-50">
            {activeTab === "departments" ? (
              <form onSubmit={saveDepartment} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  className="px-3 py-2 border rounded-lg"
                  placeholder="Mã khoa"
                  value={deptForm.Dept_ID}
                  onChange={(e) => setDeptForm((p) => ({ ...p, Dept_ID: e.target.value }))}
                  disabled={Boolean(editingDept)}
                />
                <input
                  className="px-3 py-2 border rounded-lg"
                  placeholder="Tên khoa"
                  value={deptForm.DeptName}
                  onChange={(e) => setDeptForm((p) => ({ ...p, DeptName: e.target.value }))}
                />
                <Button type="submit">{editingDept ? "Cập nhật khoa" : "Lưu khoa"}</Button>
              </form>
            ) : (
              <form onSubmit={saveMajor} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  className="px-3 py-2 border rounded-lg"
                  placeholder="Mã ngành"
                  value={majorForm.Major_ID}
                  onChange={(e) => setMajorForm((p) => ({ ...p, Major_ID: e.target.value }))}
                />
                <input
                  className="px-3 py-2 border rounded-lg"
                  placeholder="Tên ngành"
                  value={majorForm.MajorName}
                  onChange={(e) => setMajorForm((p) => ({ ...p, MajorName: e.target.value }))}
                />
                <select
                  className="px-3 py-2 border rounded-lg"
                  value={majorForm.Dept_ID}
                  onChange={(e) => setMajorForm((p) => ({ ...p, Dept_ID: e.target.value }))}
                >
                  <option value="">Chọn khoa</option>
                  {departments.map((d) => (
                    <option key={d.Dept_ID} value={d.Dept_ID}>{d.DeptName}</option>
                  ))}
                </select>
                <Button type="submit">{editingMajor ? "Cập nhật ngành" : "Lưu ngành"}</Button>
              </form>
            )}
          </div>
        )}

        <div className="p-5">
          {loading ? (
            <p className="text-slate-500">Đang tải dữ liệu...</p>
          ) : activeTab === "departments" ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {departments.length === 0 ? (
                <p className="text-slate-500">Chưa có khoa nào.</p>
              ) : (
                departments.map((d) => (
                  <div
                    key={d.Dept_ID}
                    className="rounded-2xl border border-slate-200 p-5 bg-white cursor-pointer"
                    onClick={() => setExpandedDeptId((prev) => (String(prev) === String(d.Dept_ID) ? null : d.Dept_ID))}
                  >
                    <div className="flex items-start justify-between">
                      <div className="h-11 w-11 rounded-full bg-udck-primary text-white flex items-center justify-center font-bold">K</div>
                      <div className="flex items-center gap-3">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDepartment(d);
                          }}
                        >
                          <PencilSimple size={18} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeDepartment(d.Dept_ID);
                          }}
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                    <h3 className="mt-4 text-2xl font-semibold text-slate-800">{d.DeptName}</h3>
                    <p className="text-sm text-slate-500 mt-1">Mã: {d.Dept_ID}</p>
                    <p className="text-sm text-slate-500 mt-3">{majorsByDept[String(d.Dept_ID)] || 0} ngành đào tạo</p>
                    {String(expandedDeptId) === String(d.Dept_ID) && (
                      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <p className="text-sm font-medium text-slate-700 mb-2">Danh sách ngành:</p>
                        <div className="space-y-1 text-sm text-slate-600">
                          {majors
                            .filter((m) => String(m.Dept_ID) === String(d.Dept_ID))
                            .map((m) => (
                              <p key={m.Major_ID}>- {m.MajorName}</p>
                            ))}
                          {majors.filter((m) => String(m.Dept_ID) === String(d.Dept_ID)).length === 0 && (
                            <p>- Chưa có ngành thuộc khoa này.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {majors.length === 0 ? (
                <p className="text-slate-500">Chưa có ngành nào.</p>
              ) : (
                majors.map((m) => (
                  <div key={m.Major_ID} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold text-slate-800 truncate">{m.MajorName}</h3>
                        <p className="text-sm text-slate-500 mt-1">Mã: {m.Major_ID}</p>
                        <p className="text-sm text-slate-500">Khoa: {getMajorDeptName(m)}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <button className="text-blue-600 hover:text-blue-800" onClick={() => openEditMajor(m)} title="Sửa ngành">
                          <PencilSimple size={18} />
                        </button>
                        <button className="text-red-500 hover:text-red-700" onClick={() => removeMajor(m.Major_ID)} title="Xóa ngành">
                          <Trash size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

