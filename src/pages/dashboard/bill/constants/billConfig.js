
import {
    BanknotesIcon,
    CreditCardIcon,
    DevicePhoneMobileIcon,
    ClockIcon,
    CheckBadgeIcon,
    XCircleIcon,
  } from "@heroicons/react/24/outline";
  
  /**
   * Config cho phương thức thanh toán
   */
  export const METHOD_CONFIG = {
    CASH: {
      value: "CASH",
      label: "Tiền mặt",
      emoji: "💵",
      icon: BanknotesIcon,
      gradient: "from-green-400 via-green-500 to-emerald-600",
      light: "from-green-50 to-emerald-50",
      border: "border-green-200",
      text: "text-green-700",
      dot: "bg-green-500",
    },
    CARD: {
      value: "CARD",
      label: "Thẻ",
      emoji: "💳",
      icon: CreditCardIcon,
      gradient: "from-blue-400 via-blue-500 to-indigo-600",
      light: "from-blue-50 to-indigo-50",
      border: "border-blue-200",
      text: "text-blue-700",
      dot: "bg-blue-500",
    },
    MOBILE: {
      value: "MOBILE",
      label: "Ví điện tử",
      emoji: "📱",
      icon: DevicePhoneMobileIcon,
      gradient: "from-purple-400 via-purple-500 to-fuchsia-600",
      light: "from-purple-50 to-fuchsia-50",
      border: "border-purple-200",
      text: "text-purple-700",
      dot: "bg-purple-500",
    },
  };
  
  export const METHOD_OPTIONS = Object.values(METHOD_CONFIG);
  
  export const getMethodConfig = (method) =>
    METHOD_CONFIG[method] || METHOD_CONFIG.CASH;
  
  /**
   * Config cho trạng thái thanh toán
   */
  export const STATUS_CONFIG = {
    PENDING: {
      value: "PENDING",
      label: "Chờ thanh toán",
      emoji: "⏳",
      icon: ClockIcon,
      gradient: "from-amber-400 via-amber-500 to-orange-500",
      light: "from-amber-50 to-yellow-50",
      border: "border-amber-200",
      text: "text-amber-700",
      dot: "bg-amber-500",
      description: "Hóa đơn đang chờ được thanh toán",
    },
    COMPLETED: {
      value: "COMPLETED",
      label: "Đã thanh toán",
      emoji: "✅",
      icon: CheckBadgeIcon,
      gradient: "from-green-400 via-green-500 to-emerald-600",
      light: "from-green-50 to-emerald-50",
      border: "border-green-200",
      text: "text-green-700",
      dot: "bg-green-500",
      description: "Hóa đơn đã được thanh toán thành công",
    },
    FAILED: {
      value: "FAILED",
      label: "Thất bại",
      emoji: "❌",
      icon: XCircleIcon,
      gradient: "from-red-400 via-red-500 to-rose-600",
      light: "from-red-50 to-rose-50",
      border: "border-red-200",
      text: "text-red-700",
      dot: "bg-red-500",
      description: "Thanh toán không thành công",
    },
  };
  
  export const STATUS_OPTIONS = Object.values(STATUS_CONFIG);
  
  export const getStatusConfig = (status) =>
    STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  
  /**
   * Filter options
   */
  export const BILL_STATUS_FILTER_OPTIONS = [
    { value: "ALL", label: "🧾 Tất cả TT" },
    ...STATUS_OPTIONS.map((s) => ({
      value: s.value,
      label: `${s.emoji} ${s.label}`,
    })),
  ];
  
  export const BILL_METHOD_FILTER_OPTIONS = [
    { value: "ALL", label: "💳 Tất cả PT" },
    ...METHOD_OPTIONS.map((m) => ({
      value: m.value,
      label: `${m.emoji} ${m.label}`,
    })),
  ];