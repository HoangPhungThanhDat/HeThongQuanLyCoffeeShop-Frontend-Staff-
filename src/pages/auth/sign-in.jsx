import React, { useState, useEffect } from "react";
import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserCircleIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  SparklesIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  BriefcaseIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { FaCoffee } from "react-icons/fa";
import AuthAPI from "@/api/AuthAPI";
import { clearAccessToken } from "@/api/axiosClient";
import Swal from "sweetalert2";

export function SignIn() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
    // Load saved username
    const savedUsername = localStorage.getItem("staff_saved_username");
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  // ==================== HANDLE LOGIN ====================
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await AuthAPI.login({
        username: username,
        password: password,
      });

      const data = response.data;
      const roles = data.roles || [];

      // ✅ Chỉ cho phép ADMIN hoặc EMPLOYEE
      const allowedRoles = ["ADMIN", "EMPLOYEE"];
      const hasPermission = roles.some((r) => allowedRoles.includes(r));

      if (!hasPermission) {
        await Swal.fire({
          icon: "error",
          title: "🚫 Truy cập bị từ chối!",
          text: "Chỉ ADMIN hoặc EMPLOYEE mới được phép đăng nhập vào hệ thống.",
          confirmButtonColor: "#8B5E3C",
          background: "#fffaf5",
          color: "#3e2723",
          customClass: {
            popup: "rounded-2xl",
            confirmButton: "rounded-xl font-bold",
          },
        });
        clearAccessToken();
        setLoading(false);
        return;
      }

      // ✅ Lưu user info (KHÔNG lưu token vào localStorage)
      localStorage.setItem("staff_user", JSON.stringify(data));

      // Save username nếu remember me
      if (rememberMe) {
        localStorage.setItem("staff_saved_username", username);
      } else {
        localStorage.removeItem("staff_saved_username");
      }

      // Success toast
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Đăng nhập thành công!",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      setTimeout(() => {
        navigate("/dashboard/home");
      }, 500);
    } catch (err) {
      console.error("Login error:", err);

      // ✅ Xử lý lỗi 403 từ backend (sai role)
      const status = err.response?.status;
      const errorMsg = err.response?.data?.error;

      if (status === 403) {
        setError(errorMsg || "Bạn không có quyền truy cập!");
        await Swal.fire({
          icon: "error",
          title: "🚫 Truy cập bị từ chối!",
          text: errorMsg || "Chỉ ADMIN hoặc EMPLOYEE mới được phép đăng nhập.",
          confirmButtonColor: "#8B5E3C",
          background: "#fffaf5",
          color: "#3e2723",
          customClass: {
            popup: "rounded-2xl",
            confirmButton: "rounded-xl font-bold",
          },
        });
        clearAccessToken();
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không đúng!");
        await Swal.fire({
          icon: "error",
          title: "Sai thông tin đăng nhập!",
          text: "Vui lòng kiểm tra lại tên đăng nhập hoặc mật khẩu.",
          confirmButtonColor: "#8B5E3C",
          background: "#fffaf5",
          color: "#3e2723",
          customClass: {
            popup: "rounded-2xl",
            confirmButton: "rounded-xl font-bold",
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1e1b17] via-[#2c2623] to-[#3a2f2b] overflow-hidden">
      {/* ===== BACKGROUND DECORATIONS ===== */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-500/20 via-orange-400/10 to-transparent blur-3xl"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#C89F77]/20 to-transparent blur-3xl"
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ===== MAIN CARD ===== */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: fadeIn ? 1 : 0, y: fadeIn ? 0 : 40 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex w-full max-w-6xl mx-4 lg:mx-8 h-auto lg:h-[600px] bg-white/5 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      >
        {/* ============ LEFT: VIDEO ============ */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover brightness-[0.6]"
          >
            <source src="/img/Download.mp4" type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>

          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b17] via-[#1e1b17]/40 to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute top-6 left-6"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center text-[10px]">
                ☕
              </div>
              <span className="text-[10px] font-extrabold text-white uppercase tracking-widest">
                Staff Portal
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="absolute bottom-0 left-0 right-0 p-8"
          >
            <Typography
              variant="h3"
              className="font-extrabold text-white mb-3 drop-shadow-lg leading-tight"
            >
              Chào mừng trở lại
              <br />
              <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 bg-clip-text text-transparent">
                Nhân viên Coffee Shop
              </span>
            </Typography>
            <Typography className="text-sm text-white/70 leading-relaxed mb-5">
              "Mỗi tách cà phê là một cơ hội để làm khách hàng hài lòng."
            </Typography>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <RocketLaunchIcon className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] font-bold text-white/90">
                  Nhanh chóng
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <ShieldCheckIcon className="w-3 h-3 text-green-400" />
                <span className="text-[10px] font-bold text-white/90">
                  Bảo mật
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <BriefcaseIcon className="w-3 h-3 text-blue-400" />
                <span className="text-[10px] font-bold text-white/90">
                  Chuyên nghiệp
                </span>
              </span>
            </div>
          </motion.div>
        </div>

        {/* ============ RIGHT: FORM ============ */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 lg:py-14 bg-[#fffdf9]/95 backdrop-blur-md relative">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:hidden flex items-center justify-center gap-2 mb-6"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg shadow-[#8B5E3C]/30 text-lg">
              ☕
            </div>
            <Typography className="text-lg font-extrabold text-[#4e342e]">
              Coffee Shop
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-6 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
              <Typography className="text-[10px] font-extrabold uppercase text-[#8B5E3C] tracking-widest">
                Staff Login
              </Typography>
            </div>
            <Typography
              variant="h2"
              className="font-extrabold text-[#3e2723] mb-2 leading-tight"
            >
              Đăng nhập
            </Typography>
            <Typography className="text-sm text-gray-500 leading-relaxed">
              Nhập thông tin để truy cập hệ thống quản lý quán
            </Typography>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                <UserCircleIcon className="w-3.5 h-3.5 text-[#8B5E3C]" />
                Tên đăng nhập
              </label>
              <div className="relative">
                <Input
                  size="lg"
                  placeholder="Nhập tên đăng nhập..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="!border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl !bg-white/80 text-[#3e2723]"
                  labelProps={{ className: "hidden" }}
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                <LockClosedIcon className="w-3.5 h-3.5 text-[#8B5E3C]" />
                Mật khẩu
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  size="lg"
                  placeholder="Nhập mật khẩu..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="!border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl !bg-white/80 text-[#3e2723] !pr-10"
                  labelProps={{ className: "hidden" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B5E3C] transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex items-center justify-between"
            >
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                label={
                  <Typography className="text-xs font-medium text-gray-600">
                    Ghi nhớ đăng nhập
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
                className="hover:before:opacity-0"
              />
              <button
                type="button"
                className="text-xs font-bold text-[#8B5E3C] hover:text-[#6d4c41] hover:underline transition-colors"
              >
                Quên mật khẩu?
              </button>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 p-3 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200"
              >
                <ExclamationCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <Typography className="text-xs font-semibold text-red-700">
                  {error}
                </Typography>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] text-white py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#8B5E3C]/30 transition-all duration-300 normal-case font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    Đăng nhập
                    <ArrowRightIcon className="w-4 h-4" strokeWidth={2.5} />
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="relative my-6"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#fffdf9] px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                hoặc
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <Typography className="text-xs text-gray-500">
              Chưa có tài khoản?{" "}
              <span className="text-[#8B5E3C] font-bold cursor-pointer hover:text-[#6d4c41] hover:underline transition-colors">
                Liên hệ quản lý
              </span>
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-8 flex items-center justify-center gap-3 flex-wrap"
          >
            <div className="flex items-center gap-1.5">
              <ClockIcon className="w-3 h-3 text-[#C89F77]" />
              <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Ca sáng 6h-14h
              </Typography>
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-1.5">
              <CheckBadgeIcon className="w-3 h-3 text-[#C89F77]" />
              <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Coffee Shop Staff
              </Typography>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 100"
          className="w-full h-16 opacity-20"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C360,100 720,20 1080,40 C1260,50 1380,70 1440,80 L1440,100 L0,100 Z"
            fill="#C89F77"
          />
        </svg>
      </div>
    </section>
  );
}

export default SignIn;