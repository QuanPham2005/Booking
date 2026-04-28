import { NavLink } from "react-router-dom";

export const BottomNav = ({ items = [] }) => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 lg:hidden bg-white/85 backdrop-blur-md border-t border-slate-200/60 shadow-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-1 px-2 py-2 sm:px-4">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact || false}
            aria-label={item.label}
            className={({ isActive }) =>
              `relative group flex flex-1 items-center justify-center rounded-3xl px-3 py-3 transition-all duration-200 ${
                isActive
                  ? "text-slate-900 bg-slate-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`text-xl transition-transform duration-200 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}>
                  {item.icon}
                </div>
                <span className={`absolute -bottom-2 h-1 w-1 rounded-full bg-udck-primary transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
