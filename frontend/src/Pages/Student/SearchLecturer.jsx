import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import StudentLayout from "../../components/Layouts/StudentLayout";
import { User, MagnifyingGlass, GraduationCap, MapPin, Clock, Star, CaretDown, Spinner } from "phosphor-react";
import { Card, Button, Dropdown, SearchBar, Avatar } from "../../components/UI";

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Skeleton component for lecturer cards
const LecturerSkeleton = () => (
  <Card className="p-6 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  </Card>
);

const SearchLecturer = () => {
  const navigate = useNavigate();
  const [lecturers, setLecturers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [deptId, setDeptId] = useState("");
  const [majorList, setMajorList] = useState([]);
  const [majorsWithDept, setMajorsWithDept] = useState([]); // Store majors with department info
  const [majorFilter, setMajorFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Dropdown states
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [majorDropdownOpen, setMajorDropdownOpen] = useState(false);
  const deptDropdownRef = useRef(null);
  const majorDropdownRef = useRef(null);

  const jwt = () => localStorage.getItem("Student jwtToken");

  useEffect(() => {
    if (!jwt()) {
      navigate("/student/login");
      return;
    }

    const loadInitialData = async () => {
      try {
        setInitialLoading(true);

        const [deptRes, majorRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/student/departments`, {
            headers: { Authorization: `Bearer ${jwt()}` },
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/student/majors`, {
            headers: { Authorization: `Bearer ${jwt()}` },
          })
        ]);

        setDepartments(deptRes.data.data?.departments || []);
        
        const majors = Array.isArray(majorRes.data.data?.majors) ? majorRes.data.data.majors : [];
        setMajorList(majors.map(m => m.MajorName));
        setMajorsWithDept(majors);

        // Load initial lecturers
        await fetchLecturers();
      } catch (error) {
        console.error("Error loading initial data:", error);
        setDepartments([]);
        setMajorList([]);
        setMajorsWithDept([]);
        setLecturers([]);
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  

  // 1. Đưa fetchSlotsForLecturers lên trước
  const fetchSlotsForLecturers = async (lecturersList) => {
    try {
      const slotPromises = lecturersList.slice(0, 20).map(async (lecturer) => {
        try {
          const slotsRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/student/lecturers/${lecturer._id}/slots`,
            { headers: { Authorization: `Bearer ${jwt()}` } }
          );
          return {
            lecturerId: lecturer._id,
            slots: slotsRes.data.data?.slots || []
          };
        } catch (error) {
          return {
            lecturerId: lecturer._id,
            slots: []
          };
        }
      });
      const slotResults = await Promise.all(slotPromises);
      setLecturers(prevLecturers =>
        prevLecturers.map(lecturer => {
          const slotData = slotResults.find(result => result.lecturerId === lecturer._id);
          return {
            ...lecturer,
            availableSlots: slotData ? slotData.slots.length : 0
          };
        })
      );
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  // 2. fetchLecturers gọi fetchSlotsForLecturers
  const fetchLecturers = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/student/lecturers`, {
        headers: { Authorization: `Bearer ${jwt()}` },
        params,
      });
      const users = Array.isArray(res.data.data?.users) ? res.data.data.users : [];
      setLecturers(users);
      if (users.length > 0) {
        fetchSlotsForLecturers(users);
      }
    } catch (error) {
      console.error("Error fetching lecturers:", error);
      setError("Không thể tải danh sách giảng viên");
      setLecturers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect for debounced search
  useEffect(() => {
    if (initialLoading) return; // Don't search during initial load

    const params = {};
    if (deptId) params.deptId = deptId;
    if (majorFilter) params.major = majorFilter;
    if (debouncedSearchQuery.trim()) params.q = debouncedSearchQuery.trim();

    fetchLecturers(params);
  }, [debouncedSearchQuery, deptId, majorFilter, fetchLecturers, initialLoading]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(event.target)) {
        setDeptDropdownOpen(false);
      }
      if (majorDropdownRef.current && !majorDropdownRef.current.contains(event.target)) {
        setMajorDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset major filter when department changes
  useEffect(() => {
    setMajorFilter("");
  }, [deptId]);

  // Get filtered majors based on selected department
  const getFilteredMajors = () => {
    if (!deptId) {
      // If no department selected, show all majors
      return [
        { value: "", label: "Tất cả chuyên ngành" },
        ...majorsWithDept.map((m) => ({ value: m.MajorName, label: m.MajorName }))
      ];
    }
    
    // If department selected, show only majors from that department
    const filteredMajors = majorsWithDept.filter(major => 
      major.Dept_ID && major.Dept_ID.toString() === deptId.toString()
    );
    
    return [
      { value: "", label: "Tất cả chuyên ngành" },
      ...filteredMajors.map((m) => ({ value: m.MajorName, label: m.MajorName }))
    ];
  };

  // Custom dropdown component
  const CustomDropdown = React.forwardRef(({ label, options, value, onChange, isOpen, setIsOpen }, ref) => {
    const selectedOption = options.find(opt => opt.value === value);
    const displayText = selectedOption ? selectedOption.label : label;

    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-blue-400 transition-colors"
        >
          <span className="truncate whitespace-nowrap">{displayText}</span>
          <CaretDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                  option.value === value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <span className="truncate whitespace-nowrap">{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  });

  return (
    <StudentLayout title="Tìm kiếm giảng viên" user={{ name: localStorage.getItem("Student Name") || "Sinh viên" }}>
      {initialLoading ? (
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="space-y-6">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch w-full">
            {/* Search Bar */}
            <div className="flex-1 min-w-0">
              <SearchBar
                placeholder="Tìm kiếm theo tên giảng viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            {/* Department Dropdown */}
            <div className="relative w-full lg:w-64 flex-shrink-0">
              <CustomDropdown
                label="Tất cả khoa"
                options={[
                  { value: "", label: "Tất cả khoa" },
                  ...departments.map((d) => ({ value: d.Dept_ID, label: d.DeptName })),
                ]}
                value={deptId}
                onChange={setDeptId}
                isOpen={deptDropdownOpen}
                setIsOpen={setDeptDropdownOpen}
                ref={deptDropdownRef}
                className="w-full"
              />
            </div>
            
            {/* Major Dropdown */}
            <div className="relative w-full lg:w-80 flex-shrink-0">
              <CustomDropdown
                label="Tất cả chuyên ngành"
                options={getFilteredMajors()}
                value={majorFilter}
                onChange={setMajorFilter}
                isOpen={majorDropdownOpen}
                setIsOpen={setMajorDropdownOpen}
                ref={majorDropdownRef}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Lecturers Grid */}
        {error ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => fetchLecturers()} variant="outline">
                Thử lại
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading && lecturers.length === 0 ? (
              // Show skeletons when loading and no data yet
              Array.from({ length: 8 }).map((_, index) => (
                <LecturerSkeleton key={index} />
              ))
            ) : lecturers.length === 0 ? (
              // Empty state
              <div className="col-span-full flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy giảng viên</h3>
                  <p className="text-gray-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                </div>
              </div>
            ) : (
              lecturers.map((lecturer) => (
                <div
                  key={lecturer._id || lecturer.Lecturer_ID}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Lecturer Image Section */}
                  <div className="relative h-96 bg-gray-100 overflow-hidden">
                    {(lecturer.picture || lecturer.avatar) ? (
                      <img
                        src={lecturer.picture || lecturer.avatar}
                        alt={lecturer.Full_Name || lecturer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
                          <span className="text-2xl font-bold text-blue-600">
                            {(lecturer.Full_Name || lecturer.name)?.charAt(0).toUpperCase() || "?"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lecturer Info */}
                  <div className="p-5">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                          {lecturer.Full_Name || lecturer.name}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <GraduationCap size={14} />
                          {lecturer.major || lecturer.department || "Chưa cập nhật"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={14} className="text-gray-400" />
                          <span>{lecturer.department || lecturer.subject || "Chưa cập nhật"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={14} className="text-gray-400" />
                          <span>{lecturer.availableSlots || 0} khung giờ trống</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2">
                        <Link
                          to={`/student/dashboard/lecturer/${lecturer.Lecturer_ID || lecturer._id}`}
                          className="block w-full text-center py-2 px-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Xem hồ sơ
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      )}
    </StudentLayout>
  );
};

export default SearchLecturer;
