import PropTypes from "prop-types";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import {
  Avatar,
  IconButton,
  Typography,
  Tooltip,
} from "@material-tailwind/react";
import Swal from "sweetalert2";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";

export function Sidenav({ brandImg, brandName, routes }) {
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav } = controller;

  // Lấy user info từ localStorage (nếu có)
  const userInfo = (() => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  })();

  // ==================== HANDLERS ====================
  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Đăng xuất?",
      text: "Bạn có chắc muốn đăng xuất khỏi hệ thống?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#8B5E3C",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    });

    if (confirm.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Đã đăng xuất!",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      setTimeout(() => {
        navigate("/auth/sign-in");
      }, 500);
    }
  };

  // ==================== MAIN RENDER ====================
  return (
    <aside
      className={`fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-2xl transition-transform duration-300 xl:translate-x-0 ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3] shadow-xl border border-[#C89F77]/20 flex flex-col overflow-hidden`}
    >
      {/* ============ HEADER ============ */}
      <div className="relative flex-shrink-0">
        <Link
          to="/dashboard/home"
          className="block py-5 px-5 text-center border-b border-[#C89F77]/20"
        >
          <div className="flex items-center justify-center gap-3">
            {/* Logo Image */}
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg shadow-[#8B5E3C]/30 flex-shrink-0 p-1.5 overflow-hidden">
              <img
                src="/img/favicon.png"
                alt="Coffee Shop Logo"
                className="w-full h-full object-contain drop-shadow-sm"
              />
            </div>
            <div className="text-left">
              <Typography
                variant="h6"
                className="font-extrabold text-[#4e342e] text-sm tracking-tight leading-tight"
              >
                {brandName}
              </Typography>
              <Typography className="text-[9px] font-bold text-[#8B5E3C] uppercase tracking-widest mt-0.5">
                Staff Panel
              </Typography>
            </div>
          </div>
        </Link>

        {/* Close button (mobile) */}
        <IconButton
          variant="text"
          size="sm"
          ripple={false}
          className="absolute right-2 top-1/2 -translate-y-1/2 xl:hidden bg-[#faf6f1] hover:bg-[#8B5E3C] border border-[#C89F77]/30 group transition-all duration-200"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon
            strokeWidth={2.5}
            className="h-4 w-4 text-[#6d4c41] group-hover:text-white transition-colors"
          />
        </IconButton>
      </div>

      {/* ============ MENU (SCROLLABLE) ============ */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-[#C89F77]/40 scrollbar-track-transparent">
        {routes.map(({ layout, title, pages }, key) => (
          <div key={key} className="mb-5">
            {/* Section Header */}
            {title && (
              <div className="mb-3 mt-2 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                  <Typography className="text-[10px] font-extrabold uppercase text-[#8B5E3C] tracking-widest">
                    {title}
                  </Typography>
                </div>
                <div className="mt-2 h-px bg-gradient-to-r from-[#C89F77]/40 to-transparent" />
              </div>
            )}

            {/* Pages */}
            <ul className="space-y-1">
              {pages.map(({ icon, name, path, badge }) => (
                <li key={name}>
                  <NavLink to={`/${layout}${path}`}>
                    {({ isActive }) => (
                      <button
                        className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] shadow-lg shadow-[#8B5E3C]/30"
                            : "hover:bg-[#faf6f1] border border-transparent hover:border-[#C89F77]/20"
                        }`}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white/80 rounded-r-full" />
                        )}

                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? "bg-white/20"
                              : "bg-[#f5ede3] group-hover:bg-[#8B5E3C]"
                          }`}
                        >
                          <span
                            className={`transition-colors duration-300 ${
                              isActive
                                ? "text-white"
                                : "text-[#8B5E3C] group-hover:text-white"
                            }`}
                          >
                            {icon}
                          </span>
                        </div>

                        {/* Label */}
                        <Typography
                          className={`flex-1 text-left text-sm font-bold transition-colors duration-300 truncate ${
                            isActive
                              ? "text-white"
                              : "text-[#4e342e] group-hover:text-[#8B5E3C]"
                          }`}
                        >
                          {name}
                        </Typography>

                        {/* Badge hoặc Arrow */}
                        {badge ? (
                          <div className="relative flex-shrink-0">{badge}</div>
                        ) : (
                          !isActive && (
                            <svg
                              className="w-3.5 h-3.5 text-[#C89F77] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0 transform"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          )
                        )}
                      </button>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ============ FOOTER - USER INFO + LOGOUT ============ */}
      <div className="flex-shrink-0 p-3 border-t border-[#C89F77]/20 bg-gradient-to-br from-[#f5ede3]/50 to-[#faf6f1]/50">
        {/* User Info */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#C89F77]/20 mb-2 shadow-sm">
          <div className="relative flex-shrink-0">
            <Avatar
              src={userInfo?.avatar || "/img/bruce-mars.jpeg"}
              alt={userInfo?.fullName || "Staff"}
              size="sm"
              className="border-2 border-white ring-2 ring-[#C89F77]/30"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <Typography className="text-xs font-extrabold text-[#4e342e] truncate">
              {userInfo?.fullName || "Nhân viên"}
            </Typography>
            <Typography className="text-[10px] font-semibold text-[#8B5E3C] truncate">
              @{userInfo?.username || "staff"}
            </Typography>
          </div>
          <Tooltip content="Hồ sơ" placement="top">
            <button
              onClick={() => navigate("/dashboard/profile")}
              className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#faf6f1] hover:bg-[#8B5E3C] text-[#6d4c41] hover:text-white transition-all duration-200"
            >
              <UserCircleIcon className="w-4 h-4" strokeWidth={2.2} />
            </button>
          </Tooltip>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-500 hover:to-rose-600 text-red-600 hover:text-white border border-red-200 hover:border-red-500 transition-all duration-300 group shadow-sm hover:shadow-lg hover:shadow-red-500/30"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" strokeWidth={2.5} />
          <span className="text-xs font-extrabold uppercase tracking-wider">
            Đăng xuất
          </span>
        </button>

        {/* Version */}
        <div className="mt-2 flex items-center justify-center gap-1.5">
          <SparklesIcon className="w-3 h-3 text-[#C89F77]" />
          <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            v2.5.1
          </Typography>
          <SparklesIcon className="w-3 h-3 text-[#C89F77]" />
        </div>
      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/favicon.png",
  brandName: "NHÂN VIÊN COFFEE",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidenav.jsx";

export default Sidenav;