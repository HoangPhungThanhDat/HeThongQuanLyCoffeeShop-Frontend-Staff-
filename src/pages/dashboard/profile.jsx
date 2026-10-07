import { useState } from "react";
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Button,
  Tooltip,
  Switch,
} from "@material-tailwind/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cog6ToothIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UserCircleIcon,
  MapPinIcon,
  CalendarDaysIcon,
  BriefcaseIcon,
  PencilSquareIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  SparklesIcon,
  StarIcon,
  UsersIcon,
  ShoppingCartIcon,
  BanknotesIcon,
  FingerPrintIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  TrophyIcon,
  FireIcon,
  GlobeAltIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  HeartIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  PaintBrushIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import { FaCoffee, FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  Cell,
  PolarAngleAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
} from "recharts";

// ==================== MOCK DATA ====================
const REVENUE_DATA = [
  { month: "T1", revenue: 120, orders: 85, customers: 45 },
  { month: "T2", revenue: 160, orders: 110, customers: 62 },
  { month: "T3", revenue: 200, orders: 145, customers: 78 },
  { month: "T4", revenue: 180, orders: 130, customers: 71 },
  { month: "T5", revenue: 240, orders: 175, customers: 95 },
  { month: "T6", revenue: 260, orders: 195, customers: 108 },
];

const SKILLS_DATA = [
  { skill: "Pha chế", value: 92 },
  { skill: "Phục vụ", value: 95 },
  { skill: "Thu ngân", value: 88 },
  { skill: "Order", value: 90 },
  { skill: "Giao tiếp", value: 94 },
  { skill: "Xử lý tình huống", value: 85 },
];

const ACTIVITY_TIMELINE = [
  {
    time: "2 giờ trước",
    title: "Hoàn thành ca sáng",
    description: "Đã phục vụ 45 đơn hàng trong ca",
    icon: CheckBadgeIcon,
    gradient: "from-green-500 to-emerald-600",
  },
  {
    time: "5 giờ trước",
    title: "Hỗ trợ khách hàng VIP",
    description: "Phục vụ bàn 5, khách hàng thân thiết",
    icon: StarIcon,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    time: "1 ngày trước",
    title: "Nhận đơn hàng lớn",
    description: "Xử lý đơn 15 món cho nhóm 8 người",
    icon: ShoppingCartIcon,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    time: "2 ngày trước",
    title: "Được khen ngợi",
    description: "Khách hàng để lại đánh giá 5 sao",
    icon: HeartIcon,
    gradient: "from-pink-500 to-rose-600",
  },
  {
    time: "3 ngày trước",
    title: "Hoàn thành training",
    description: "Khoá đào tạo pha chế nâng cao",
    icon: AcademicCapIcon,
    gradient: "from-purple-500 to-fuchsia-600",
  },
];

const ACHIEVEMENTS = [
  { label: "Nhân viên xuất sắc", year: "2024", icon: TrophyIcon, gradient: "from-amber-500 to-orange-600" },
  { label: "500+ Đơn hàng", year: "2024", icon: ShoppingCartIcon, gradient: "from-blue-500 to-indigo-600" },
  { label: "100+ Đánh giá 5⭐", year: "2025", icon: StarIcon, gradient: "from-green-500 to-emerald-600" },
  { label: "2 Năm kinh nghiệm", year: "2023", icon: FireIcon, gradient: "from-red-500 to-rose-600" },
];

const PIE_COLORS = ["#8B5E3C", "#C89F77", "#a4714b", "#6d4c41"];

export function Profile() {
  // ==================== STATES ====================
  const [activeTab, setActiveTab] = useState("overview");
  const [emailNotif, setEmailNotif] = useState(true);
  const [orderNotif, setOrderNotif] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [soundNotif, setSoundNotif] = useState(true);
  const [theme, setTheme] = useState("light");

  // ==================== STATS ====================
  const stats = [
    {
      label: "Đơn hàng hôm nay",
      value: "128",
      unit: "đơn",
      icon: ShoppingCartIcon,
      gradient: "from-[#8B5E3C] to-[#6d4c41]",
      badge: "+12%",
      progress: 78,
    },
    {
      label: "Doanh thu ca",
      value: "2.5M",
      unit: "VNĐ",
      icon: BanknotesIcon,
      gradient: "from-green-500 to-emerald-600",
      badge: "+8%",
      progress: 92,
    },
    {
      label: "Khách phục vụ",
      value: "45",
      unit: "người",
      icon: UsersIcon,
      gradient: "from-blue-500 to-indigo-600",
      badge: "+24",
      progress: 65,
    },
    {
      label: "Đánh giá TB",
      value: "4.9",
      unit: "/5",
      icon: StarIcon,
      gradient: "from-amber-500 to-orange-600",
      badge: "Tốt",
      progress: 98,
    },
  ];

  const goals = [
    { goal: "Đạt 150 đơn hàng hôm nay", progress: 85 },
    { goal: "Phục vụ 50 khách hàng", progress: 90 },
    { goal: "Đạt 4.9/5 đánh giá", progress: 98 },
    { goal: "Hoàn thành ca không lỗi", progress: 100 },
  ];

  const feedbacks = [
    {
      name: "Lan Anh",
      avatar: "L",
      content: "Cà phê Latte đậm vị, nhân viên phục vụ rất nhiệt tình!",
      rating: 5,
      date: "2 giờ trước",
    },
    {
      name: "Nam Nguyễn",
      avatar: "N",
      content: "Nhân viên dễ thương, order nhanh, không gian yên tĩnh.",
      rating: 5,
      date: "5 giờ trước",
    },
    {
      name: "Minh Hoàng",
      avatar: "M",
      content: "Phục vụ chu đáo, món uống ngon. Sẽ quay lại!",
      rating: 5,
      date: "1 ngày trước",
    },
  ];

  // ==================== TABS ====================
  const tabs = [
    { key: "overview", label: "Tổng quan", icon: ChartBarIcon },
    { key: "activity", label: "Hoạt động", icon: ClockIcon },
    { key: "skills", label: "Kỹ năng", icon: AcademicCapIcon },
    { key: "achievements", label: "Thành tựu", icon: TrophyIcon },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3] py-6 lg:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col gap-6">

        {/* ===== PAGE HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg shadow-[#8B5E3C]/30 flex-shrink-0"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <UserCircleIcon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </motion.div>
            <div>
              <Typography
                variant="h4"
                className="font-extrabold text-[#4e342e] tracking-tight text-2xl lg:text-3xl"
              >
                Hồ Sơ Nhân Viên
              </Typography>
              <Typography className="text-xs lg:text-sm text-[#8B5E3C] font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Quản lý thông tin và cài đặt tài khoản ☕
              </Typography>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <Button
              variant="outlined"
              className="flex items-center justify-center gap-2 border-2 border-[#8B5E3C]/40 text-[#6d4c41] hover:bg-[#faf6f1] hover:border-[#8B5E3C] rounded-xl normal-case font-bold px-4 py-3"
            >
              <ArrowDownTrayIcon className="h-4 w-4" strokeWidth={2.5} />
            </Button>
            <Button
              variant="outlined"
              className="flex items-center justify-center gap-2 border-2 border-[#8B5E3C]/40 text-[#6d4c41] hover:bg-[#faf6f1] hover:border-[#8B5E3C] rounded-xl normal-case font-bold px-4 py-3"
            >
              <ArrowPathIcon className="h-4 w-4" strokeWidth={2.5} />
            </Button>
            <Button className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] shadow-lg shadow-[#8B5E3C]/30 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl normal-case font-bold flex-1 md:flex-none px-6 py-3 text-sm">
              <PencilSquareIcon className="h-4 w-4" strokeWidth={2.5} />
              Chỉnh sửa
            </Button>
          </div>
        </motion.div>

        {/* ===== PROFILE HERO CARD ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="w-full shadow-2xl rounded-3xl border border-amber-100 bg-white overflow-hidden">
            {/* Hero Banner */}
            <div className="relative h-44 lg:h-52 bg-gradient-to-br from-[#4e342e] via-[#6d4c41] to-[#8B5E3C] overflow-hidden">
              {/* Decorations */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-amber-300 blur-3xl" />
              </div>
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Steam particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-0 w-1 rounded-full bg-white/20"
                  style={{ left: `${15 + i * 4}%`, height: 40 + i * 10 }}
                  animate={{ y: [-5, -30, -5], opacity: [0.2, 0.5, 0.2] }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Top left badge */}
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
                  <SparklesIcon className="h-3.5 w-3.5 text-amber-200" />
                  <span className="text-[10px] font-extrabold text-white uppercase tracking-widest">
                    Profile
                  </span>
                </div>
              </div>

              {/* Top right status */}
              <div className="absolute top-4 right-4 flex gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/90 backdrop-blur-md border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-[10px] font-extrabold text-white uppercase tracking-widest">
                    Đang làm việc
                  </span>
                </div>
              </div>
            </div>

            <CardBody className="relative pt-0 pb-6 px-6 lg:px-8">
              {/* Avatar & Info */}
              <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-6 -mt-20 lg:-mt-24">
                {/* Avatar with glow */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-300 to-[#C89F77] blur-2xl opacity-50" />
                  <div className="relative">
                    <Avatar
                      src="/img/bruce-mars.jpeg"
                      alt="Staff"
                      size="xxl"
                      variant="rounded"
                      className="w-32 h-32 lg:w-40 lg:h-40 !rounded-3xl shadow-2xl border-4 border-white ring-4 ring-[#C89F77]/30"
                    />
                    {/* Online dot */}
                    <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-white">
                      <span className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 lg:pb-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] shadow-sm">
                      <CheckBadgeIcon className="w-3.5 h-3.5 text-white" />
                      <span className="text-[10px] font-extrabold text-white uppercase tracking-wider">
                        Nhân viên
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">
                      <StarIcon className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-extrabold text-amber-700">
                        4.9 Rating
                      </span>
                    </span>
                  </div>
                  <Typography
                    variant="h3"
                    className="font-extrabold text-[#4e342e] tracking-tight mb-1.5 text-2xl lg:text-3xl"
                  >
                    Hoàng Phùng Thành Đạt
                  </Typography>
                  <div className="flex items-center gap-1.5 mb-2">
                    <BriefcaseIcon className="w-4 h-4 text-[#8B5E3C]" />
                    <Typography className="text-sm font-semibold text-gray-600">
                      Nhân viên pha chế & phục vụ
                    </Typography>
                  </div>
                  <Typography className="text-sm text-gray-500 italic max-w-lg leading-relaxed">
                    "Mỗi tách cà phê là một cơ hội để làm khách hàng hài lòng."
                  </Typography>

                  {/* Quick info tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#faf6f1] border border-[#C89F77]/30">
                      <MapPinIcon className="w-3.5 h-3.5 text-[#8B5E3C]" />
                      <span className="text-[10px] font-bold text-[#6d4c41]">
                        Ca sáng 6h-14h
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#faf6f1] border border-[#C89F77]/30">
                      <CalendarDaysIcon className="w-3.5 h-3.5 text-[#8B5E3C]" />
                      <span className="text-[10px] font-bold text-[#6d4c41]">
                        Tham gia 2023
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#faf6f1] border border-[#C89F77]/30">
                      <GlobeAltIcon className="w-3.5 h-3.5 text-[#8B5E3C]" />
                      <span className="text-[10px] font-bold text-[#6d4c41]">
                        Tiếng Việt
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-green-700">
                        Đang hoạt động
                      </span>
                    </span>
                  </div>

                  {/* Social links */}
                  <div className="flex gap-2 mt-3">
                    {[
                      { icon: FaFacebook, color: "hover:bg-blue-600" },
                      { icon: FaGithub, color: "hover:bg-gray-800" },
                      { icon: FaLinkedin, color: "hover:bg-blue-700" },
                      { icon: EnvelopeIcon, color: "hover:bg-[#8B5E3C]" },
                    ].map((social, i) => {
                      const Icon = social.icon;
                      return (
                        <button
                          key={i}
                          className={`w-9 h-9 rounded-xl bg-[#faf6f1] hover:text-white text-[#6d4c41] border border-[#C89F77]/30 flex items-center justify-center transition-all duration-200 hover:scale-110 ${social.color}`}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 lg:pb-3">
                  <Tooltip content="Gửi email" placement="top">
                    <button className="w-11 h-11 rounded-xl bg-[#faf6f1] hover:bg-[#8B5E3C] text-[#8B5E3C] hover:text-white border border-[#C89F77]/30 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm">
                      <EnvelopeIcon className="w-5 h-5" strokeWidth={2} />
                    </button>
                  </Tooltip>
                  <Tooltip content="Gọi điện" placement="top">
                    <button className="w-11 h-11 rounded-xl bg-[#faf6f1] hover:bg-[#8B5E3C] text-[#8B5E3C] hover:text-white border border-[#C89F77]/30 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm">
                      <PhoneIcon className="w-5 h-5" strokeWidth={2} />
                    </button>
                  </Tooltip>
                  <Tooltip content="Coffee Time ☕" placement="top">
                    <button className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg shadow-[#8B5E3C]/30">
                      <FaCoffee className="w-5 h-5" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* ===== STATS CARDS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-md hover:shadow-2xl border border-amber-100 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#f5ede3] to-transparent rounded-full -translate-y-12 translate-x-12 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-start justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#faf6f1] border border-[#C89F77]/30">
                    <ArrowTrendingUpIcon className="w-3 h-3 text-[#8B5E3C]" />
                    <Typography className="text-[10px] font-extrabold text-[#8B5E3C]">
                      {stat.badge}
                    </Typography>
                  </div>
                </div>
                <div className="relative">
                  <Typography className="text-[10px] font-extrabold uppercase text-gray-400 tracking-[0.15em] mb-1">
                    {stat.label}
                  </Typography>
                  <div className="flex items-end gap-2">
                    <Typography className="text-3xl font-extrabold text-[#4e342e] leading-none">
                      {stat.value}
                    </Typography>
                    <span className="text-[10px] font-semibold text-gray-400 mb-1">
                      {stat.unit}
                    </span>
                  </div>
                </div>
                <div className="relative mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      Tiến độ
                    </Typography>
                    <Typography className="text-[9px] font-extrabold text-[#8B5E3C]">
                      {stat.progress}%
                    </Typography>
                  </div>
                  <div className="h-1 rounded-full bg-[#faf6f1] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                      className={`h-full rounded-full bg-gradient-to-r ${stat.gradient}`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ===== TABS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-white border border-amber-100 shadow-sm"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] text-white shadow-lg shadow-[#8B5E3C]/30"
                    : "bg-[#faf6f1] text-[#6d4c41] border border-[#C89F77]/30 hover:border-[#8B5E3C]"
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={2.5} />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* ===== TAB CONTENT ===== */}
        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-6"
            >
              {/* Revenue Chart */}
              <Card className="xl:col-span-2 shadow-2xl rounded-3xl border border-amber-100 bg-white overflow-hidden">
                <div className="p-6 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg">
                      <ChartBarIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Typography className="font-bold text-[#4e342e] tracking-wide">
                        Hiệu suất 6 tháng
                      </Typography>
                      <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                        Doanh thu / Đơn hàng / Khách hàng
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={REVENUE_DATA}>
                        <defs>
                          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5E3C" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8B5E3C" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5ede3" vertical={false} />
                        <XAxis
                          dataKey="month"
                          stroke="#a4714b"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#a4714b"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                        />
                        <ReTooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #C89F77",
                            borderRadius: "12px",
                            fontSize: "12px",
                            boxShadow: "0 4px 12px rgba(139, 94, 60, 0.15)",
                          }}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: "11px", color: "#6d4c41" }}
                          iconType="circle"
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          name="Doanh thu"
                          stroke="#8B5E3C"
                          strokeWidth={3}
                          fill="url(#revGrad)"
                        />
                        <Area
                          type="monotone"
                          dataKey="orders"
                          name="Đơn hàng"
                          stroke="#3b82f6"
                          strokeWidth={2.5}
                          fill="url(#ordGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>

              {/* Goals */}
              <Card className="shadow-2xl rounded-3xl border border-amber-100 bg-white overflow-hidden">
                <div className="p-6 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <ArrowTrendingUpIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Typography className="font-bold text-[#4e342e] tracking-wide">
                        Mục tiêu ca làm
                      </Typography>
                      <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                        Tiến độ hoàn thành
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  {goals.map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🎯</span>
                          <Typography className="text-xs font-bold text-[#4e342e]">
                            {item.goal}
                          </Typography>
                        </div>
                        <Typography
                          className={`text-xs font-extrabold ${
                            item.progress >= 75
                              ? "text-green-600"
                              : item.progress >= 50
                              ? "text-[#8B5E3C]"
                              : "text-orange-600"
                          }`}
                        >
                          {item.progress}%
                        </Typography>
                      </div>
                      <div className="relative h-2 rounded-full bg-[#faf6f1] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                          className={`h-full rounded-full ${
                            item.progress >= 75
                              ? "bg-gradient-to-r from-green-400 to-emerald-500"
                              : item.progress >= 50
                              ? "bg-gradient-to-r from-[#8B5E3C] to-[#C89F77]"
                              : "bg-gradient-to-r from-orange-400 to-amber-500"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === "activity" && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-2xl rounded-3xl border border-amber-100 bg-white overflow-hidden">
                <div className="p-6 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <ClockIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Typography className="font-bold text-[#4e342e] tracking-wide">
                        Hoạt động gần đây
                      </Typography>
                      <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                        Timeline hoạt động của bạn
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="p-6 lg:p-8">
                  <div className="relative">
                    <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#8B5E3C] via-[#C89F77] to-amber-100" />

                    <div className="space-y-6">
                      {ACTIVITY_TIMELINE.map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + i * 0.08 }}
                            className="relative flex items-start gap-4"
                          >
                            <div
                              className={`relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg flex-shrink-0 border-4 border-white`}
                            >
                              <Icon className="w-6 h-6 text-white" strokeWidth={2.2} />
                            </div>

                            <div className="flex-1 min-w-0 p-4 rounded-2xl bg-[#faf6f1] border border-amber-100 hover:border-[#C89F77]/40 hover:shadow-md transition-all duration-200">
                              <div className="flex items-start justify-between gap-3 mb-1">
                                <Typography className="text-sm font-extrabold text-[#4e342e]">
                                  {item.title}
                                </Typography>
                                <span className="text-[10px] font-bold text-[#8B5E3C] bg-white px-2 py-0.5 rounded-full border border-[#C89F77]/30 whitespace-nowrap">
                                  {item.time}
                                </span>
                              </div>
                              <Typography className="text-xs text-gray-600">
                                {item.description}
                              </Typography>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* SKILLS TAB */}
          {activeTab === "skills" && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 xl:grid-cols-2 gap-6"
            >
              {/* Skill Bars */}
              <Card className="shadow-2xl rounded-3xl border border-amber-100 bg-white overflow-hidden">
                <div className="p-6 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
                      <AcademicCapIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Typography className="font-bold text-[#4e342e] tracking-wide">
                        Kỹ năng nghiệp vụ
                      </Typography>
                      <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                        Mức độ thành thạo
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {SKILLS_DATA.map((skill, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <Typography className="text-xs font-bold text-[#4e342e]">
                          {skill.skill}
                        </Typography>
                        <Typography className="text-xs font-extrabold text-[#8B5E3C]">
                          {skill.value}%
                        </Typography>
                      </div>
                      <div className="h-2 rounded-full bg-[#faf6f1] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.value}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + i * 0.08 }}
                          className="h-full rounded-full bg-gradient-to-r from-[#8B5E3C] via-[#C89F77] to-[#a4714b]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Radar Skills */}
              <Card className="shadow-2xl rounded-3xl border border-amber-100 bg-white overflow-hidden">
                <div className="p-6 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <FingerPrintIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Typography className="font-bold text-[#4e342e] tracking-wide">
                        Biểu đồ kỹ năng
                      </Typography>
                      <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                        Tổng quan năng lực
                      </Typography>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        data={SKILLS_DATA}
                        innerRadius="20%"
                        outerRadius="100%"
                        startAngle={90}
                        endAngle={-270}
                      >
                        <PolarAngleAxis
                          type="number"
                          domain={[0, 100]}
                          angleAxisId={0}
                          tick={false}
                        />
                        <RadialBar
                          background={{ fill: "#faf6f1" }}
                          dataKey="value"
                          cornerRadius={8}
                        >
                          {SKILLS_DATA.map((_, i) => (
                            <Cell
                              key={i}
                              fill={PIE_COLORS[i % PIE_COLORS.length]}
                            />
                          ))}
                        </RadialBar>
                        <ReTooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #C89F77",
                            borderRadius: "12px",
                            fontSize: "12px",
                          }}
                          formatter={(v, n, p) => [`${v}%`, p.payload.skill]}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === "achievements" && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {ACHIEVEMENTS.map((ach, i) => {
                const Icon = ach.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-md hover:shadow-2xl border border-amber-100 transition-all duration-300 text-center"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#f5ede3] to-transparent rounded-full -translate-y-12 translate-x-12 opacity-60" />
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${ach.gradient} flex items-center justify-center shadow-lg mb-3 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                      </div>
                      <Typography className="text-sm font-extrabold text-[#4e342e] mb-1">
                        {ach.label}
                      </Typography>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#faf6f1] border border-[#C89F77]/30">
                        <CalendarDaysIcon className="w-3 h-3 text-[#8B5E3C]" />
                        <span className="text-[10px] font-bold text-[#6d4c41]">
                          {ach.year}
                        </span>
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== FEEDBACK + SETTINGS + SYSTEM ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {/* Feedback */}
          <Card className="shadow-2xl rounded-3xl border border-amber-100 bg-white overflow-hidden">
            <div className="p-6 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Typography className="font-bold text-[#4e342e] tracking-wide">
                    Phản hồi khách hàng
                  </Typography>
                  <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                    Đánh giá gần đây
                  </Typography>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {feedbacks.map((fb, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex gap-3 p-3 rounded-xl bg-[#faf6f1] border border-amber-100 hover:border-[#C89F77]/30 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center text-white text-sm font-extrabold shadow-md">
                    {fb.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <Typography className="text-xs font-bold text-[#4e342e]">
                        {fb.name}
                      </Typography>
                      <span className="text-[9px] text-gray-400 font-medium">
                        {fb.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 mb-1">
                      {[...Array(fb.rating)].map((_, j) => (
                        <StarIcon
                          key={j}
                          className="w-3 h-3 text-amber-500 fill-amber-500"
                        />
                      ))}
                    </div>
                    <Typography className="text-[11px] text-gray-600 leading-snug">
                      "{fb.content}"
                    </Typography>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Settings */}
          <Card className="shadow-2xl rounded-3xl border border-amber-100 bg-white overflow-hidden">
            <div className="p-6 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg">
                  <Cog6ToothIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Typography className="font-bold text-[#4e342e] tracking-wide">
                    Cài đặt hệ thống
                  </Typography>
                  <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                    Tùy chỉnh thông báo
                  </Typography>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {[
                {
                  icon: EnvelopeIcon,
                  label: "Thông báo Email",
                  value: emailNotif,
                  setter: setEmailNotif,
                },
                {
                  icon: ShoppingCartIcon,
                  label: "Đơn hàng mới",
                  value: orderNotif,
                  setter: setOrderNotif,
                },
                {
                  icon: DocumentTextIcon,
                  label: "Báo cáo ca",
                  value: weeklyReport,
                  setter: setWeeklyReport,
                },
                {
                  icon: BellIcon,
                  label: "Âm thanh thông báo",
                  value: soundNotif,
                  setter: setSoundNotif,
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#faf6f1] border border-amber-100 hover:border-[#C89F77]/30 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#8B5E3C]" />
                      <Typography className="text-xs font-bold text-[#4e342e]">
                        {item.label}
                      </Typography>
                    </div>
                    <Switch
                      checked={item.value}
                      onChange={() => item.setter(!item.value)}
                      className="checked:bg-[#8B5E3C]"
                    />
                  </div>
                );
              })}

              {/* Theme selector */}
              <div className="p-3 rounded-xl bg-[#faf6f1] border border-amber-100">
                <Typography className="text-xs font-bold text-[#4e342e] mb-2">
                  Giao diện
                </Typography>
                <div className="flex gap-2">
                  {[
                    { value: "light", label: "Sáng", icon: SunIcon },
                    { value: "dark", label: "Tối", icon: MoonIcon },
                    { value: "system", label: "Hệ thống", icon: ComputerDesktopIcon },
                  ].map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setTheme(opt.value)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                          theme === opt.value
                            ? "bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] text-white shadow-md"
                            : "bg-white text-[#6d4c41] border border-[#C89F77]/30"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* System Info */}
          <Card className="shadow-2xl rounded-3xl border border-amber-100 bg-white overflow-hidden md:col-span-2 xl:col-span-1">
            <div className="p-6 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
                  <ShieldCheckIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Typography className="font-bold text-[#4e342e] tracking-wide">
                    Thông tin hệ thống
                  </Typography>
                  <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                    Phiên bản & cấu hình
                  </Typography>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {[
                { label: "Phiên bản", value: "2.5.1", icon: "🏷️" },
                { label: "Server", value: "AWS Cloud (VN)", icon: "☁️" },
                { label: "CSDL", value: "PostgreSQL 14", icon: "🗄️" },
                { label: "Backend", value: "Spring Boot v3.3", icon: "⚙️" },
                { label: "Frontend", value: "React + Tailwind", icon: "⚛️" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#faf6f1] border border-amber-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.icon}</span>
                    <Typography className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      {item.label}
                    </Typography>
                  </div>
                  <Typography className="text-xs font-extrabold text-[#4e342e]">
                    {item.value}
                  </Typography>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* ===== INFO NOTE ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
        >
          <InformationCircleIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
          <Typography className="text-xs text-[#6d4c41] leading-relaxed">
            <span className="font-bold">Ghi chú:</span> Đây là trang hồ sơ cá
            nhân của nhân viên. Bạn có thể xem thông tin, hoạt động gần đây, kỹ
            năng nghiệp vụ và thành tựu đạt được. Các cài đặt thông báo sẽ được
            lưu tự động.
          </Typography>
        </motion.div>

        {/* ===== FOOTER ===== */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-amber-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center text-xs">
              ☕
            </div>
            <Typography className="text-xs text-[#6d4c41] font-bold">
              Coffee Shop Staff © 2025
            </Typography>
          </div>
          <Typography className="text-[10px] text-gray-400 font-medium">
            Thiết kế với ❤️ bởi{" "}
            <span className="text-[#8B5E3C] font-bold">Đạt Hoàng</span>
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default Profile;