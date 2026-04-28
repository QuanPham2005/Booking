import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { NotificationItem } from "../../components/UI/NotificationItem";
import { Button } from "../../components/UI/Button";

const ROLE_OPTIONS = [
  { value: "All", label: "Tất cả" },
  { value: "Student", label: "Sinh viên" },
  { value: "Lecturer", label: "Giảng viên" },
];

export default function Notifications() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({ Title: "", Content: "", Target_Role: "All" });
  const [message, setMessage] = useState(null);

  const jwt = () => localStorage.getItem("jwtToken");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/notifications`, {
        headers: { Authorization: `Bearer ${jwt()}` },
      });
      setNotes(res.data.data?.notifications || []);
    } catch (err) {
      console.warn("Notifications not available", err);
      setError("Không thể tải thông báo");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jwt()) {
      navigate("/admin/login");
      return;
    }
    fetchNotifications();
  }, [navigate]);

  const resetForm = () => {
    setEditingId(null);
    setFormState({ Title: "", Content: "", Target_Role: "All" });
    setFormOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.Title.trim() || !formState.Content.trim()) {
      setError("Title và Content không được để trống.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/notifications${editingId ? `/${editingId}` : ""}`;
      const method = editingId ? "patch" : "post";
      await axios[method](url, formState, {
        headers: { Authorization: `Bearer ${jwt()}` },
      });
      await fetchNotifications();
      const successText = editingId ? "Cập nhật thông báo thành công." : "Tạo thông báo thành công.";
      toast.success(successText);
      setMessage(successText);
      resetForm();
    } catch (err) {
      console.error("Notification save failed", err);
      const errorMessage = err?.response?.data?.message || "Lưu thông báo thất bại.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setFormState({ Title: note.title || "", Content: note.content || note.message || "", Target_Role: note.Target_Role || "All" });
    setFormOpen(true);
    setMessage(null);
    setError(null);
  };

  const handleDelete = async (note) => {
    if (!window.confirm("Bạn có chắc muốn xóa thông báo này không?")) return;
    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/notifications/${note.id}`, {
        headers: { Authorization: `Bearer ${jwt()}` },
      });
      await fetchNotifications();
      setMessage("Xóa thông báo thành công.");
      if (editingId === note.id) resetForm();
    } catch (err) {
      console.error("Notification delete failed", err);
      setError(err?.response?.data?.message || "Xóa thông báo thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          
          <Button onClick={() => setFormOpen((prev) => !prev)}>
            {formOpen ? "Đóng biểu mẫu" : editingId ? "Sửa thông báo" : "Tạo thông báo mới"}
          </Button>
        </div>
      </div>

      {formOpen && (
        <div className="p-5 border rounded-xl bg-white shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Tiêu đề</label>
              <input
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-udck-primary focus:outline-none"
                value={formState.Title}
                onChange={(e) => setFormState((prev) => ({ ...prev, Title: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Nội dung</label>
              <textarea
                className="mt-2 w-full min-h-[120px] rounded-lg border border-slate-300 px-3 py-2 focus:border-udck-primary focus:outline-none"
                value={formState.Content}
                onChange={(e) => setFormState((prev) => ({ ...prev, Content: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Đối tượng</label>
              <select
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-udck-primary focus:outline-none"
                value={formState.Target_Role}
                onChange={(e) => setFormState((prev) => ({ ...prev, Target_Role: e.target.value }))}
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {message && <p className="text-sm text-green-600">{message}</p>}

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={loading}>
                {editingId ? "Cập nhật" : "Lưu"}
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm}>
                Hủy
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {loading && !formOpen ? (
          <p>Đang tải thông báo...</p>
        ) : error && notes.length === 0 ? (
          <p className="text-red-600">{error}</p>
        ) : notes.length === 0 ? (
          <p className="text-gray-500">Hiện chưa có thông báo.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <NotificationItem
                    type={note.type || "system"}
                    title={note.title}
                    description={note.content || note.message}
                    time={note.Created_At || note.createdAt}
                  />
                </div>
                <div className="flex flex-col gap-2 sm:items-end">
                  <span className="text-xs font-semibold uppercase text-slate-500">
                    Dành cho: {note.Target_Role || "All"}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(note)}>
                      Sửa
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(note)}>
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
