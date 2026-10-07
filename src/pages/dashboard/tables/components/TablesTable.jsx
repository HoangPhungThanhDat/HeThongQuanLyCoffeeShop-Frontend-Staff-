import {
  Typography,
  Tooltip,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  EyeIcon,
  UsersIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export function TablesTable({ tables, onShow, onStatusChange }) {
  // ==================== STATUS CONFIG - TÔNG CAFE ====================
  const getStatusConfig = (status) => {
    switch (status) {
      case "FREE":
        return {
          label: "Trống",
          sublabel: "Sẵn sàng",
          emoji: "☕",
          gradient: "from-[#C89F77] via-[#B8895E] to-[#a4714b]",
          light: "from-[#faf6f1] to-[#f5ede3]",
          border: "border-[#C89F77]/50",
          text: "text-[#6d4c41]",
          dot: "bg-[#C89F77]",
          wood: "from-[#8B5E3C] via-[#a4714b] to-[#C89F77]",
          shadow: "shadow-[#C89F77]/30",
        };
      case "OCCUPIED":
        return {
          label: "Đang dùng",
          sublabel: "Có khách",
          emoji: "🫖",
          gradient: "from-[#4e342e] via-[#5d3a2f] to-[#6d4c41]",
          light: "from-[#f5ede3] to-[#e8d9c7]",
          border: "border-[#8B5E3C]/60",
          text: "text-[#4e342e]",
          dot: "bg-[#4e342e]",
          wood: "from-[#3a2620] via-[#4e342e] to-[#6d4c41]",
          shadow: "shadow-[#4e342e]/30",
        };
      case "RESERVED":
        return {
          label: "Đã đặt",
          sublabel: "Đặt trước",
          emoji: "🕰️",
          gradient: "from-[#D4A574] via-[#c99862] to-[#b8895e]",
          light: "from-[#faf0e0] to-[#f5e6cc]",
          border: "border-[#D4A574]/60",
          text: "text-[#8B5E3C]",
          dot: "bg-[#D4A574]",
          wood: "from-[#C89F77] via-[#D4A574] to-[#c99862]",
          shadow: "shadow-[#D4A574]/30",
        };
      default:
        return getStatusConfig("FREE");
    }
  };

  const statusOptions = [
    { value: "FREE", label: "Trống", icon: "☕", color: "text-[#6d4c41]" },
    { value: "OCCUPIED", label: "Đang dùng", icon: "🫖", color: "text-[#4e342e]" },
    { value: "RESERVED", label: "Đã đặt", icon: "🕰️", color: "text-[#8B5E3C]" },
  ];

  // ====== EMPTY STATE ======
  if (tables.length === 0) {
    return (
      <div className="p-12 lg:p-16 text-center bg-gradient-to-br from-[#faf6f1] to-[#fffaf5]">
        <div className="flex flex-col items-center justify-center">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center mb-4 shadow-xl shadow-[#8B5E3C]/30">
            <span className="text-6xl">☕</span>
          </div>
          <Typography className="text-base text-[#4e342e] font-bold mb-1">
            Chưa có bàn nào
          </Typography>
          <Typography className="text-xs text-[#8B5E3C]/70">
            Vui lòng liên hệ quản trị viên để thêm bàn
          </Typography>
        </div>
      </div>
    );
  }

  // ====== SƠ ĐỒ BÀN ======
  return (
    <div className="p-4 lg:p-6 2xl:p-8 bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3]">
      {/* ====== FLOOR - SÀN QUÁN CAFE ====== */}
      <div
        className="relative rounded-3xl border-2 border-dashed border-[#8B5E3C]/30 p-6 lg:p-8 2xl:p-10 overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(200, 159, 119, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(139, 94, 60, 0.06) 0%, transparent 40%),
            linear-gradient(135deg, #faf6f1 0%, #fffaf5 100%)
          `,
        }}
      >
        {/* Coffee bean pattern */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%238B5E3C'%3E%3Cpath d='M30 5c-3 0-5 3-5 6 0 4 3 8 5 8s5-4 5-8c0-3-2-6-5-6zm-2 3c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2zm2 2c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Steam effect top */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-8 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.span
              key={i}
              className="text-2xl opacity-[0.08]"
              animate={{ y: [0, -10, 0], opacity: [0.08, 0.15, 0.08] }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            >
              ☕
            </motion.span>
          ))}
        </div>

        {/* Floor label */}
        <div className="absolute -top-3 left-6 bg-white border-2 border-[#8B5E3C]/40 rounded-full px-4 py-1.5 shadow-sm flex items-center gap-2 z-10">
          <div className="w-2 h-2 rounded-full bg-[#8B5E3C] animate-pulse" />
          <Typography className="text-[10px] font-extrabold text-[#4e342e] uppercase tracking-widest">
            ☕ Khu vực phục vụ
          </Typography>
        </div>

        {/* Tables Grid */}
        <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 lg:gap-5 2xl:gap-6">
          {tables.map((table, index) => {
            const config = getStatusConfig(table.status);

            return (
              <motion.div
                key={table.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.04, duration: 0.35 }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="group relative"
              >
                {/* ====== TABLE CARD ====== */}
                <div
                  className={`relative aspect-square rounded-2xl border-2 ${config.border} bg-white shadow-lg hover:shadow-2xl ${config.shadow} transition-all duration-300 overflow-hidden`}
                >
                  {/* Wood top gradient bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${config.gradient}`}
                  />

                  {/* Steam animation (chỉ khi OCCUPIED) */}
                  {table.status === "OCCUPIED" && (
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 flex gap-0.5 pointer-events-none">
                      {[...Array(2)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-0.5 h-3 rounded-full bg-[#8B5E3C]/30"
                          animate={{
                            y: [0, -6, 0],
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.5,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Status pulse dot */}
                  <div className="absolute top-3 right-3">
                    <span className="relative flex h-2.5 w-2.5">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.dot} opacity-60`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.dot}`}
                      />
                    </span>
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                    {/* Wood plate circle */}
                    <div
                      className={`w-14 h-14 2xl:w-16 2xl:h-16 rounded-full bg-gradient-to-br ${config.wood} flex items-center justify-center shadow-lg mb-2 group-hover:scale-110 transition-transform duration-300 border-2 border-white/30 relative`}
                    >
                      <div className="absolute inset-1 rounded-full border border-white/20" />
                      <span className="text-2xl 2xl:text-3xl drop-shadow-md">
                        {config.emoji}
                      </span>
                    </div>

                    {/* Table number */}
                    <Typography className="text-lg 2xl:text-xl font-extrabold text-[#4e342e] leading-none tracking-tight">
                      {table.number}
                    </Typography>

                    {/* Capacity */}
                    <div className="flex items-center gap-1 mt-1.5 bg-[#faf6f1] px-2 py-0.5 rounded-full border border-[#C89F77]/30">
                      <UsersIcon className="w-2.5 h-2.5 text-[#8B5E3C]" />
                      <Typography className="text-[9px] font-bold text-[#6d4c41]">
                        {table.capacity} chỗ
                      </Typography>
                    </div>
                  </div>

                  {/* Status badge bottom */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r ${config.light} border-t ${config.border} py-1.5 px-2`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
                      />
                      <Typography
                        className={`text-[9px] 2xl:text-[10px] font-extrabold ${config.text} uppercase tracking-wider`}
                      >
                        {config.label}
                      </Typography>
                    </div>
                  </div>

                  {/* Coffee stain decoration */}
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-[#8B5E3C]/5 blur-sm pointer-events-none" />
                </div>

                {/* ====== HOVER ACTIONS ====== */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto z-20">
                  <div className="flex gap-1 bg-white rounded-xl shadow-xl border border-[#C89F77]/30 p-1">
                    {/* Đổi trạng thái - Menu dropdown */}
                    <Menu placement="bottom">
                      <MenuHandler>
                        <button
                          className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#faf6f1] hover:bg-[#C89F77] text-[#8B5E3C] hover:text-white transition-all duration-200"
                          title="Đổi trạng thái"
                        >
                          <ChevronDownIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </button>
                      </MenuHandler>
                      <MenuList className="p-2 shadow-xl border-[#C89F77]/30 rounded-xl min-w-[160px]">
                        {statusOptions.map((option) => (
                          <MenuItem
                            key={option.value}
                            onClick={() => onStatusChange(table.id, option.value)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                              table.status === option.value
                                ? "bg-[#faf6f1]"
                                : "hover:bg-[#faf6f1]/50"
                            }`}
                          >
                            <span className="text-sm">{option.icon}</span>
                            <span
                              className={`text-xs font-bold ${option.color} flex-1`}
                            >
                              {option.label}
                            </span>
                            {table.status === option.value && (
                              <CheckCircleIcon className="w-4 h-4 text-[#8B5E3C]" strokeWidth={2.5} />
                            )}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>

                    {/* Xem chi tiết */}
                    <Tooltip content="Xem chi tiết" placement="top">
                      <button
                        onClick={() => onShow(table)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#faf6f1] hover:bg-[#8B5E3C] text-[#8B5E3C] hover:text-white transition-all duration-200"
                      >
                        <EyeIcon className="w-3.5 h-3.5" strokeWidth={2.2} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ====== FOOTER STATS ====== */}
      <div className="mt-4 px-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Typography className="text-xs font-semibold text-[#6d4c41]">
          Hiển thị:{" "}
          <span className="font-bold text-[#8B5E3C]">{tables.length}</span> bàn
        </Typography>
        <div className="flex items-center gap-4 text-xs flex-wrap justify-center">
          <span className="flex items-center gap-1.5 text-[#6d4c41] font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C89F77] border border-white shadow-sm" />
            {tables.filter((t) => t.status === "FREE").length} Trống
          </span>
          <span className="flex items-center gap-1.5 text-[#4e342e] font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4e342e] border border-white shadow-sm" />
            {tables.filter((t) => t.status === "OCCUPIED").length} Đang dùng
          </span>
          <span className="flex items-center gap-1.5 text-[#8B5E3C] font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4A574] border border-white shadow-sm" />
            {tables.filter((t) => t.status === "RESERVED").length} Đã đặt
          </span>
        </div>
      </div>
    </div>
  );
}

export default TablesTable;