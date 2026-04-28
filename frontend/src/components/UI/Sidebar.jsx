import { NavLink } from "react-router-dom";
import { X } from "phosphor-react";

export const Sidebar = ({ items = [], logo, user, onLogout, onClose }) => {

  return (
    <aside className="w-64 bg-udck-dark/95 backdrop-blur-md min-h-screen text-white flex flex-col shadow-2xl border-r border-white/10">
      
      {/* LOGO */}
      <div className="px-6 py-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <img
            src={logo || "/assets/logo2.png"}
            alt="UDCK"
            className="h-12 w-12 object-contain rounded-lg"
          />

          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-300">
              UDCK
            </span>
            <span className="text-xs text-gray-400">
              Appointment System
            </span>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20 lg:hidden"
          >
            <X size={20} weight="bold" />
          </button>
        )}
      </div>

      {/* MOBILE PROFILE */}
      <div className="px-6 py-4 border-b border-white/10 sm:hidden">
        <p className="text-sm text-slate-300">Xin chào</p>
        <p className="mt-1 text-lg font-semibold text-white">{user?.name || "Người dùng"}</p>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-2 py-4 space-y-3">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact || false}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-4 rounded-3xl transition-all duration-200 ${
                isActive
                  ? "bg-white/10 text-white shadow-inner"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <div className="rounded-2xl p-3 bg-white/10 text-white">
              {item.icon}
            </div>
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* MOBILE LOGOUT */}
      <div className="mt-auto border-t border-white/10 px-6 py-5 sm:hidden">
        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-3xl bg-white/10 px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-white/20"
        >
          Đăng xuất
        </button>
      </div>

      {/* FOOTER */}
      <div className="px-4 py-6 text-xs text-udck-accent-light">
        © 2026 UDCK
      </div>
    </aside>
  );
};

export default Sidebar;