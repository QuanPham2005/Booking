/**
 * MainLayout wraps Sidebar + Header + Content
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../hooks/useAuth";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import BottomNav from "./BottomNav";

export const MainLayout = ({
  sidebarItems,
  title,
  notificationsCount,
  user,
  headerProps = {},
  logo = null,
  children,
}) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [drawerOpen]);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const handleToggleSidebar = () => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setSidebarVisible((prev) => !prev);
      return;
    }
    setDrawerOpen(true);
  };

  return (
    <div className={`min-h-screen bg-udck-muted text-slate-900 ${drawerOpen ? "overflow-hidden" : ""}`}>
      {/* Desktop sidebar fixed on large screens */}
      <motion.div
        initial={false}
        animate={{ x: sidebarVisible ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="hidden lg:block lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-64"
        style={{ pointerEvents: sidebarVisible ? "auto" : "none" }}
      >
        <Sidebar items={sidebarItems} logo={logo} user={user} onLogout={handleLogout} />
      </motion.div>

      <div className={`transition-all duration-300 ease-in-out ${sidebarVisible ? "lg:ml-64" : "lg:ml-0"}`}>
        <Header
          title={title}
          notificationsCount={notificationsCount}
          user={user}
          onToggleSidebar={handleToggleSidebar}
          onLogout={handleLogout}
          {...headerProps}
        />

        <main className="min-h-[calc(100vh-70px)] pb-28 lg:pb-0 bg-udck-muted">
          <div className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-6 sm:py-6 lg:px-6">
            {children}
          </div>
        </main>
      </div>

      <BottomNav items={sidebarItems} />

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-slate-900/40"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="absolute left-0 top-0 bottom-0 w-[280px] bg-udck-dark shadow-2xl"
            >
              <div className="h-full overflow-y-auto no-scrollbar">
                <Sidebar items={sidebarItems} logo={logo} user={user} onLogout={handleLogout} onClose={() => setDrawerOpen(false)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainLayout;
