import React from "react";

export default function DashboardCard({ icon: Icon, title, description, count, onClick, color = "bg-blue-500" }) {
  return (
    <div
      onClick={onClick}
      className={`${color} rounded-xl shadow-lg p-6 sm:p-8 text-white cursor-pointer transition-all duration-300 transform hover:shadow-2xl hover:scale-105 hover:-translate-y-1 min-h-44 sm:min-h-48 flex flex-col justify-between group`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-base sm:text-xl font-bold mb-1 group-hover:text-white transition-colors">{title}</h3>
          <p className="text-xs sm:text-sm opacity-90 group-hover:opacity-100 transition-opacity">{description}</p>
        </div>
        {Icon && (
          <div className="ml-4 p-3 bg-white bg-opacity-20 rounded-lg group-hover:bg-opacity-30 transition-all duration-300">
            <Icon size={24} className="sm:w-8 sm:h-8 opacity-90 group-hover:opacity-100" />
          </div>
        )}
      </div>
      {count !== undefined && (
        <div className="text-3xl sm:text-5xl font-bold mt-6 group-hover:scale-110 transition-transform duration-300 origin-left">
          {count}
        </div>
      )}
    </div>
  );
}
