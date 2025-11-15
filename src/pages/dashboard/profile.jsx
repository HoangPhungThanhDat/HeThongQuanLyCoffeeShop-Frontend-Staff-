import {
  Card,
  Avatar,
  Typography,
  Button,
  Tooltip,
  Switch,
  Progress,
} from "@material-tailwind/react";
import { motion } from "framer-motion";
import {
  Cog6ToothIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/solid";
import { FaCoffee, FaUsers, FaChartPie } from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
} from "recharts";

export function Profile() {
  const revenueData = [
    { month: "Th1", value: 120 },
    { month: "Th2", value: 160 },
    { month: "Th3", value: 200 },
    { month: "Th4", value: 180 },
    { month: "Th5", value: 240 },
    { month: "Th6", value: 260 },
  ];

  return (
    <motion.div
      className="relative min-h-screen bg-gradient-to-br from-[#3e2723] via-[#4e342e] to-[#2c1810] text-white overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Nền mờ nhẹ thay vì animation liên tục */}
      <div className="absolute inset-0 bg-[url('/img/coffee-bg.jpg')] bg-cover bg-center opacity-20 z-0"></div>
      <div className="absolute top-0 left-0 right-0 h-40 bg-[url('/img/steam.gif')] bg-repeat-x opacity-30 blur-[1px] z-0"></div>

      {/* Header */}
      <div className="relative flex flex-col items-center justify-center h-72 z-10">
        <Typography
          variant="h3"
          className="font-extrabold text-amber-400 drop-shadow-lg"
        >
          Hồ sơ Quản trị viên Coffee Shop
        </Typography>
        <Typography variant="small" className="text-gray-200 mt-2 tracking-wide">
          Theo dõi – Quản lý – Phát triển hệ thống
        </Typography>
      </div>

      {/* Thông tin cá nhân */}
      <div className="container mx-auto -mt-20 mb-12 px-4 relative z-10">
        <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <Avatar
              src="/img/admin-avatar.jpg"
              alt="Admin"
              size="xxl"
              variant="rounded"
              className="shadow-2xl ring-4 ring-amber-500/50"
            />
            <div className="text-center lg:text-left max-w-xl">
              <Typography variant="h4" className="font-bold text-amber-300">
                Hoàng Phùng Thành Đạt{" "}
                <span className="text-sm text-green-400 ml-2">(Đang hoạt động)</span>
              </Typography>
              <Typography className="text-gray-200 italic mb-2">
                Quản lý chuỗi cửa hàng & Điều hành hệ thống
              </Typography>
              <Typography className="text-gray-300 text-sm leading-relaxed">
                “Mục tiêu của tôi là biến mỗi tách cà phê thành một trải nghiệm đáng nhớ.”
              </Typography>

              <div className="flex gap-5 justify-center lg:justify-start mt-4">
                <Tooltip content="Gửi email">
                  <EnvelopeIcon className="h-6 w-6 text-amber-400 cursor-pointer hover:text-white transition" />
                </Tooltip>
                <Tooltip content="Gọi ngay">
                  <PhoneIcon className="h-6 w-6 text-amber-400 cursor-pointer hover:text-white transition" />
                </Tooltip>
                <Tooltip content="Cài đặt">
                  <Cog6ToothIcon className="h-6 w-6 text-amber-400 cursor-pointer hover:text-white transition" />
                </Tooltip>
                <Tooltip content="Coffee Time ☕">
                  <FaCoffee className="h-6 w-6 text-amber-400 cursor-pointer hover:text-white transition" />
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Thống kê nhanh */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {[
              { label: "Doanh thu tháng", value: "185,000,000₫" },
              { label: "Đơn hàng hôm nay", value: "128" },
              { label: "Khách hàng trung thành", value: "542" },
              { label: "Đánh giá trung bình", value: "4.8⭐" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/10 border border-white/10 rounded-xl p-4 text-center shadow-md hover:shadow-amber-400/30 transition"
              >
                <Typography variant="h6" className="text-amber-300">
                  {stat.label}
                </Typography>
                <Typography
                  variant="h4"
                  className="font-bold text-white mt-2 drop-shadow"
                >
                  {stat.value}
                </Typography>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Biểu đồ & Mục tiêu */}
      <div className="container mx-auto px-6 grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12 relative z-10">
        {/* Biểu đồ doanh thu */}
        <Card className="bg-white/10 p-6 border border-white/10 backdrop-blur-sm hover:shadow-amber-400/20 transition">
          <Typography variant="h5" className="text-amber-300 mb-3 flex items-center gap-2">
            <ChartBarIcon className="h-5 w-5 text-amber-400" /> Biểu đồ doanh thu 6 tháng
          </Typography>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <XAxis dataKey="month" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <ReTooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#fbbf24"
                  strokeWidth={3}
                  dot={{ r: 5, stroke: "#fff", fill: "#fbbf24" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Mục tiêu */}
        <Card className="bg-white/10 p-6 border border-white/10 backdrop-blur-sm hover:shadow-amber-400/20 transition">
          <Typography variant="h5" className="text-amber-300 mb-3 flex items-center gap-2">
            <ArrowTrendingUpIcon className="h-5 w-5 text-amber-400" /> Mục tiêu kinh doanh
          </Typography>
          <div className="space-y-4 text-gray-200">
            {[
              { goal: "Mở thêm 2 chi nhánh mới", progress: 60 },
              { goal: "Tăng 30% đơn hàng trực tuyến", progress: 45 },
              { goal: "Đạt 4.9/5 đánh giá khách hàng", progress: 75 },
              { goal: "Doanh thu 300 triệu/tháng", progress: 50 },
            ].map((item, i) => (
              <div key={i}>
                <Typography>🎯 {item.goal}</Typography>
                <Progress value={item.progress} color="amber" className="mt-1" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Feedback & Hệ thống */}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-24">
        <Card className="bg-white/10 p-6 border border-white/10 shadow-md">
          <Typography variant="h5" className="text-amber-300 mb-3 flex items-center gap-2">
            <FaUsers /> Phản hồi khách hàng
          </Typography>
          <ul className="text-gray-100 text-sm space-y-3">
            <li>⭐ “Cà phê Latte đậm vị, phục vụ tuyệt vời!” – Lan Anh</li>
            <li>⭐ “Không gian yên tĩnh, rất thích hợp làm việc.” – Nam Nguyễn</li>
            <li>⭐ “Mùi cà phê rang rất đặc trưng, tôi sẽ quay lại.” – Minh Hoàng</li>
          </ul>
        </Card>

        <Card className="bg-white/10 p-6 border border-white/10 shadow-md">
          <Typography variant="h5" className="text-amber-300 mb-3">
            Cài đặt hệ thống
          </Typography>
          <div className="flex flex-col gap-4 text-gray-200">
            <Switch label="Bật chế độ tối" />
            <Switch label="Thông báo đơn hàng mới" defaultChecked />
            <Switch label="Tự động sao lưu dữ liệu" />
            <Switch label="Báo cáo doanh thu hàng tuần" />
          </div>
        </Card>

        <Card className="bg-white/10 p-6 border border-white/10 shadow-md">
          <Typography variant="h5" className="text-amber-300 mb-3 flex items-center gap-2">
            <FaChartPie /> Thông tin hệ thống
          </Typography>
          <Typography className="text-gray-100 text-sm leading-relaxed">
            <b>Phiên bản hệ thống:</b> 2.5.1<br />
            <b>Server:</b> AWS Cloud (VN-South)<br />
            <b>CSDL:</b> PostgreSQL 14<br />
            <b>API:</b> Spring Boot v3.3<br />
            <b>Frontend:</b> React + Tailwind + Material UI<br />
          </Typography>
        </Card>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-300 text-sm py-6 bg-black/30 border-t border-white/10">
        © 2025 Coffee Shop Admin | Thiết kế bởi{" "}
        <span className="text-amber-400 font-semibold">Đạt Hoàng</span>
      </footer>
    </motion.div>
  );
}

export default Profile;
