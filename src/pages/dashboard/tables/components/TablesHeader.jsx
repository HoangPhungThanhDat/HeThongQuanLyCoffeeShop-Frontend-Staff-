
import { Typography, Button } from "@material-tailwind/react";
import { RectangleStackIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export function TablesHeader({ onRefresh }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 2xl:w-16 2xl:h-16 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg shadow-[#8B5E3C]/30 flex-shrink-0">
          <RectangleStackIcon className="w-6 h-6 2xl:w-8 2xl:h-8 text-white" />
        </div>
        <div>
          <Typography
            variant="h4"
            className="font-extrabold text-[#4e342e] tracking-tight text-2xl lg:text-3xl 2xl:text-4xl"
          >
            Sơ Đồ Bàn
          </Typography>
          <Typography className="text-xs lg:text-sm text-[#8B5E3C] font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Khu vực phục vụ — Coffee Shop ☕
          </Typography>
        </div>
      </div>

      <Button
        size="lg"
        variant="outlined"
        className="flex items-center justify-center gap-2 border-2 border-[#8B5E3C]/40 text-[#6d4c41] hover:bg-[#faf6f1] hover:border-[#8B5E3C] transition-all duration-300 rounded-xl normal-case font-bold px-5 py-3"
        onClick={onRefresh}
      >
        <ArrowPathIcon className="h-5 w-5" strokeWidth={2.5} />
        Làm mới
      </Button>
    </motion.div>
  );
}

export default TablesHeader;