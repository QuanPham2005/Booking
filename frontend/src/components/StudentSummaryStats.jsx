import React from "react";
import { Clock, Users, AlertCircle } from "lucide-react";

export default function StudentSummaryStats({ bookedAppointments, pendingAppointments, upcomingAppointments, theme }) {
  return (
    <div className={`rounded-xl p-4 sm:p-6 border-l-4 ${
      theme === "light" 
        ? "bg-blue-50 border-l-blue-500 border-blue-500" 
        : "bg-slate-800 border-l-blue-400 border-blue-400"
    } mb-6`}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Booked Appointments */}
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-lg ${
            theme === "light" 
              ? "bg-green-100 text-green-600" 
              : "bg-green-900/30 text-green-400"
          }`}>
            <Clock size={24} />
          </div>
          <div>
            <p className={`text-sm font-medium ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}>
              Lịch Đã Đặt
            </p>
            <p className={`text-2xl sm:text-3xl font-bold mt-1 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>
              {bookedAppointments}
            </p>
          </div>
        </div>

        {/* Pending Appointments */}
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-lg ${
            theme === "light" 
              ? "bg-yellow-100 text-yellow-600" 
              : "bg-yellow-900/30 text-yellow-400"
          }`}>
            <AlertCircle size={24} />
          </div>
          <div>
            <p className={`text-sm font-medium ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}>
              Chờ Phê Duyệt
            </p>
            <p className={`text-2xl sm:text-3xl font-bold mt-1 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>
              {pendingAppointments}
            </p>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-lg ${
            theme === "light" 
              ? "bg-purple-100 text-purple-600" 
              : "bg-purple-900/30 text-purple-400"
          }`}>
            <Users size={24} />
          </div>
          <div>
            <p className={`text-sm font-medium ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}>
              Sắp Tới
            </p>
            <p className={`text-2xl sm:text-3xl font-bold mt-1 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>
              {upcomingAppointments}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
