import { Typography, Button } from "@material-tailwind/react";
import {
  PlusIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export function OrderItemsHeader({ stats, onCreate, onRefresh }) {
  // ⭐ GUARD: stats có thể undefined khi React Query chưa load xong
  const {
    totalItems = 0,
    totalQuantity = 0,
    totalRevenue = 0,
    uniqueOrders = 0,
  } = stats || {};

  return (
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
          <ClipboardDocumentListIcon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
        </motion.div>
        <div>
          <Typography
            variant="h4"
            className="font-extrabold text-[#4e342e] tracking-tight text-2xl lg:text-3xl"
          >
            Chi Tiết Đơn Hàng
          </Typography>
          <Typography className="text-xs lg:text-sm text-[#8B5E3C] font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            {uniqueOrders} đơn · {totalItems} món · Realtime
          </Typography>
        </div>
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <Button
          variant="outlined"
          className="flex items-center justify-center gap-2 border-2 border-[#8B5E3C]/40 text-[#6d4c41] hover:bg-[#faf6f1] hover:border-[#8B5E3C] rounded-xl normal-case font-bold px-4 py-2.5"
          onClick={onRefresh}
        >
          <ArrowPathIcon className="h-4 w-4" strokeWidth={2.5} />
        </Button>
        <Button
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] shadow-lg shadow-[#8B5E3C]/30 rounded-xl normal-case font-bold px-5 py-2.5 flex-1 md:flex-none"
          onClick={onCreate}
        >
          <PlusIcon className="h-4 w-4" strokeWidth={2.5} />
          Thêm món
        </Button>
      </div>
    </motion.div>
  );
}

export default OrderItemsHeader;