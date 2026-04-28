import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import StudentLayout from "../../components/Layouts/StudentLayout";
import { Button, Card, Input } from "../../components/UI";
import { ArrowLeft, Calendar, Clock, User, FileText, MapPin } from "phosphor-react";

const BookingForm = () => {
  const navigate = useNavigate();
  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const jwt = () => localStorage.getItem("Student jwtToken");

  useEffect(() => {
    if (!jwt()) {
      navigate("/student/login");
      return;
    }

    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/student/lecturers`,
        { headers: { Authorization: `Bearer ${jwt()}` } }
      );
      setLecturers(res.data.data?.lecturers || []);
    } catch (error) {
      console.error("Error fetching lecturers:", error);
      toast.error("Không thể tải danh sách giảng viên");
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async (lecturerId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/student/lecturers/${lecturerId}/slots`,
        { headers: { Authorization: `Bearer ${jwt()}` } }
      );
      setAvailableSlots(res.data.data?.slots || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Không thể tải khung giờ trống");
      setAvailableSlots([]);
    }
  };

  const handleLecturerSelect = (lecturer) => {
    setSelectedLecturer(lecturer);
    setSelectedSlot(null);
    setAvailableSlots([]);
    fetchSlots(lecturer.id);
  };

  const handleSubmit = async () => {
    if (!selectedLecturer || !selectedSlot || !reason.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setSubmitting(true);
      const studentId = JSON.parse(atob(jwt().split('.')[1])).id;

      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/student/appointments/${selectedSlot.id || selectedSlot.Slot_ID}`,
        {
          StuStartTime: selectedSlot.startTime || selectedSlot.StartTime,
          StuEndTime: selectedSlot.endTime || selectedSlot.EndTime,
          reason: reason.trim(),
          location: "",
          studentId,
        },
        { headers: { Authorization: `Bearer ${jwt()}` } }
      );

      toast.success("Đặt lịch thành công!");
      navigate("/student/dashboard/appointments");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error(error.response?.data?.message || "Đặt lịch thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <StudentLayout title="Đặt lịch tư vấn">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title="Đặt lịch tư vấn">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/student/dashboard/search" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Đặt lịch tư vấn</h1>
        </div>

        {/* Step 1: Select Lecturer */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User size={24} className="text-blue-600" />
            Chọn giảng viên
          </h2>

          {selectedLecturer ? (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">{selectedLecturer.name}</h3>
                  <p className="text-blue-700 text-sm">{selectedLecturer.department} - {selectedLecturer.major}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedLecturer(null)}
                >
                  Đổi
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {lecturers.map((lecturer) => (
                <Card
                  key={lecturer.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-all hover:border-blue-300"
                  onClick={() => handleLecturerSelect(lecturer)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{lecturer.name}</h3>
                      <p className="text-sm text-gray-600">{lecturer.department}</p>
                      <p className="text-sm text-gray-500">{lecturer.major}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* Step 2: Select Time Slot */}
        {selectedLecturer && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar size={24} className="text-green-600" />
              Chọn khung giờ
            </h2>

            {availableSlots.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Không có khung giờ trống</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableSlots.map((slot) => (
                  <Card
                    key={slot.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedSlot?.id === slot.id
                        ? 'border-green-500 bg-green-50'
                        : 'hover:border-green-300'
                    }`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <div className="flex items-center gap-3">
                      <Clock size={20} className="text-green-600" />
                      <div>
                        <p className="font-medium">{slot.date}</p>
                        <p className="text-sm text-gray-600">{slot.startTime} - {slot.endTime}</p>
                        {slot.location && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin size={12} />
                            {slot.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* Step 3: Reason */}
        {selectedSlot && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText size={24} className="text-purple-600" />
              Lý do tư vấn
            </h2>

            <div className="space-y-4">
              <Input
                type="textarea"
                placeholder="Mô tả ngắn gọn vấn đề bạn cần tư vấn..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
              />

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedSlot(null)}
                  className="flex-1"
                >
                  Quay lại
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !reason.trim()}
                  className="flex-1"
                >
                  {submitting ? "Đang đặt lịch..." : "Xác nhận đặt lịch"}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </StudentLayout>
  );
};

export default BookingForm;
