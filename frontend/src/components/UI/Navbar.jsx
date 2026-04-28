import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaBell,
  FaUser,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { logoutUser } from "../../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount] = useState(0);

  /* ================= AUTH DATA ================= */

  const localData =
    localStorage.getItem("Teacher jwtToken") ||
    localStorage.getItem("Student jwtToken") ||
    localStorage.getItem("jwtToken");

  const isTeacher = localStorage.getItem("Teacher jwtToken");
  const isStudent = localStorage.getItem("Student jwtToken");

  const userData =
    localStorage.getItem("Student Name") ||
    localStorage.getItem("Teacher Name") ||
    localStorage.getItem("Admin Name");

  /* ================= RESET UI WHEN ROUTE CHANGE ================= */

  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  /* ================= LOGOUT ================= */

  const changeHandler = () => {
    logoutUser();
    toast.success("Đăng xuất thành công");
    navigate("/");
  };

  /* ================= ACTIVE LINK STYLE ================= */

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-2 font-semibold text-sm transition-all duration-300
    ${
      isActive
        ? "text-udck-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-udck-primary"
        : "text-gray-700 hover:text-udck-primary"
    }`;

  /* ================= JSX ================= */

  return (
    <>
      <nav className="sticky top-0 z-50 transition-colors duration-300 bg-white border-b border-gray-200">
        <div className="container mx-auto px-3 sm:px-6 flex justify-between items-center py-3 min-h-[70px]">
          
          {/* ========= LOGO ========= */}
          <Link
            to={!localData ? "/" : "#"}
            className="flex items-center gap-3"
          >
            <img
              src="/assets/logo2.png"
              alt="UDCK"
              className="h-12 w-12 object-contain"
            />

            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-semibold text-gray-600">
                UDCK
              </span>
              <span className="text-xs text-gray-500">
                Appointment System
              </span>
            </div>
          </Link>

          {/* ========= STUDENT NAV ========= */}
          {isStudent && (
            <div className="hidden md:flex items-center gap-2 flex-grow justify-center">
              <NavLink to="/student/dashboard" end className={navLinkClass}>
                Dashboard
              </NavLink>

              <NavLink
                to="/student/dashboard/book"
                className={navLinkClass}
              >
                Đặt lịch
              </NavLink>

              <NavLink
                to="/student/dashboard/appointments"
                className={navLinkClass}
              >
                Quản lý lịch
              </NavLink>
            </div>
          )}

          {/* ========= RIGHT ACTIONS ========= */}
          <div className="flex items-center gap-3">

            {/* MOBILE MENU */}
            {isStudent && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-white hover:bg-white/10"
              >
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            )}

            {/* NOTIFICATION */}
            {isTeacher && (
              <button className="relative p-2 rounded-full text-white hover:bg-white/10">
                <FaBell />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 text-xs bg-red-500 w-5 h-5 rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
            )}

            {/* USER DROPDOWN */}
            {localData && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-white hover:bg-white/10"
                >
                  <FaUser />
                  <span className="hidden sm:block text-sm font-semibold">
                    {userData?.split(" ")[0]}
                  </span>
                  <FaChevronDown
                    className={`transition ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50 bg-white border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-600">
                      <p className="text-sm font-semibold">{userData}</p>
                    </div>

                    <button
                      onClick={changeHandler}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-500/10"
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ========= MOBILE MENU ========= */}
      {mobileMenuOpen && isStudent && (
        <div className="md:hidden bg-white border-b">
          <div className="px-4 py-3 space-y-2">
            <NavLink
              to="/student/dashboard"
              end
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg ${
                  isActive
                    ? "bg-udck-primary text-white"
                    : "hover:bg-gray-200"
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/student/dashboard/book"
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg ${
                  isActive
                    ? "bg-udck-primary text-white"
                    : "hover:bg-gray-200"
                }`
              }
            >
              Đặt lịch
            </NavLink>

            <NavLink
              to="/student/dashboard/appointments"
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg ${
                  isActive
                    ? "bg-udck-primary text-white"
                    : "hover:bg-gray-200"
                }`
              }
            >
              Quản lý lịch
            </NavLink>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;