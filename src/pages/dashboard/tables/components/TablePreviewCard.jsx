
import { Typography } from "@material-tailwind/react";
import { UsersIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { getStatusConfig } from "../constants/tableConfig";

/**
 * Preview card bàn — dùng chung Show + các nơi khác
 */
export function TablePreviewCard({
  number,
  capacity,
  status = "FREE",
  size = "md", // "sm" | "md"
}) {
  const statusConfig = getStatusConfig(status);
  const isOccupied = status === "OCCUPIED";
  const isSmall = size === "sm";

  const dimensions = isSmall
    ? "w-24 h-24"
    : "w-32 h-32";

  const iconSize = isSmall
    ? "w-9 h-9 text-base"
    : "w-12 h-12 text-xl";

  const numberSize = isSmall
    ? "text-xs"
    : "text-sm";

  const capacitySize = isSmall
    ? "text-[8px]"
    : "text-[9px]";

  return (
    <div
      className={`relative ${dimensions} rounded-2xl border-2 ${statusConfig.border} bg-white shadow-lg overflow-hidden`}
    >
      {/* Wood top bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${statusConfig.gradient}`}
      />

      {/* Steam for OCCUPIED */}
      {isOccupied && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-0.5">
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className="w-0.5 h-2.5 rounded-full bg-[#8B5E3C]/40"
              animate={{
                y: [0, -5, 0],
                opacity: [0.4, 0.7, 0.4],
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

      {/* Status pulse */}
      <div className="absolute top-2.5 right-2.5">
        <span className={`block w-2 h-2 rounded-full ${statusConfig.dot}`} />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
        <div
          className={`${iconSize} rounded-full bg-gradient-to-br ${statusConfig.wood} flex items-center justify-center shadow-lg mb-1.5 border-2 border-white/30`}
        >
          <span className="drop-shadow">{statusConfig.emoji}</span>
        </div>
        <Typography className={`${numberSize} font-extrabold text-[#4e342e] leading-none`}>
          {number}
        </Typography>
        <div className={`flex items-center gap-1 mt-1 bg-[#faf6f1] px-2 py-0.5 rounded-full border border-[#C89F77]/30`}>
          <UsersIcon className="w-2.5 h-2.5 text-[#8B5E3C]" />
          <Typography className={`${capacitySize} font-bold text-[#6d4c41]`}>
            {capacity}
          </Typography>
        </div>
      </div>

      {/* Bottom status */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r ${statusConfig.light} border-t ${statusConfig.border} py-1 px-2`}
      >
        <div className="flex items-center justify-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
          <Typography
            className={`text-[9px] font-extrabold ${statusConfig.text} uppercase tracking-wider`}
          >
            {statusConfig.label}
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default TablePreviewCard;