import React, { useState, useEffect } from "react";
import { Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import AuthAPI from "@/api/AuthAPI";

export function SignIn() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Hiệu ứng fade-in nhẹ khi mở trang
    setTimeout(() => setFadeIn(true), 150);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await AuthAPI.login({
        username: username,
        password: password,
      });

      const data = response.data;
      const token = data.accessToken;
      const roles = data.roles || [];

      // ✅ Chỉ cho phép ADMIN hoặc EMPLOYEE
      const allowedRoles = ["ADMIN", "EMPLOYEE"];
      const hasPermission = roles.some((r) => allowedRoles.includes(r));

      if (!hasPermission) {
        Swal.fire({
          icon: "error",
          title: "🚫 Truy cập bị từ chối!",
          text: "Chỉ ADMIN hoặc EMPLOYEE mới được phép đăng nhập vào hệ thống.",
          confirmButtonColor: "#6d4c41",
          background: "#fff8e1",
          color: "#3e2723",
        });
        setLoading(false);
        return;
      }

      // ✅ Nếu hợp lệ → lưu token & user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));

    

      navigate("/dashboard/home");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Sai thông tin đăng nhập!",
        text: "Vui lòng kiểm tra lại tên đăng nhập hoặc mật khẩu.",
        confirmButtonColor: "#6d4c41",
        background: "#fff8e1",
        color: "#3e2723",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#3e2723] via-[#4e342e] to-[#6d4c41]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: fadeIn ? 1 : 0, y: fadeIn ? 0 : 40 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex w-full max-w-5xl h-[520px] bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20"
      >
        {/* Video nền bên phải */}
        <div className="hidden lg:block w-2/5 relative">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover brightness-75"
          >
            <source src="/img/Download.mp4" type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
            <Typography variant="h4" color="white" className="font-bold mb-2">
              Coffee Shop ☕
            </Typography>
            <Typography variant="small" color="white" className="opacity-80">
              “Một tách cà phê ngon là khởi đầu cho ngày tuyệt vời.”
            </Typography>
          </div>
        </div>

        {/* Form đăng nhập */}
        <div className="w-full lg:w-3/5 flex flex-col justify-center px-10 py-16 bg-[#fffdf9]/90 backdrop-blur-md">
          <div className="text-center mb-8">
            <Typography variant="h2" className="font-bold text-[#3e2723] mb-2">
              Đăng nhập nhân viên
            </Typography>
            <Typography color="gray" className="text-md font-normal">
              Quản lý cửa hàng cà phê của bạn thật dễ dàng 🌿
            </Typography>
          </div>

          <form onSubmit={handleLogin} className="mx-auto w-full max-w-md space-y-6">
            {/* Tên đăng nhập */}
            <div>
              <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                Tên đăng nhập
              </Typography>
              <Input
                size="lg"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="!border-b-[#795548] focus:!border-b-[#5d4037] text-[#3e2723]"
                labelProps={{ className: "before:content-none after:content-none" }}
                required
              />
            </div>

            {/* Mật khẩu */}
            <div>
              <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                Mật khẩu
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="!border-b-[#795548] focus:!border-b-[#5d4037] text-[#3e2723]"
                labelProps={{ className: "before:content-none after:content-none" }}
                required
              />
            </div>

            {/* Ghi nhớ */}
            <div className="flex items-center justify-between">
              <Checkbox
                label={
                  <Typography variant="small" color="gray" className="flex items-center font-medium">
                    Ghi nhớ đăng nhập
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
              />
              <Typography
                as="a"
                href="#"
                variant="small"
                color="brown"
className="font-medium hover:underline cursor-pointer"
              >
                Quên mật khẩu?
              </Typography>
            </div>

            {/* Nút đăng nhập */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="mt-4 bg-[#5d4037] hover:bg-[#4e342e] transition-all duration-300 text-white text-lg py-2"
                fullWidth
                disabled={loading}
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </motion.div>
          </form>

          {/* Đăng ký */}
          <Typography color="gray" className="text-center text-sm mt-8 font-normal">
            Chưa có tài khoản?{" "}
            <span className="text-[#5d4037] font-semibold cursor-pointer hover:underline">
              Liên hệ quản lý
            </span>
          </Typography>
        </div>
      </motion.div>
    </section>
  );
}

export default SignIn;