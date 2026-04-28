/**
 * NotificationItem Component
 * Displays a single notification entry
 */
import { Clock, CheckCircle, Bell, XCircle } from "lucide-react";

const iconMap = {
  request: <Clock className="w-6 h-6 text-orange-500" />,
  confirmed: <CheckCircle className="w-6 h-6 text-green-500" />,
  cancelled: <XCircle className="w-6 h-6 text-red-500" />,
  system: <Bell className="w-6 h-6 text-blue-500" />,
};

export const NotificationItem = ({
  type = "system",
  title,
  description,
  time,
  isNew = false,
}) => {
  const formatTime = (value) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value || "";
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg bg-white">
      <div className="flex-shrink-0">{iconMap[type]}</div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{formatTime(time)}</p>
      </div>
      {isNew && <span className="ml-2 text-xs font-semibold text-red-600">New</span>}
    </div>
  );
};

export default NotificationItem;
