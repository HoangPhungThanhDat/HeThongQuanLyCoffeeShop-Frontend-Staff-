import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";

/**
 * CoffeeLoader — Loader "pha chế cà phê" dùng chung
 *
 * @param {string} title     — Tiêu đề chính (default: "Đang pha chế dữ liệu")
 * @param {string} subtitle  — Phụ đề (default: "Vui lòng chờ trong giây lát")
 * @param {string} brand     — Tên thương hiệu (default: "Coffee Shop Admin")
 * @param {number} duration  — Thời gian chạy progress bar (ms, default: 1500)
 * @param {string} className — Class bổ sung cho wrapper ngoài cùng
 * @param {boolean} fullScreen — Chiếm full màn hình hay chỉ 1 vùng (default: true)
 *
 * @example
 * // Full screen
 * <CoffeeLoader />
 *
 * @example
 * // Trong 1 card, không full screen
 * <CoffeeLoader fullScreen={false} title="Đang tải..." className="py-12" />
 */
export function CoffeeLoader({
  title = "Đang pha chế dữ liệu",
  subtitle = "Vui lòng chờ trong giây lát",
  brand = "Coffee Shop Admin",
  duration = 1500,
  className = "",
  fullScreen = true,
}) {
  return (
    <div
      className={`
        relative flex flex-col items-center justify-center overflow-hidden
        ${fullScreen ? "h-screen" : "min-h-[400px] w-full"}
        ${className}
      `}
    >
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* ===== Coffee Cup with Steam ===== */}
        <div className="relative w-40 h-40 flex items-end justify-center">
          {/* Steam particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`steam-${i}`}
              className="absolute bottom-24 w-1.5 rounded-full bg-gradient-to-t from-[#8B5E3C]/40 via-[#C89F77]/20 to-transparent"
              style={{ left: `${52 + i * 8}px` }}
              initial={{ height: 0, opacity: 0, y: 0 }}
              animate={{
                height: [10, 40, 10],
                opacity: [0, 0.7, 0],
                y: [0, -35, -70],
                x: [0, i % 2 === 0 ? 6 : -6, 0],
              }}
              transition={{
                duration: 2.5 + i * 0.3,
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 0.4,
              }}
            />
          ))}

          {/* Cup outer glow */}
          <motion.div
            className="absolute bottom-0 w-32 h-32 rounded-full bg-[#C89F77]/20 blur-2xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Saucer */}
          <div className="absolute bottom-0 w-36 h-4 rounded-full bg-gradient-to-b from-[#3a2f2b] to-[#1a1410] shadow-xl" />

          {/* Cup body */}
          <motion.div
            className="relative w-24 h-20 rounded-b-[40%] bg-gradient-to-br from-[#8B5E3C] via-[#6d4c41] to-[#4e342e] shadow-2xl shadow-[#8B5E3C]/40 border-t-2 border-[#C89F77]/40 ring-1 ring-[#C89F77]/20"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Rim highlight */}
            <div className="absolute -top-1 left-0 right-0 h-2 bg-gradient-to-b from-[#C89F77]/60 to-transparent rounded-full" />

            {/* Liquid surface */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[88%] h-3 bg-gradient-to-b from-[#3a1f10] to-[#2a1508] rounded-full mt-1 shadow-inner" />

            {/* Coffee emoji */}
            <div className="absolute inset-0 flex items-center justify-center text-3xl">
              
            </div>

            {/* Cup handle */}
            <div className="absolute -right-4 top-4 w-6 h-10 rounded-r-full border-4 border-[#6d4c41] border-l-0 shadow-lg" />
          </motion.div>

          {/* Soft shadow under saucer */}
          <div className="absolute -bottom-2 w-40 h-6 rounded-full bg-[#8B5E3C]/20 blur-xl" />
        </div>

        {/* ===== Progress Bar ===== */}
        <div className="mt-12 w-64 h-1.5 rounded-full bg-[#8B5E3C]/10 overflow-hidden border border-[#C89F77]/20">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#8B5E3C] via-[#C89F77] to-[#a4714b] shadow-[0_0_12px_rgba(139,94,60,0.4)]"
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "30%", "55%", "75%", "90%", "100%"] }}
            transition={{
              duration: duration / 1000,
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              ease: "easeInOut",
            }}
          />
        </div>

        {/* ===== Title ===== */}
        <motion.h1
          className="mt-8 text-xl lg:text-2xl font-extrabold tracking-wide bg-gradient-to-r from-[#8B5E3C] via-[#a4714b] to-[#6d4c41] bg-clip-text text-transparent"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {title}
        </motion.h1>

        {/* ===== Subtitle with dots ===== */}
        <div className="mt-3 flex items-center gap-1">
          <Typography className="text-xs text-[#8B5E3C]/70 font-medium">
            {subtitle}
          </Typography>
          <div className="flex gap-0.5 ml-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1 h-1 rounded-full bg-[#8B5E3C]/60"
                animate={{ opacity: [0.2, 1, 0.2], y: [0, -2, 0] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>

        {/* ===== Brand Badge ===== */}
        {brand && (
          <motion.div
            className="mt-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-[#C89F77]/30 backdrop-blur-sm shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center text-[10px]">
              
            </div>
            <Typography className="text-[10px] font-bold text-[#8B5E3C] uppercase tracking-widest">
              {brand}
            </Typography>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default CoffeeLoader;