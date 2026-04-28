import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StudentLayout from "../../components/Layouts/StudentLayout";
import { NotificationItem } from "../../components/UI/NotificationItem";
import { Button } from "../../components/UI/Button";

const Notifications = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const jwt = () => localStorage.getItem("Student jwtToken");

  useEffect(() => {
    if (!jwt()) {
      navigate("/student/login");
      return;
    }

    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/student/notifications`, {
        headers: { Authorization: `Bearer ${jwt()}` },
      });

      setNotes(res.data.data || []);
    } catch (err) {
      console.error('Notifications fetch error:', err);
      setError("Không thể tải thông báo");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/v1/student/notifications/mark-all-read`;
    try {
      await axios.patch(url, {}, {
        headers: { Authorization: `Bearer ${jwt()}` },
      });
    } catch (err) {
      if (err.response?.status === 404) {
        try {
          await axios.post(url, {}, {
            headers: { Authorization: `Bearer ${jwt()}` },
          });
        } catch (innerErr) {
          console.error('Mark all as read fallback error:', innerErr);
          return;
        }
      } else {
        console.error('Mark all as read error:', err);
        return;
      }
    }

    setNotes(notes.map((note) => ({ ...note, read: true })));
  };

  if (loading) {
    return (
      <StudentLayout title="Thông báo" user={{ name: localStorage.getItem("Student Name") || "Sinh viên" }}>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout title="Thông báo" user={{ name: localStorage.getItem("Student Name") || "Sinh viên" }}>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Lỗi tải thông báo</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchNotifications}>Thử lại</Button>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="Thông báo" user={{ name: localStorage.getItem("Student Name") || "Sinh viên" }}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
          {notes.length > 0 && (
            <Button size="sm" variant="outline" onClick={markAllAsRead}>
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📭</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Không có thông báo</h2>
            <p className="text-gray-600">Bạn chưa có thông báo nào.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((n) => (
              <NotificationItem
                key={n.id || n._id}
                type={n.type || 'system'}
                title={n.title}
                description={n.message || n.body}
                time={n.time || n.createdAt}
                isNew={!n.read}
              />
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default Notifications;
