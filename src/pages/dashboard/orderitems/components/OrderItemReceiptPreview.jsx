
import { Typography } from "@material-tailwind/react";
import {
  ShoppingCartIcon,
  SparklesIcon,
  PencilSquareIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { formatPrice } from "../utils/formatters";

/**
 * Preview receipt order item — dùng chung Create/Edit
 */
export function OrderItemReceiptPreview({
  formData,
  selectedOrder,
  selectedProduct,
  finalSubtotal,
  mode = "create",
  itemId,
  productChanged = false,
  quantityChanged = false,
  priceChanged = false,
}) {
  const isEditMode = mode === "edit";

  // Đổi màu khi sản phẩm thay đổi
  const glowGradient = productChanged
    ? "from-yellow-400 to-orange-500"
    : "from-[#8B5E3C] to-[#C89F77]";

  const topBarGradient = productChanged
    ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
    : "bg-gradient-to-r from-[#8B5E3C] via-[#a4714b] to-[#C89F77]";

  const badgeGradient = productChanged
    ? "from-yellow-500 to-orange-600"
    : "from-amber-400 to-orange-500";

  return (
    <div className="relative group w-full max-w-[300px]">
      {/* Glow */}
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${glowGradient} blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`}
      />

      {/* Receipt Card */}
      <motion.div
        key={formData.productId}
        initial={{ scale: 0.95, rotate: -2 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative rounded-2xl bg-white border-2 border-amber-100 shadow-2xl overflow-hidden"
      >
        {/* Top bar */}
        <div className={`h-2 ${topBarGradient}`} />

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
                {isEditMode ? `Item #${itemId}` : "Item mới"}
              </Typography>
            </div>
          </div>
          <div className="h-px border-t-2 border-dashed border-[#C89F77]/30 mt-2" />
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {/* Order */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm">📋</span>
              <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Đơn
              </Typography>
            </div>
            <Typography className="text-xs font-extrabold text-[#4e342e] truncate max-w-[140px] text-right">
              {selectedOrder ? `#${selectedOrder.id}` : "—"}
            </Typography>
          </div>

          {/* Product */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm">☕</span>
              <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Sản phẩm
              </Typography>
            </div>
            <div className="flex items-center gap-1.5">
              {productChanged && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              )}
              <Typography
                className={`text-xs font-extrabold truncate max-w-[140px] text-right ${
                  productChanged ? "text-orange-600" : "text-[#4e342e]"
                }`}
              >
                {selectedProduct?.name || "—"}
              </Typography>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm">📦</span>
              <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                SL
              </Typography>
            </div>
            <div className="flex items-center gap-1.5">
              {quantityChanged && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              )}
              <Typography
                className={`text-xs font-extrabold ${
                  quantityChanged ? "text-orange-600" : "text-[#4e342e]"
                }`}
              >
                {formData.quantity || "—"}
              </Typography>
            </div>
          </div>

          {/* Unit price */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm">💵</span>
              <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Đơn giá
              </Typography>
            </div>
            <div className="flex items-center gap-1.5">
              {priceChanged && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              )}
              <Typography
                className={`text-xs font-extrabold truncate max-w-[140px] text-right ${
                  priceChanged ? "text-orange-600" : "text-[#4e342e]"
                }`}
              >
                {formData.price ? formatPrice(formData.price) : "—"}
              </Typography>
            </div>
          </div>

          <div className="h-px border-t-2 border-dashed border-[#C89F77]/30 my-2" />

          {/* Subtotal */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] shadow-md">
            <Typography className="text-[9px] font-extrabold text-amber-200/80 uppercase tracking-widest text-center">
              Thành tiền
            </Typography>
            <Typography className="text-base font-extrabold text-white text-center mt-0.5 truncate">
              {formatPrice(finalSubtotal)}
            </Typography>
          </div>
        </div>

        {/* Bottom edge */}
        <div
          className="h-3"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0%, transparent 6px, rgba(139,94,60,0.08) 7px)`,
            backgroundSize: "16px 8px",
            backgroundRepeat: "repeat-x",
          }}
        />
      </motion.div>

      {/* Badge */}
      <motion.div
        className={`absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br ${badgeGradient} flex items-center justify-center shadow-lg border-2 border-white z-10`}
        animate={{ rotate: isEditMode ? [0, 10, -10, 0] : [0, 15, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {productChanged ? (
          <ExclamationTriangleIcon className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
        ) : isEditMode ? (
          <PencilSquareIcon className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
        ) : (
          <SparklesIcon className="h-3.5 w-3.5 text-white" />
        )}
      </motion.div>
    </div>
  );
}

export default OrderItemReceiptPreview;