import React from "react";

export default function EventDetailModal({ open, event, onClose, onRequestCancel, loading }) {
  if (!open || !event) return null;

  const start = event.start ? new Date(event.start) : null;
  const startStr = start ? start.toLocaleString("vi-VN", { dateStyle: "full", timeStyle: "short" }) : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">Chi tiết lịch hẹn</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-sm text-gray-500">Tiêu đề</p>
              <p className="font-semibold">{event.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Thời gian</p>
              <p className="font-semibold">{startStr}</p>
            </div>
            {event.extendedProps && event.extendedProps.teacher && (
              <div>
                <p className="text-sm text-gray-500">Giảng viên</p>
                <p className="font-semibold">{event.extendedProps.teacher}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded">Đóng</button>
            <button
              onClick={() => onRequestCancel(event)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              disabled={loading}
            >
              {loading ? "Đang..." : "Hủy lịch"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
