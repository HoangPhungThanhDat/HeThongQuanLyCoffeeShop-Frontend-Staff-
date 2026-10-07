import { useState } from "react";
import { Tooltip, Button } from "@material-tailwind/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  EyeIcon,
  PencilIcon,
  ClockIcon,
  CheckCircleIcon,
  FireIcon,
  TruckIcon,
  BanknotesIcon,
  XCircleIcon,
  UserIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

// ==================== STATUS COLUMNS ====================
const COLUMNS = [
  {
    key: "PENDING",
    label: "Chờ xác nhận",
    emoji: "⏳",
    icon: ClockIcon,
    gradient: "from-amber-400 to-yellow-500",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-500",
    nextAction: { label: "Xác nhận", nextStatus: "CONFIRMED", color: "from-blue-500 to-blue-600" },
  },
  {
    key: "CONFIRMED",
    label: "Đã xác nhận",
    emoji: "✅",
    icon: CheckCircleIcon,
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
    border: "border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-500",
    nextAction: { label: "Chuẩn bị", nextStatus: "PREPARING", color: "from-orange-500 to-orange-600" },
  },
  {
    key: "PREPARING",
    label: "Đang chuẩn bị",
    emoji: "🔥",
    icon: FireIcon,
    gradient: "from-orange-500 to-red-500",
    bg: "bg-gradient-to-br from-orange-50 to-amber-50",
    border: "border-orange-200",
    text: "text-orange-700",
    dot: "bg-orange-500",
    nextAction: { label: "Phục vụ", nextStatus: "SERVED", color: "from-purple-500 to-purple-600" },
  },
  {
    key: "SERVED",
    label: "Đã phục vụ",
    emoji: "🍽️",
    icon: TruckIcon,
    gradient: "from-purple-500 to-fuchsia-600",
    bg: "bg-gradient-to-br from-purple-50 to-fuchsia-50",
    border: "border-purple-200",
    text: "text-purple-700",
    dot: "bg-purple-500",
    nextAction: { label: "Thanh toán", nextStatus: "PAID", color: "from-green-500 to-green-600" },
  },
  {
    key: "PAID",
    label: "Đã thanh toán",
    emoji: "💰",
    icon: BanknotesIcon,
    gradient: "from-green-500 to-emerald-600",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50",
    border: "border-green-200",
    text: "text-green-700",
    dot: "bg-green-500",
    nextAction: null,
  },
  {
    key: "CANCELLED",
    label: "Đã hủy",
    emoji: "❌",
    icon: XCircleIcon,
    gradient: "from-red-500 to-rose-600",
    bg: "bg-gradient-to-br from-red-50 to-rose-50",
    border: "border-red-200",
    text: "text-red-700",
    dot: "bg-red-500",
    nextAction: null,
  },
];

export function OrderKanban({ orders, onShow, onEdit, onUpdateStatus }) {
  const [processingId, setProcessingId] = useState(null);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price || 0);

  const formatCompactPrice = (price) => {
    if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M`;
    if (price >= 1_000) return `${(price / 1_000).toFixed(0)}K`;
    return price.toString();
  };

  const getOrdersByStatus = (status) =>
    orders.filter((o) => o.status === status);

  const handleQuickAction = async (orderId, nextStatus) => {
    setProcessingId(orderId);
    try {
      await onUpdateStatus(orderId, nextStatus);
    } finally {
      setTimeout(() => setProcessingId(null), 500);
    }
  };

  // ===== EMPTY STATE =====
  if (orders.length === 0) {
    return (
      <div className="p-12 lg:p-16 text-center bg-gradient-to-br from-[#faf6f1] to-[#fffaf5]">
        <div className="flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center mb-4 shadow-xl shadow-[#8B5E3C]/30">
            <span className="text-5xl">📋</span>
          </div>
          <p className="text-base text-[#4e342e] font-bold mb-1">Chưa có đơn hàng nào</p>
          <p className="text-xs text-[#8B5E3C]/70">Đơn hàng mới sẽ xuất hiện ở đây</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 overflow-x-auto bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3]">
      <div className="grid grid-cols-6 gap-4 min-w-[1400px]">
        {COLUMNS.map((column) => {
          const Icon = column.icon;
          const columnOrders = getOrdersByStatus(column.key);
          const totalAmount = columnOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);

          return (
            <div key={column.key} className="flex flex-col">
              {/* ===== COLUMN HEADER ===== */}
              <div
                className={`rounded-2xl border-2 ${column.border} ${column.bg} p-4 mb-3 shadow-sm sticky top-0 z-10`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className={`flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br ${column.gradient} flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">{column.emoji}</span>
                      <p className={`text-xs font-extrabold uppercase tracking-wider ${column.text} truncate`}>
                        {column.label}
                      </p>
                    </div>
                    <p className="text-[10px] font-bold text-gray-500">
                      {columnOrders.length} đơn
                      {totalAmount > 0 && (
                        <span className="ml-1 text-[#8B5E3C]">
                          · {formatCompactPrice(totalAmount)}₫
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Progress line */}
                <div className="h-1 rounded-full bg-white/60 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: orders.length > 0 ? `${(columnOrders.length / orders.length) * 100}%` : "0%",
                    }}
                    transition={{ duration: 0.5 }}
                    className={`h-full rounded-full bg-gradient-to-r ${column.gradient}`}
                  />
                </div>
              </div>

              {/* ===== COLUMN BODY ===== */}
              <div className="flex-1 space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto pr-1 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {columnOrders.length === 0 ? (
                    <div className="text-center py-8 px-3 rounded-2xl bg-white/50 border-2 border-dashed border-[#C89F77]/30">
                      <p className="text-[10px] font-bold text-gray-400 italic">
                        Không có đơn
                      </p>
                    </div>
                  ) : (
                    columnOrders.map((order, idx) => {
                      const isProcessing = processingId === order.id;

                      return (
                        <motion.div
                          key={order.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: -20 }}
                          transition={{ duration: 0.25, delay: idx * 0.03 }}
                          whileHover={{ y: -3, scale: 1.02 }}
                          className="group relative bg-white rounded-2xl border-2 border-amber-100 hover:border-[#C89F77]/60 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                          {/* Top gradient bar */}
                          <div className={`h-1 bg-gradient-to-r ${column.gradient}`} />

                          <div className="p-3">
                            {/* Row 1: Order ID + Actions */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${column.dot}`} />
                                <p className="text-sm font-extrabold text-[#4e342e]">
                                  #{order.id}
                                </p>
                              </div>

                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Tooltip content="Xem chi tiết" placement="top">
                                  <button
                                    onClick={() => onShow(order)}
                                    className="w-6 h-6 rounded-md flex items-center justify-center bg-[#faf6f1] hover:bg-[#8B5E3C] text-[#8B5E3C] hover:text-white transition-colors duration-150"
                                  >
                                    <EyeIcon className="w-3 h-3" strokeWidth={2.5} />
                                  </button>
                                </Tooltip>
                                <Tooltip content="Chỉnh sửa" placement="top">
                                  <button
                                    onClick={() => onEdit(order)}
                                    className="w-6 h-6 rounded-md flex items-center justify-center bg-[#faf6f1] hover:bg-amber-500 text-amber-600 hover:text-white transition-colors duration-150"
                                  >
                                    <PencilIcon className="w-3 h-3" strokeWidth={2.5} />
                                  </button>
                                </Tooltip>
                              </div>
                            </div>

                            {/* Row 2: Table + Employee */}
                            <div className="space-y-1.5 mb-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm">🪑</span>
                                <span className="text-xs font-bold text-gray-700 truncate">
                                  Bàn {order.table?.number || "N/A"}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  · {order.table?.capacity || 0} chỗ
                                </span>
                              </div>

                              {order.employee?.fullName && (
                                <div className="flex items-center gap-1.5">
                                  <UserIcon className="w-3 h-3 text-gray-400" />
                                  <span className="text-[10px] font-semibold text-gray-500 truncate">
                                    {order.employee.fullName}
                                  </span>
                                </div>
                              )}

                              {order.promotion?.name && (
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px]">🎁</span>
                                  <span className="text-[10px] font-bold text-pink-600 truncate">
                                    {order.promotion.name}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Row 3: Total */}
                            <div className="p-2 rounded-lg bg-gradient-to-r from-[#faf6f1] to-[#f5ede3] border border-[#C89F77]/30 mb-2">
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                Tổng tiền
                              </p>
                              <p className="text-sm font-extrabold text-[#8B5E3C] truncate">
                                {formatPrice(order.totalAmount)}
                              </p>
                            </div>

                            {/* Row 4: Notes */}
                            {order.notes && (
                              <div className="p-1.5 rounded-md bg-amber-50 border-l-2 border-amber-400 mb-2">
                                <p className="text-[10px] text-amber-800 italic line-clamp-2">
                                  💬 {order.notes}
                                </p>
                              </div>
                            )}

                            {/* Row 5: Time */}
                            <div className="flex items-center gap-1 mb-2 text-[9px] text-gray-400">
                              <ClockIcon className="w-3 h-3" />
                              <span>
                                {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <span>·</span>
                              <span>
                                {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                                  day: "2-digit",
                                  month: "2-digit",
                                })}
                              </span>
                            </div>

                            {/* Row 6: Quick Action */}
                            {column.nextAction && (
                              <button
                                disabled={isProcessing}
                                onClick={() =>
                                  handleQuickAction(order.id, column.nextAction.nextStatus)
                                }
                                className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gradient-to-r ${column.nextAction.color} text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                              >
                                {isProcessing ? (
                                  <>
                                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                      />
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      />
                                    </svg>
                                    Đang xử lý...
                                  </>
                                ) : (
                                  <>
                                    {column.nextAction.label}
                                    <ChevronRightIcon className="w-3 h-3" strokeWidth={3} />
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom scrollbar style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 94, 60, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 94, 60, 0.4);
        }
      `}</style>
    </div>
  );
}

export default OrderKanban;