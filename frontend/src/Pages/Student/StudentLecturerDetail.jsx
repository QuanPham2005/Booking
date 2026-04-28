import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import StudentLayout from "../../components/Layouts/StudentLayout";
import { User, Envelope, MapPin, GraduationCap, Clock, Calendar, ArrowLeft, Briefcase, Buildings, IdentificationBadge } from "phosphor-react";

export default function LecturerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lecturer, setLecturer] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const jwt = () => localStorage.getItem("Student jwtToken");

  useEffect(() => {
    if (!jwt()) {
      navigate("/student/login");
      return;
    }
    
    // Fetch lecturer info
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/student/lecturers/${id}`, {
      headers: { Authorization: `Bearer ${jwt()}` },
    })
      .then((resL) => {
        setLecturer(resL.data.data?.lecturer || null);
      })
      .catch(() => {
        setLecturer(null);
      })
      .finally(() => {
        // Only set loading to false after lecturer fetch completes
        setLoading(false);
      });
    
    // Fetch slots independently
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/student/lecturers/${id}/slots`, {
      headers: { Authorization: `Bearer ${jwt()}` },
    })
      .then((resS) => {
        const slotsData = resS.data.data?.slots || [];
        setSlots(slotsData);
        const removed = resS.data.meta?.removed || 0;
        if (removed > 0) {
          toast('Một vài khung giờ đã quá hạn và bị xóa', { icon: '⚠️' });
        }
      })
      .catch(() => {
        setSlots([]);
      });
  }, [id]);

  const formatTime = (t) => {
    if (!t) return "";
    if (typeof t === "string") return t.slice(0, 5);
    return t;
  };

  const sortedSlots = [...slots]
    .filter((s) => !s?.expired)
    .sort((a, b) => {
      const aKey = new Date(`${a.Date}T${String(a.StartTime || "00:00:00")}`).getTime();
      const bKey = new Date(`${b.Date}T${String(b.StartTime || "00:00:00")}`).getTime();
      return bKey - aKey; // mới nhất lên trên
    });

  if (loading) return (
    <StudentLayout title="Đang tải..." user={{ name: localStorage.getItem("Student Name") || "Sinh viên" }}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải thông tin giảng viên...</p>
        </div>
      </div>
    </StudentLayout>
  );
  
  if (!lecturer) return (
    <StudentLayout title="Không tìm thấy" user={{ name: localStorage.getItem("Student Name") || "Sinh viên" }}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy giảng viên</h3>
          <p className="text-gray-500 mb-4">Giảng viên này không tồn tại hoặc đã bị xóa.</p>
          <Link
            to="/student/dashboard/search"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft size={16} />
            Quay lại tìm kiếm
          </Link>
        </div>
      </div>
    </StudentLayout>
  );

  return (
    <StudentLayout title="Hồ sơ giảng viên" user={{ name: localStorage.getItem("Student Name") || "Sinh viên" }}>
      <div className="space-y-6">
        {/* Back Navigation */}
        <Link
          to="/student/dashboard/search"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft size={16} />
          Quay lại tìm kiếm giảng viên
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row gap-6 -mt-16">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl border-4 border-white overflow-hidden bg-gray-100 shadow-lg">
                    {(lecturer.picture || lecturer.avatar) ? (
                      <img
                        src={lecturer.picture || lecturer.avatar}
                        alt={lecturer.Full_Name || lecturer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                        <span className="text-4xl text-white font-bold">
                          {(lecturer.Full_Name || lecturer.name)?.charAt(0).toUpperCase() || "?"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 pt-16 md:pt-20">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {lecturer.Full_Name || lecturer.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
                      <p className="flex items-center gap-2 text-sm">
                        <GraduationCap size={16} />
                        {lecturer.major || lecturer.department || "Chưa cập nhật chuyên ngành"}
                      </p>
                      <p className="flex items-center gap-2 text-sm text-gray-500">
                        <Envelope size={16} />
                        {lecturer.Email || lecturer.email || "Chưa cập nhật email"}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 px-6 pb-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 text-gray-500">
                    <Briefcase size={18} className="text-gray-400" />
                    <span className="text-sm font-semibold">Chuyên môn</span>
                  </div>
                  <p className="text-sm leading-7 text-gray-700">
                    {lecturer.Specialization || lecturer.specialization || "Chưa cập nhật chuyên môn."}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 text-gray-500">
                    <MapPin size={18} className="text-gray-400" />
                    <span className="text-sm font-semibold">Khoa/Đơn vị</span>
                  </div>
                  <p className="text-sm leading-7 text-gray-700">
                    {lecturer.department || lecturer.subject || "Chưa cập nhật khoa/đơn vị."}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 text-gray-500">
                    <Buildings size={18} className="text-gray-400" />
                    <span className="text-sm font-semibold">Phòng làm việc</span>
                  </div>
                  <p className="text-sm leading-7 text-gray-700">
                    {lecturer.Office_Room || lecturer.officeRoom || "Chưa cập nhật phòng làm việc."}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 text-gray-500">
                    <IdentificationBadge size={18} className="text-gray-400" />
                    <span className="text-sm font-semibold">Học hàm/Học vị</span>
                  </div>
                  <p className="text-sm leading-7 text-gray-700">
                    {lecturer.Academic_Rank || lecturer.academicRank || lecturer.HocHam || lecturer.HocVi || "Chưa cập nhật học hàm/học vị."}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Giới thiệu</h2>
                <p className="text-sm leading-7 text-gray-600">
                  {lecturer.Bio || lecturer.bio || "Giảng viên chưa cập nhật giới thiệu."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Slots */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Clock size={18} className="text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Lịch trống</h2>
                <p className="text-sm text-gray-500">Các khung giờ có thể đặt lịch tư vấn</p>
              </div>
            </div>
            
            {/* Slots Count and View Details Button */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{slots.length}</p>
                <p className="text-sm text-gray-500">khung giờ trống</p>
              </div>
              
            </div>
          </div>

          {/* Slots List */}
          <div id="slots-list" className="space-y-3">
            {sortedSlots.length > 0 ? (
              sortedSlots.map((slot) => (
                <div
                  key={slot.Slot_ID}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        <span>
                          {slot.Date}
                          {slot.expired && (
                            <span className="ml-2 text-red-500 text-xs font-medium">(Quá hạn)</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <Clock size={14} className="text-gray-400" />
                        <span>{formatTime(slot.StartTime)} - {formatTime(slot.EndTime)}</span>
                      </div>
                    </div>
                    <Link
                      to={`/student/dashboard/book/form?lecturerId=${id}&slotId=${slot.Slot_ID}&lecturerName=${encodeURIComponent(lecturer.name || lecturer.Full_Name)}&date=${slot.Date}&time=${formatTime(slot.StartTime)}`}
                      className={`px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${slot.expired ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                      onClick={(e) => slot.expired && e.preventDefault()}
                    >
                      Đặt lịch
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock size={20} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có lịch trống</h3>
                <p className="text-gray-500 text-sm">Giảng viên chưa cập nhật khung giờ tư vấn</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
