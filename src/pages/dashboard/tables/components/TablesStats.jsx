
import { Typography } from "@material-tailwind/react";
import {
  RectangleStackIcon,
  CheckCircleIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  config,
  delay = 0,
  progress = 100,
  badgeText,
  onClick,
  active,
}) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`group relative overflow-hidden bg-white rounded-2xl p-5 2xl:p-6 shadow-md hover:shadow-2xl border ${config.statBorder} transition-all duration-300 ${
        onClick ? "cursor-pointer" : ""
      } ${active ? "ring-2 ring-offset-2 ring-[#8B5E3C]/40" : ""}`}
    >
      <div
        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${config.light} to-transparent rounded-full -translate-y-12 translate-x-12 opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <div className="relative flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 2xl:w-14 2xl:h-14 rounded-xl bg-gradient-to-br ${config.statGradient} flex items-center justify-center shadow-lg ${config.statShadow} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
        >
          <Icon className="w-5 h-5 2xl:w-7 2xl:h-7 text-white" strokeWidth={2.2} />
        </div>

        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${config.statBadge}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          <Typography className="text-[10px] font-extrabold">
            {badgeText}
          </Typography>
        </div>
      </div>

      <div className="relative">
        <Typography className="text-[10px] 2xl:text-xs font-extrabold uppercase text-gray-400 tracking-[0.15em] mb-1">
          {label}
        </Typography>
        <div className="flex items-end gap-2">
          <Typography className={`text-3xl 2xl:text-4xl font-extrabold leading-none ${config.statText}`}>
            {value}
          </Typography>
          <span className="text-[10px] font-semibold text-gray-400 mb-1">
            {unit}
          </span>
        </div>
      </div>

      <div className="relative mt-4 h-1 rounded-full bg-gray-100 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, delay }}
          className={`h-full rounded-full bg-gradient-to-r ${config.statGradient}`}
        />
      </div>
    </motion.div>
  );
}

export function TablesStats({ stats, statusFilter, onStatusClick }) {
  const { total, freeTables, occupiedTables, reservedTables } = stats;
  const calc = (val) => (total ? (val / total) * 100 : 0);

  // Config riêng cho card "Tổng"
  const totalConfig = {
    statGradient: "from-[#8B5E3C] to-[#6d4c41]",
    statShadow: "shadow-[#8B5E3C]/30",
    statBorder: "border-amber-100 hover:border-[#8B5E3C]/30",
    statBadge: "bg-[#faf6f1] border-[#C89F77]/30 text-[#8B5E3C]",
    statText: "text-[#4e342e]",
    light: "from-[#f5ede3]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
    >
      <StatCard
        icon={RectangleStackIcon}
        label="Tổng số bàn"
        value={total}
        unit="bàn"
        config={totalConfig}
        delay={0.3}
        progress={100}
        badgeText="Tổng"
        onClick={() => onStatusClick("ALL")}
        active={statusFilter === "ALL"}
      />
      <StatCard
        icon={CheckCircleIcon}
        label="Bàn trống"
        value={freeTables}
        unit="bàn"
        config={{
          statGradient: "from-[#C89F77] to-[#a4714b]",
          statShadow: "shadow-[#C89F77]/30",
          statBorder: "border-[#C89F77]/30 hover:border-[#C89F77]",
          statBadge: "bg-[#faf6f1] border-[#C89F77]/30 text-[#6d4c41]",
          statText: "text-[#8B5E3C]",
          light: "from-[#faf6f1]",
        }}
        delay={0.4}
        progress={calc(freeTables)}
        badgeText="Trống"
        onClick={() => onStatusClick("FREE")}
        active={statusFilter === "FREE"}
      />
      <StatCard
        icon={UserGroupIcon}
        label="Đang sử dụng"
        value={occupiedTables}
        unit="bàn"
        config={{
          statGradient: "from-[#4e342e] to-[#6d4c41]",
          statShadow: "shadow-[#4e342e]/30",
          statBorder: "border-[#4e342e]/20 hover:border-[#4e342e]",
          statBadge: "bg-[#f5ede3] border-[#4e342e]/30 text-[#4e342e]",
          statText: "text-[#4e342e]",
          light: "from-[#f5ede3]",
        }}
        delay={0.5}
        progress={calc(occupiedTables)}
        badgeText="Có khách"
        onClick={() => onStatusClick("OCCUPIED")}
        active={statusFilter === "OCCUPIED"}
      />
      <StatCard
        icon={ClockIcon}
        label="Đã đặt trước"
        value={reservedTables}
        unit="bàn"
        config={{
          statGradient: "from-[#D4A574] to-[#c99862]",
          statShadow: "shadow-[#D4A574]/30",
          statBorder: "border-[#D4A574]/40 hover:border-[#D4A574]",
          statBadge: "bg-[#faf0e0] border-[#D4A574]/40 text-[#8B5E3C]",
          statText: "text-[#8B5E3C]",
          light: "from-[#faf0e0]",
        }}
        delay={0.6}
        progress={calc(reservedTables)}
        badgeText="Đã đặt"
        onClick={() => onStatusClick("RESERVED")}
        active={statusFilter === "RESERVED"}
      />
    </motion.div>
  );
}

export default TablesStats;