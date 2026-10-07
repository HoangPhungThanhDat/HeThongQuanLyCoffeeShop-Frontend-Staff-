import { Typography } from "@material-tailwind/react";
import {
  ReceiptPercentIcon,
  CheckCircleIcon,
  ClockIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { formatCompactPrice } from "../utils/formatters";

const STATS_CONFIG = [
  {
    key: "totalBills",
    title: "Tổng hóa đơn",
    unit: "hóa đơn",
    icon: ReceiptPercentIcon,
    gradient: "from-[#8B5E3C] to-[#6d4c41]",
    badge: "Total",
    filter: "ALL",
  },
  {
    key: "completedBills",
    title: "Đã thanh toán",
    unit: "hóa đơn",
    icon: CheckCircleIcon,
    gradient: "from-green-500 to-emerald-600",
    badge: "Completed",
    filter: "COMPLETED",
  },
  {
    key: "pendingBills",
    title: "Chờ thanh toán",
    unit: "hóa đơn",
    icon: ClockIcon,
    gradient: "from-amber-500 to-orange-600",
    badge: "Pending",
    filter: "PENDING",
  },
  {
    key: "totalRevenue",
    title: "Doanh thu",
    unit: "VNĐ",
    icon: BanknotesIcon,
    gradient: "from-blue-500 to-indigo-600",
    badge: "Revenue",
    filter: null,
    isRevenue: true,
  },
];

function StatCard({ config, value, delay, isActive, onClick }) {
  const Icon = config.icon;
  const safeValue = Number.isFinite(Number(value)) ? value : 0;
  const displayValue = config.isRevenue
    ? formatCompactPrice(safeValue)
    : safeValue;
  const clickable = Boolean(config.filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`group relative overflow-hidden bg-white rounded-2xl p-5 shadow-md hover:shadow-2xl border-2 transition-all duration-300 ${
        isActive
          ? "border-[#8B5E3C]"
          : "border-amber-100 hover:border-[#C89F77]/40"
      } ${clickable ? "cursor-pointer" : ""}`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#f5ede3] to-transparent rounded-full -translate-y-12 translate-x-12 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#faf6f1] border border-[#C89F77]/30">
          <Typography className="text-[9px] font-extrabold text-[#8B5E3C] uppercase">
            {config.badge}
          </Typography>
        </div>
      </div>
      <div className="relative">
        <Typography className="text-[10px] font-extrabold uppercase text-gray-400 tracking-[0.15em] mb-1">
          {config.title}
        </Typography>
        <div className="flex items-end gap-2">
          <Typography className="text-2xl font-extrabold text-[#4e342e] leading-none truncate">
            {displayValue}
          </Typography>
          <span className="text-[10px] font-semibold text-gray-400 mb-1">
            {config.unit}
          </span>
        </div>
      </div>
      <div className="relative mt-4 h-1 rounded-full bg-[#faf6f1] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.8, delay: delay + 0.2 }}
          className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
        />
      </div>
    </motion.div>
  );
}

export function BillStats({ stats, statusFilter, onStatusClick }) {
  // ⭐ GUARD: stats có thể undefined khi React Query chưa load xong
  const safeStats = stats || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {STATS_CONFIG.map((config, i) => (
        <StatCard
          key={config.key}
          config={config}
          value={safeStats[config.key] ?? 0}
          delay={0.1 + i * 0.08}
          isActive={config.filter && statusFilter === config.filter}
          onClick={() =>
            config.filter && onStatusClick(config.filter)
          }
        />
      ))}
    </motion.div>
  );
}

export default BillStats;