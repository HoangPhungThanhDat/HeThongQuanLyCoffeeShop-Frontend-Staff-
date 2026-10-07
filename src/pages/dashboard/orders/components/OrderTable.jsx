import { useState } from "react";
import { Tooltip, Typography, Button } from "@material-tailwind/react";
import {
  PencilIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  FireIcon,
  TruckIcon,
  BanknotesIcon,
  XCircleIcon,
  UserIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  GiftIcon,
  HashtagIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import "animate.css";

// ==================== STATUS CONFIG ====================
const STATUS_CONFIG = {
  PENDING: {
    label: "Chờ xác nhận",
    icon: ClockIcon,
    emoji: "⏳",
    gradient: "from-amber-400 to-yellow-500",
    bg: "bg-gradient-to-r from-amber-50 to-yellow-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-500",
    nextAction: {
      label: "Xác nhận",
      nextStatus: "CONFIRMED",
      gradient: "from-blue-500 to-blue-600",
      icon: CheckCircleIcon,
    },
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    icon: CheckCircleIcon,
    emoji: "✅",
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
    border: "border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-500",
    nextAction: {
      label: "Chuẩn bị",
      nextStatus: "PREPARING",
      gradient: "from-orange-500 to-orange-600",
      icon: FireIcon,
    },
  },
  PREPARING: {
    label: "Đang chuẩn bị",
    icon: FireIcon,
    emoji: "🔥",
    gradient: "from-orange-500 to-red-500",
    bg: "bg-gradient-to-r from-orange-50 to-amber-50",
    border: "border-orange-200",
    text: "text-orange-700",
    dot: "bg-orange-500",
    nextAction: {
      label: "Phục vụ",
      nextStatus: "SERVED",
      gradient: "from-purple-500 to-purple-600",
      icon: TruckIcon,
    },
  },
  SERVED: {
    label: "Đã phục vụ",
    icon: TruckIcon,
    emoji: "🍽️",
    gradient: "from-purple-500 to-fuchsia-600",
    bg: "bg-gradient-to-r from-purple-50 to-fuchsia-50",
    border: "border-purple-200",
    text: "text-purple-700",
    dot: "bg-purple-500",
    nextAction: {
      label: "Thanh toán",
      nextStatus: "PAID",
      gradient: "from-green-500 to-green-600",
      icon: BanknotesIcon,
    },
  },
  PAID: {
    label: "Đã thanh toán",
    icon: BanknotesIcon,
    emoji: "💰",
    gradient: "from-green-500 to-emerald-600",
    bg: "bg-gradient-to-r from-green-50 to-emerald-50",
    border: "border-green-200",
    text: "text-green-700",
    dot: "bg-green-500",
    nextAction: null,
  },
  CANCELLED: {
    label: "Đã hủy",
    icon: XCircleIcon,
    emoji: "❌",
    gradient: "from-red-500 to-rose-600",
    bg: "bg-gradient-to-r from-red-50 to-rose-50",
    border: "border-red-200",
    text: "text-red-700",
    dot: "bg-red-500",
    nextAction: null,
  },
};

export function OrderTable({ orders, onShow, onEdit, onDelete, onUpdateStatus }) {
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // === Format tiền VND ===
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price || 0);

  // === Format compact ===
  const formatCompactPrice = (price) => {
    if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M`;
    if (price >= 1_000) return `${(price / 1_000).toFixed(0)}K`;
    return price.toString();
  };

  // === Lấy config trạng thái ===
  const getStatusConfig = (status) => STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;

  // === Handler cập nhật trạng thái ===
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await onUpdateStatus(orderId, newStatus);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", error);
    } finally {
      setTimeout(() => setUpdatingOrderId(null), 500);
    }
  };

  // ==================== STATUS CELL ====================
  const renderStatusCell = (order) => {
    const config = getStatusConfig(order.status);
    const Icon = config.icon;
    const nextAction = config.nextAction;
    const isUpdating = updatingOrderId === order.id;
    const isFinalStatus = order.status === "PAID" || order.status === "CANCELLED";

    return (
      <div className="flex flex-col gap-2 min-w-[130px]">
        {/* Status Badge */}
        <div
          className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${config.bg} ${config.border}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          <span className={`text-[10px] font-extrabold uppercase tracking-wider ${config.text}`}>
            {config.label}
          </span>
        </div>

        {/* Next Action Button */}
        {!isFinalStatus && nextAction && (
          <button
            disabled={isUpdating}
            onClick={() => handleStatusUpdate(order.id, nextAction.nextStatus)}
            className={`group/btn inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r ${nextAction.gradient} text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            {isUpdating ? (
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
                <nextAction.icon className="w-3 h-3" strokeWidth={2.5} />
                {nextAction.label}
                <ArrowRightIcon className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 -translate-x-1 group-hover/btn:translate-x-0 transition-all duration-200" strokeWidth={2.5} />
              </>
            )}
          </button>
        )}

        {/* Cancel Button */}
        {order.status !== "SERVED" && !isFinalStatus && (
          <button
            disabled={isUpdating}
            onClick={() => handleStatusUpdate(order.id, "CANCELLED")}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 hover:border-red-500 text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isUpdating ? (
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <>
                <XCircleIcon className="w-3 h-3" strokeWidth={2.5} />
                Hủy đơn
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  // ==================== MAIN RENDER ====================
  return (
    <div className="w-full bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3]">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed min-w-[1200px]">
          <colgroup>
            <col className="w-[4%]" />   {/* STT */}
            <col className="w-[8%]" />   {/* Mã ĐH */}
            <col className="w-[9%]" />   {/* Bàn */}
            <col className="w-[12%]" />  {/* Nhân viên */}
            <col className="w-[10%]" />  {/* Khuyến mãi */}
            <col className="w-[10%]" />  {/* Tổng tiền */}
            <col className="w-[14%]" />  {/* Trạng thái & Action */}
            <col className="w-[12%]" />  {/* Ghi chú */}
            <col className="w-[11%]" />  {/* Ngày tạo */}
            <col className="w-[10%]" />  {/* Thao tác */}
          </colgroup>

          <thead>
            <tr className="bg-gradient-to-r from-[#faf6f1] via-[#f5ede3] to-[#faf6f1] border-b-2 border-amber-100">
              {[
                "STT",
                "Mã ĐH",
                "Bàn",
                "Nhân viên",
                "Khuyến mãi",
                "Tổng tiền",
                "Trạng thái",
                "Ghi chú",
                "Ngày tạo",
                "Thao tác",
              ].map((el) => (
                <th key={el} className="py-4 px-3 lg:px-5 text-left">
                  <Typography className="text-[10px] font-extrabold uppercase text-[#6d4c41] tracking-wider whitespace-nowrap">
                    {el}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-16">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center mb-4">
                      <span className="text-5xl">📋</span>
                    </div>
                    <Typography className="text-base text-[#8B5E3C] font-bold mb-1">
                      Chưa có đơn hàng nào
                    </Typography>
                    <Typography className="text-xs text-gray-400">
                      Đơn hàng mới sẽ xuất hiện ở đây
                    </Typography>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order, index) => {
                const config = getStatusConfig(order.status);
                const className = `py-4 px-3 lg:px-5 align-middle ${
                  index === orders.length - 1 ? "" : "border-b border-amber-50"
                }`;

                return (
                  <tr
                    key={order.id}
                    data-order-id={order.id}
                    className="group hover:bg-gradient-to-r hover:from-[#faf6f1] hover:to-[#fffaf5] transition-all duration-300"
                  >
                    {/* STT */}
                    <td className={className}>
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] group-hover:from-[#8B5E3C] group-hover:to-[#6d4c41] transition-all duration-300">
                        <Typography className="text-xs font-bold text-[#6d4c41] group-hover:text-white transition-colors">
                          {index + 1}
                        </Typography>
                      </div>
                    </td>

                    {/* Mã ĐH */}
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-sm`}
                        >
                          <HashtagIcon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                        </div>
                        <Typography className="text-sm font-extrabold text-[#8B5E3C] whitespace-nowrap">
                          #{order.id}
                        </Typography>
                      </div>
                    </td>

                    {/* Bàn */}
                    <td className={className}>
                      <div className="flex flex-col gap-0.5">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r from-[#f5ede3] to-[#faf6f1] border border-[#C89F77]/40 w-fit">
                          <span className="text-xs">🪑</span>
                          <Typography className="text-xs font-bold text-[#6d4c41]">
                            {order.table?.number || "N/A"}
                          </Typography>
                        </span>
                        {order.table?.capacity && (
                          <Typography className="text-[9px] text-gray-400 font-semibold ml-1">
                            {order.table.capacity} chỗ
                          </Typography>
                        )}
                      </div>
                    </td>

                    {/* Nhân viên */}
                    <td className={className}>
                      {order.employee?.fullName ? (
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center">
                            <UserIcon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                          </div>
                          <Typography className="text-xs font-semibold text-gray-700 truncate">
                            {order.employee.fullName}
                          </Typography>
                        </div>
                      ) : (
                        <Typography className="text-[10px] text-gray-400 italic">
                          Chưa có
                        </Typography>
                      )}
                    </td>

                    {/* Khuyến mãi */}
                    <td className={className}>
                      {order.promotion?.name ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 max-w-full">
                          <GiftIcon className="w-3 h-3 text-pink-500 flex-shrink-0" strokeWidth={2.2} />
                          <Typography className="text-[10px] font-bold text-pink-700 truncate">
                            {order.promotion.name}
                          </Typography>
                        </span>
                      ) : (
                        <Typography className="text-[10px] text-gray-400 italic">
                          Không có
                        </Typography>
                      )}
                    </td>

                    {/* Tổng tiền */}
                    <td className={className}>
                      <div className="flex flex-col">
                        <Typography className="text-sm font-extrabold text-[#8B5E3C] whitespace-nowrap">
                          {formatPrice(order.totalAmount)}
                        </Typography>
                        <Typography className="text-[9px] text-gray-400 font-bold">
                          {formatCompactPrice(order.totalAmount)}₫
                        </Typography>
                      </div>
                    </td>

                    {/* Trạng thái & Action */}
                    <td className={className}>{renderStatusCell(order)}</td>

                    {/* Ghi chú */}
                    <td className={`${className} min-w-0`}>
                      {order.notes ? (
                        <div className="flex items-start gap-1.5">
                          <DocumentTextIcon className="w-3.5 h-3.5 text-[#8B5E3C] flex-shrink-0 mt-0.5" strokeWidth={2.2} />
                          <Tooltip content={order.notes} placement="top">
                            <Typography className="text-[10px] text-gray-600 line-clamp-2">
                              {order.notes}
                            </Typography>
                          </Tooltip>
                        </div>
                      ) : (
                        <Typography className="text-[10px] text-gray-400 italic">
                          —
                        </Typography>
                      )}
                    </td>

                    {/* Ngày tạo */}
                    <td className={className}>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1">
                          <CalendarDaysIcon className="w-3 h-3 text-[#8B5E3C]" strokeWidth={2.2} />
                          <Typography className="text-[10px] font-bold text-gray-700">
                            {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                          </Typography>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-3 h-3 text-gray-400" strokeWidth={2.2} />
                          <Typography className="text-[10px] font-medium text-gray-500">
                            {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Typography>
                        </div>
                      </div>
                    </td>

                    {/* Thao tác */}
                    <td className={`${className} text-center`}>
                      <div className="flex justify-center gap-1.5">
                        <Tooltip content="Xem chi tiết" placement="top">
                          <button
                            onClick={() => onShow(order)}
                            className="group/act inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border-2 border-[#8B5E3C]/20 hover:border-[#8B5E3C] hover:bg-gradient-to-br hover:from-[#8B5E3C] hover:to-[#6d4c41] shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                          >
                            <EyeIcon className="w-4 h-4 text-[#8B5E3C] group-hover/act:text-white transition-colors" strokeWidth={2.2} />
                          </button>
                        </Tooltip>

                        <Tooltip content="Chỉnh sửa" placement="top">
                          <button
                            onClick={() => onEdit(order)}
                            className="group/act inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border-2 border-amber-500/30 hover:border-amber-500 hover:bg-gradient-to-br hover:from-amber-500 hover:to-amber-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                          >
                            <PencilIcon className="w-4 h-4 text-amber-600 group-hover/act:text-white transition-colors" strokeWidth={2.2} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderTable;