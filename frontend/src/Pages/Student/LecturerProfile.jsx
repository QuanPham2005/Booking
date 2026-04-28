import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import StudentLayout from "../../components/Layouts/StudentLayout";
import { Card, Button, Avatar } from "../../components/UI";
import {
  User,
  Envelope,
  MapPin,
  GraduationCap,
  Clock,
  Calendar,
  ArrowLeft,
  Phone,
  Star,
  BookOpen
} from "phosphor-react";

const LecturerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lecturer, setLecturer] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const jwt = () => localStorage.getItem("Student jwtToken");

  useEffect(() => {
    if (!jwt()) {
      navigate("/student/login");
      return;
    }

    fetchLecturerData();
  }, [id]);

  const fetchLecturerData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [lecturerRes, slotsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/student/lecturers/${id}`, {
          headers: { Authorization: `Bearer ${jwt()}` },
        }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/student/lecturers/${id}/slots`, {
          headers: { Authorization: `Bearer ${jwt()}` },
        })
      ]);

      setLecturer(lecturerRes.data.data?.lecturer || null);
      setSlots(slotsRes.data.data?.slots || []);
    } catch (error) {
      console.error("Error fetching lecturer data:", error);
      setError("Không thể tải thông tin giảng viên");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout title="Thông tin giảng viên">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </StudentLayout>
    );
  }

  if (error || !lecturer) {
    return (
      <StudentLayout title="Thông tin giảng viên">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/student/dashboard/search" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Thông tin giảng viên</h1>
          </div>

          <Card className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <User size={48} className="mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {error || "Không tìm thấy thông tin giảng viên"}
            </h2>
            <p className="text-gray-600 mb-6">
              Vui lòng thử lại hoặc quay lại trang tìm kiếm.
            </p>
            <Link to="/student/dashboard/search">
              <Button>Quay lại tìm kiếm</Button>
            </Link>
          </Card>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="Thông tin giảng viên">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/student/dashboard/search" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Thông tin giảng viên</h1>
        </div>

        {/* Lecturer Info Card */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start">
              <Avatar
                name={lecturer.name}
                size="xl"
                className="mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{lecturer.name}</h2>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <GraduationCap size={20} />
                <span>{lecturer.major}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin size={20} />
                <span>{lecturer.department}</span>
              </div>
            </div>

            {/* Detailed Info */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lecturer.email && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Envelope size={20} className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{lecturer.email}</p>
                    </div>
                  </div>
                )}

                {lecturer.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone size={20} className="text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Số điện thoại</p>
                      <p className="font-medium">{lecturer.phone}</p>
                    </div>
                  </div>
                )}

                {lecturer.office && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin size={20} className="text-red-600" />
                    <div>
                      <p className="text-sm text-gray-500">Văn phòng</p>
                      <p className="font-medium">{lecturer.office}</p>
                    </div>
                  </div>
                )}

                {lecturer.rating && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Star size={20} className="text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-500">Đánh giá</p>
                      <p className="font-medium">{lecturer.rating}/5.0</p>
                    </div>
                  </div>
                )}
              </div>

              {lecturer.bio && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Giới thiệu</h3>
                  <p className="text-blue-800">{lecturer.bio}</p>
                </div>
              )}

              {lecturer.specializations && lecturer.specializations.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <BookOpen size={20} />
                    Chuyên môn
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {lecturer.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Available Slots */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar size={24} className="text-green-600" />
            Khung giờ trống
          </h3>

          {slots.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Không có khung giờ trống</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slots.slice(0, 6).map((slot) => (
                <Card
                  key={slot.id}
                  className="p-4 hover:shadow-md transition-all border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Clock size={20} className="text-green-600" />
                    <div>
                      <p className="font-medium">{slot.date}</p>
                      <p className="text-sm text-gray-600">{slot.startTime} - {slot.endTime}</p>
                    </div>
                  </div>
                  {slot.location && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                      <MapPin size={12} />
                      {slot.location}
                    </p>
                  )}
                  <Link to={`/student/dashboard/book?slotId=${slot.id}&lecturerId=${id}&lecturerName=${encodeURIComponent(lecturer.name)}&date=${slot.date}&time=${slot.startTime}-${slot.endTime}`}>
                    <Button size="sm" className="w-full">
                      Đặt lịch
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}

          {slots.length > 6 && (
            <div className="text-center mt-6">
              <Link to={`/student/lecturer/${id}`}>
                <Button variant="outline">
                  Xem tất cả khung giờ
                </Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link to={`/student/lecturer/${id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Xem chi tiết & Đặt lịch
            </Button>
          </Link>
          <Link to="/student/dashboard/search" className="flex-1">
            <Button variant="secondary" className="w-full">
              Tìm giảng viên khác
            </Button>
          </Link>
        </div>
      </div>
    </StudentLayout>
  );
};

export default LecturerProfile;
