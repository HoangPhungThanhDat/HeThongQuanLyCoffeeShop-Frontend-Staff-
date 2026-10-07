
import { Typography } from "@material-tailwind/react";
import {
  ShoppingCartIcon,
  SparklesIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { getStatusConfig } from "../constants/orderStatus";
import { formatPrice } from "../utils/formatters";

/**
 * Preview receipt order — dùng chung Create/Edit
 */
export function OrderReceiptPreview({
  formData,
  selectedTable,
  selectedEmployee,
  selectedPromotion,
  formattedTotal,
  mode = "create",
  orderId,
  changeFlags = {},
}) {
  const statusConfig = getStatusConfig(formData.status);
  const isEditMode = mode === "edit";
  const { tableChanged, employeeChanged, promotionChanged, statusChanged } = changeFlags;

  return (
    <motion.div
      key={formData.status}
      initial={{ scale: 0.95, rotate: -2 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative rounded-2xl bg-white border-2 border-amber-100 shadow-2xl overflow-hidden w-full max-w-[300px]"
    >
      {/* Top bar */}
      <div className={`h-2 bg-gradient-to-r ${statusConfig.gradient}`} />

      {/* Header */}
      <div className="p-4 bg-gradient-to-br from-[#faf6f1] to-[#f5ede3] border-b border-amber-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-md">
            <ShoppingCartIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <Typography className="text-[10px] font-extrabold text-[#8B5E3C]/60 uppercase tracking-widest">
              Hóa đơn
            </Typography>
            <Typography className="text-xs font-extrabold text-[#4e342e]">
              {isEditMode ? `#${orderId}` : "Đơn hàng mới"}
            </Typography>
          </div>
        </div>
        <div className="h-px border-t-2 border-dashed border-[#C89F77]/30 mt-2" />
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Table */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm">🪑</span>
            <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Bàn
            </Typography>
          </div>
          <div className="flex items-center gap-1.5">
            {tableChanged && (
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            )}
            <Typography
              className={`text-xs font-extrabold truncate max-w-[140px] text-right ${
                tableChanged ? "text-orange-600" : "text-[#4e342e]"
              }`}
            >
              {selectedTable?.number || "—"}
            </Typography>
          </div>
        </div>

        {/* Employee */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm">👤</span>
            <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Phục vụ
            </Typography>
          </div>
          <div className="flex items-center gap-1.5">
            {employeeChanged && (
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            )}
            <Typography
              className={`text-xs font-extrabold truncate max-w-[140px] text-right ${
                employeeChanged ? "text-orange-600" : "text-[#4e342e]"
              }`}
            >
              {selectedEmployee?.fullName || "—"}
            </Typography>
          </div>
        </div>

        {/* Promotion */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm">🎁</span>
            <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              KM
            </Typography>
          </div>
          <div className="flex items-center gap-1.5">
            {promotionChanged && (
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            )}
            <Typography
              className={`text-xs font-extrabold truncate max-w-[140px] text-right ${
                promotionChanged ? "text-orange-600" : "text-[#4e342e]"
              }`}
            >
              {selectedPromotion?.name || "Không"}
            </Typography>
          </div>
        </div>

        <div className="h-px border-t-2 border-dashed border-[#C89F77]/30 my-2" />

        {/* Status */}
        <div
          className={`flex items-center justify-between p-2 rounded-lg bg-gradient-to-r ${statusConfig.light} border ${statusConfig.border}`}
        >
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} ${
                formData.status === "PENDING" ? "animate-pulse" : ""
              }`}
            />
            <Typography
              className={`text-[9px] font-extrabold ${statusConfig.text} uppercase tracking-wider`}
            >
              {statusConfig.label}
            </Typography>
          </div>
          <div className="flex items-center gap-1.5">
            {statusChanged && (
              <span className="text-[9px] font-extrabold text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded">
                Đổi
              </span>
            )}
            <span className="text-sm">{statusConfig.emoji}</span>
          </div>
        </div>

        {/* Total */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] shadow-md">
          <Typography className="text-[9px] font-extrabold text-amber-200/80 uppercase tracking-widest text-center">
            Tổng tiền
          </Typography>
          <Typography className="text-base font-extrabold text-white text-center mt-0.5 truncate">
            {formattedTotal || formatPrice(0)}
          </Typography>
        </div>
      </div>

      {/* Perforated edge */}
      <div
        className="h-3"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0%, transparent 6px, rgba(139,94,60,0.08) 7px)`,
          backgroundSize: "16px 8px",
          backgroundRepeat: "repeat-x",
        }}
      />

      {/* Badge */}
      <motion.div
        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white z-10"
        animate={{ rotate: isEditMode ? [0, 10, -10, 0] : [0, 15, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {isEditMode ? (
          <PencilSquareIcon className="h-3.5 w-3.5 text-white" />
        ) : (
          <SparklesIcon className="h-3.5 w-3.5 text-white" />
        )}
      </motion.div>
    </motion.div>
  );
}

export default OrderReceiptPreview;