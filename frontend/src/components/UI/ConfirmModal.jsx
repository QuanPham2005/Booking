import React from "react";

export default function ConfirmModal({ open, title = "Xác nhận", description = "Bạn có chắc không?", onConfirm, onCancel, confirmText = "Xác nhận", cancelText = "Hủy", loading = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{description}</p>
          <div className="flex gap-3 justify-end">
            <button onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300" disabled={loading}>
              {cancelText}
            </button>
            <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" disabled={loading}>
              {loading ? "Đang..." : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
