import React from "react";
import { AlertCircle, Calendar, TrendingUp } from "lucide-react";

export default function SummaryStats({ pendingRequests, todayAppointments, weekAppointments, theme }) {
  return (
    <div className={`rounded-xl p-4 sm:p-6 border-l-4 ${
      theme === "light" 
        ? "bg-blue-50 border-l-blue-500 border-blue-500" 
        : "bg-slate-800 border-l-blue-400 border-blue-400"
    } mb-6`}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Pending Requests */}
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-lg ${
            theme === "light" 
              ? "bg-red-100 text-red-600" 
              : "bg-red-900/30 text-red-400"
          }`}>
            <AlertCircle size={24} />
          </div>
          <div>
            <p className={`text-sm font-medium ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}>
              Yêu Cầu Chờ Duyệt
            </p>
            <p className={`text-2xl sm:text-3xl font-bold mt-1 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>
              {pendingRequests}
            </p>
          </div>
        </div>

        {/* Today Appointments */}
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-lg ${
            theme === "light" 
              ? "bg-green-100 text-green-600" 
              : "bg-green-900/30 text-green-400"
          }`}>
            <Calendar size={24} />
          </div>
          <div>
            <p className={`text-sm font-medium ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}>
              Lịch Hôm Nay
            </p>
            <p className={`text-2xl sm:text-3xl font-bold mt-1 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>
              {todayAppointments}
            </p>
          </div>
        </div>

        {/* Week Appointments */}
        <div className="flex items-start gap-3">
          <div className={`p-3 rounded-lg ${
            theme === "light" 
              ? "bg-purple-100 text-purple-600" 
              : "bg-purple-900/30 text-purple-400"
          }`}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p className={`text-sm font-medium ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}>
              Lịch Tuần Này
            </p>
            <p className={`text-2xl sm:text-3xl font-bold mt-1 ${
              theme === "light" ? "text-gray-900" : "text-white"
            }`}>
              {weekAppointments}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
