
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import {
  CubeIcon,
  ShoppingCartIcon,
  HashtagIcon,
  BanknotesIcon,
  CalculatorIcon,
  XMarkIcon,
  CheckBadgeIcon,
  SparklesIcon,
  FingerPrintIcon,
  InformationCircleIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

// ⭐ Import formatPrice dùng chung
import { formatPrice } from "./utils/formatters";

// ==================== INFO ITEM ====================
function InfoItem({ icon: Icon, label, value, highlight = false }) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-amber-100 hover:border-[#8B5E3C]/30 transition-colors duration-200">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#faf6f1] flex items-center justify-center">
        <Icon className="w-4 h-4 text-[#8B5E3C]" strokeWidth={2.2} />
      </div>
      <div className="flex-1 min-w-0">
        <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </Typography>
        <Typography
          className={`text-xs font-semibold truncate ${
            highlight ? "text-[#8B5E3C] font-extrabold" : "text-gray-800"
          }`}
        >
          {value}
        </Typography>
      </div>
    </div>
  );
}

// ==================== MAIN ====================
export function Show({ open, orderItem, onClose }) {
  if (!orderItem) return null;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="lg"
      className="bg-transparent shadow-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* ============ HERO HEADER ============ */}
        <div className="relative bg-gradient-to-r from-[#8B5E3C] via-[#a4714b] to-[#C89F77] p-5 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 -left-4 w-20 h-20 rounded-full bg-white/10" />

          {/* Coffee bean pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-1.5 rounded-lg bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <XMarkIcon className="h-4 w-4" strokeWidth={2.5} />
          </button>

          {/* Badge top left */}
          <div className="absolute top-3 left-3 z-20">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
              <SparklesIcon className="h-3 w-3 text-amber-200" />
              <span className="text-[9px] font-extrabold text-white uppercase tracking-widest">
                Item
              </span>
            </div>
          </div>

          <div className="relative flex items-center gap-4 z-10 pt-4">
            {/* Icon món */}
            <div className="relative flex-shrink-0">
              <motion.div
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8B5E3C] via-[#6d4c41] to-[#4e342e] flex items-center justify-center shadow-2xl border-2 border-white/40"
              >
                <div className="absolute inset-1.5 rounded-xl border border-white/20" />
                <CubeIcon className="w-9 h-9 text-white" strokeWidth={2} />
              </motion.div>

              {/* Item ID dot */}
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center bg-white">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <Typography className="text-[10px] font-bold text-amber-100 uppercase tracking-widest">
                Chi tiết order item
              </Typography>
              <Typography
                variant="h5"
                className="text-white font-extrabold tracking-tight truncate"
              >
                Item #{orderItem.id}
              </Typography>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 border border-white/20">
                  <ShoppingCartIcon className="w-3 h-3 text-white" />
                  <span className="text-[10px] font-bold text-white">
                    Đơn #{orderItem.orderId}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 border border-white/20">
                  <HashtagIcon className="w-3 h-3 text-white" />
                  <span className="text-[10px] font-bold text-white">
                    x{orderItem.quantity}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 border border-white/20 max-w-[160px]">
                  <span className="text-[10px]">☕</span>
                  <span className="text-[10px] font-bold text-white truncate">
                    {orderItem.productName || `SP #${orderItem.productId}`}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============ BODY ============ */}
        <DialogBody className="p-5 max-h-[60vh] overflow-y-auto bg-[#faf6f1]">
          <div className="space-y-4">
            {/* Row 1: Quick stats (4 cards) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* Item ID */}
              <div className="p-3 rounded-xl bg-white border border-amber-100">
                <FingerPrintIcon className="h-4 w-4 text-[#8B5E3C] mb-1.5" />
                <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  Mã item
                </Typography>
                <Typography className="text-sm font-extrabold text-[#4e342e]">
                  #{orderItem.id}
                </Typography>
              </div>

              {/* Quantity */}
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                <HashtagIcon className="h-4 w-4 text-blue-100 mb-1.5" />
                <Typography className="text-[9px] font-bold text-blue-100/80 uppercase tracking-wider">
                  Số lượng
                </Typography>
                <Typography className="text-sm font-extrabold text-white">
                  x{orderItem.quantity}
                </Typography>
              </div>

              {/* Unit price */}
              <div className="p-3 rounded-xl bg-white border border-amber-100">
                <BanknotesIcon className="h-4 w-4 text-[#8B5E3C] mb-1.5" />
                <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  Đơn giá
                </Typography>
                <Typography className="text-xs font-extrabold text-[#4e342e] truncate">
                  {formatPrice(orderItem.price)}
                </Typography>
              </div>

              {/* Subtotal */}
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] shadow-sm">
                <CalculatorIcon className="h-4 w-4 text-amber-200 mb-1.5" />
                <Typography className="text-[9px] font-bold text-amber-200/80 uppercase tracking-wider">
                  Thành tiền
                </Typography>
                <Typography className="text-xs font-extrabold text-white truncate">
                  {formatPrice(orderItem.subtotal)}
                </Typography>
              </div>
            </div>

            {/* Section: Receipt Preview */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-4 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                <Typography className="text-[11px] font-extrabold uppercase text-[#6d4c41] tracking-widest">
                  Xem trước hóa đơn
                </Typography>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
              </div>

              <div className="p-4 rounded-2xl bg-white border border-amber-100">
                <div
                  className="relative rounded-xl p-4"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 94, 60, 0.06) 1px, transparent 0)`,
                    backgroundSize: "20px 20px",
                  }}
                >
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-[#faf6f1] to-[#fffaf5] border-2 border-[#C89F77]/30">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-md">
                      <Typography className="text-base font-extrabold text-white">
                        x{orderItem.quantity}
                      </Typography>
                    </div>

                    <div className="flex-1 min-w-0">
                      <Typography className="text-sm font-extrabold text-[#4e342e] truncate">
                        {orderItem.productName || `Sản phẩm #${orderItem.productId}`}
                      </Typography>
                      <Typography className="text-[10px] text-gray-500 mt-0.5">
                        Đơn giá: {formatPrice(orderItem.price)}
                      </Typography>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                        Thành tiền
                      </Typography>
                      <Typography className="text-sm font-extrabold text-[#8B5E3C]">
                        {formatPrice(orderItem.subtotal)}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Công thức tính */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-4 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                <Typography className="text-[11px] font-extrabold uppercase text-[#6d4c41] tracking-widest">
                  Công thức tính
                </Typography>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
              </div>

              <div className="rounded-2xl bg-white border border-amber-100 overflow-hidden">
                <div className="flex items-center justify-between p-3.5 border-b border-dashed border-amber-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#faf6f1] flex items-center justify-center">
                      <ArrowTrendingUpIcon className="w-3.5 h-3.5 text-[#8B5E3C]" strokeWidth={2.5} />
                    </div>
                    <Typography className="text-xs font-bold text-gray-500">
                      Số lượng × Đơn giá
                    </Typography>
                  </div>
                  <Typography className="text-xs font-extrabold text-gray-800">
                    {orderItem.quantity} × {formatPrice(orderItem.price)}
                  </Typography>
                </div>

                <div className="p-4 bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalculatorIcon className="h-4 w-4 text-amber-200" />
                      <Typography className="text-[10px] font-extrabold text-amber-200 uppercase tracking-widest">
                        Thành tiền
                      </Typography>
                    </div>
                    <Typography className="text-lg font-extrabold text-white">
                      {formatPrice(orderItem.subtotal)}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Thông tin chi tiết */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-4 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                <Typography className="text-[11px] font-extrabold uppercase text-[#6d4c41] tracking-widest">
                  Thông tin chi tiết
                </Typography>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <InfoItem
                  icon={ShoppingCartIcon}
                  label="Đơn hàng"
                  value={`#${orderItem.orderId}`}
                />
                <InfoItem
                  icon={CubeIcon}
                  label="Sản phẩm"
                  value={orderItem.productName || `#${orderItem.productId}`}
                />
                <InfoItem
                  icon={HashtagIcon}
                  label="Số lượng"
                  value={`${orderItem.quantity} phần`}
                />
                <InfoItem
                  icon={BanknotesIcon}
                  label="Đơn giá"
                  value={formatPrice(orderItem.price)}
                  highlight
                />
              </div>
            </div>

            {/* Note */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#8B5E3C]/10 flex items-center justify-center">
                <InformationCircleIcon className="h-4 w-4 text-[#8B5E3C]" />
              </div>
              <Typography className="text-xs text-[#6d4c41] leading-relaxed">
                <span className="font-bold">Ghi chú:</span> Đây là thông tin chi
                tiết của món trong đơn hàng{" "}
                <span className="font-bold">#{orderItem.orderId}</span>. Thành
                tiền được tính bằng số lượng nhân với đơn giá.
              </Typography>
            </div>
          </div>
        </DialogBody>

        {/* ============ FOOTER ============ */}
        <DialogFooter className="bg-white border-t border-amber-100 p-4 flex items-center justify-between gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center text-xs">
              ☕
            </div>
            <Typography className="text-xs text-[#6d4c41] font-bold">
              Coffee Shop Staff
            </Typography>
          </div>

          <Button
            onClick={onClose}
            className="ml-auto bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] text-white px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 normal-case font-bold flex items-center gap-2 text-sm"
          >
            <CheckBadgeIcon className="h-4 w-4" strokeWidth={2.5} />
            Đóng
          </Button>
        </DialogFooter>
      </motion.div>
    </Dialog>
  );
}

export default Show;