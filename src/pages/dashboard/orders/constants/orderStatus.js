
import {
    ClockIcon,
    CheckBadgeIcon,
    FireIcon,
    TruckIcon,
    BanknotesIcon,
    XCircleIcon,
  } from "@heroicons/react/24/outline";
  
  export const ORDER_STATUSES = {
    PENDING: {
      value: "PENDING",
      label: "Chờ xác nhận",
      shortLabel: "Chờ",
      emoji: "⏳",
      icon: ClockIcon,
      gradient: "from-amber-400 via-amber-500 to-orange-500",
      light: "from-amber-50 to-yellow-50",
      border: "border-amber-200",
      text: "text-amber-700",
      dot: "bg-amber-500",
      description: "Đơn hàng đang chờ nhân viên xác nhận",
      nextStatus: "CONFIRMED",
      nextActionLabel: "Xác nhận",
      nextActionColor: "from-blue-500 to-blue-600",
    },
    CONFIRMED: {
      value: "CONFIRMED",
      label: "Đã xác nhận",
      shortLabel: "Xác nhận",
      emoji: "✅",
      icon: CheckBadgeIcon,
      gradient: "from-blue-400 via-blue-500 to-indigo-600",
      light: "from-blue-50 to-indigo-50",
      border: "border-blue-200",
      text: "text-blue-700",
      dot: "bg-blue-500",
      description: "Đơn hàng đã được xác nhận",
      nextStatus: "PREPARING",
      nextActionLabel: "Chuẩn bị",
      nextActionColor: "from-orange-500 to-orange-600",
    },
    PREPARING: {
      value: "PREPARING",
      label: "Đang chuẩn bị",
      shortLabel: "Chuẩn bị",
      emoji: "🔥",
      icon: FireIcon,
      gradient: "from-orange-400 via-orange-500 to-red-500",
      light: "from-orange-50 to-amber-50",
      border: "border-orange-200",
      text: "text-orange-700",
      dot: "bg-orange-500",
      description: "Nhân viên đang pha chế đơn hàng",
      nextStatus: "SERVED",
      nextActionLabel: "Phục vụ",
      nextActionColor: "from-purple-500 to-purple-600",
    },
    SERVED: {
      value: "SERVED",
      label: "Đã phục vụ",
      shortLabel: "Phục vụ",
      emoji: "🍽️",
      icon: TruckIcon,
      gradient: "from-purple-400 via-purple-500 to-fuchsia-600",
      light: "from-purple-50 to-fuchsia-50",
      border: "border-purple-200",
      text: "text-purple-700",
      dot: "bg-purple-500",
      description: "Đơn hàng đã được phục vụ khách",
      nextStatus: "PAID",
      nextActionLabel: "Thanh toán",
      nextActionColor: "from-green-500 to-green-600",
    },
    PAID: {
      value: "PAID",
      label: "Đã thanh toán",
      shortLabel: "Đã TT",
      emoji: "💰",
      icon: BanknotesIcon,
      gradient: "from-green-400 via-green-500 to-emerald-600",
      light: "from-green-50 to-emerald-50",
      border: "border-green-200",
      text: "text-green-700",
      dot: "bg-green-500",
      description: "Đơn hàng đã được thanh toán thành công",
      nextStatus: null,
      nextActionLabel: null,
      nextActionColor: null,
    },
    CANCELLED: {
      value: "CANCELLED",
      label: "Đã hủy",
      shortLabel: "Hủy",
      emoji: "❌",
      icon: XCircleIcon,
      gradient: "from-red-400 via-red-500 to-rose-600",
      light: "from-red-50 to-rose-50",
      border: "border-red-200",
      text: "text-red-700",
      dot: "bg-red-500",
      description: "Đơn hàng đã bị hủy",
      nextStatus: null,
      nextActionLabel: null,
      nextActionColor: null,
    },
  };
  
  export const ORDER_STATUS_OPTIONS = Object.values(ORDER_STATUSES);
  
  export const getStatusConfig = (status) =>
    ORDER_STATUSES[status] || ORDER_STATUSES.PENDING;
  
  /**
   * Filter options cho select
   */
  export const ORDER_FILTER_OPTIONS = [
    { value: "ALL", label: "🔲 Tất cả trạng thái" },
    ...ORDER_STATUS_OPTIONS.map((s) => ({
      value: s.value,
      label: `${s.emoji} ${s.label}`,
    })),
  ];
  
  /**
   * Kanban columns — dùng chung cho OrderKanban
   */
  export const KANBAN_COLUMNS = [
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "SERVED",
    "PAID",
    "CANCELLED",
  ].map((key) => ORDER_STATUSES[key]);