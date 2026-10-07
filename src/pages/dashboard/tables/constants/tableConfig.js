
import {
    CheckCircleIcon,
    UserGroupIcon,
    ClockIcon,
  } from "@heroicons/react/24/outline";
  
  /**
   * Config cho status của bàn — Tông Cafe ấm (Staff variant)
   */
  export const TABLE_STATUSES = {
    FREE: {
      value: "FREE",
      label: "Trống",
      shortLabel: "Trống",
      sublabel: "Sẵn sàng phục vụ",
      emoji: "☕",
      icon: CheckCircleIcon,
      gradient: "from-[#C89F77] via-[#B8895E] to-[#a4714b]",
      light: "from-[#faf6f1] to-[#f5ede3]",
      border: "border-[#C89F77]/50",
      text: "text-[#6d4c41]",
      dot: "bg-[#C89F77]",
      wood: "from-[#8B5E3C] via-[#a4714b] to-[#C89F77]",
      // Cho stats card
      statColor: "brown",
      statGradient: "from-[#C89F77] to-[#a4714b]",
      statShadow: "shadow-[#C89F77]/30",
      statBorder: "border-[#C89F77]/30 hover:border-[#C89F77]",
      statBadge: "bg-[#faf6f1] border-[#C89F77]/30 text-[#6d4c41]",
      statText: "text-[#8B5E3C]",
    },
    OCCUPIED: {
      value: "OCCUPIED",
      label: "Đang dùng",
      shortLabel: "Đang dùng",
      sublabel: "Có khách đang ngồi",
      emoji: "🫖",
      icon: UserGroupIcon,
      gradient: "from-[#4e342e] via-[#5d3a2f] to-[#6d4c41]",
      light: "from-[#f5ede3] to-[#e8d9c7]",
      border: "border-[#8B5E3C]/60",
      text: "text-[#4e342e]",
      dot: "bg-[#4e342e]",
      wood: "from-[#3a2620] via-[#4e342e] to-[#6d4c41]",
      statColor: "brown-dark",
      statGradient: "from-[#4e342e] to-[#6d4c41]",
      statShadow: "shadow-[#4e342e]/30",
      statBorder: "border-[#4e342e]/20 hover:border-[#4e342e]",
      statBadge: "bg-[#f5ede3] border-[#4e342e]/30 text-[#4e342e]",
      statText: "text-[#4e342e]",
    },
    RESERVED: {
      value: "RESERVED",
      label: "Đã đặt",
      shortLabel: "Đã đặt",
      sublabel: "Khách đã đặt trước",
      emoji: "🕰️",
      icon: ClockIcon,
      gradient: "from-[#D4A574] via-[#c99862] to-[#b8895e]",
      light: "from-[#faf0e0] to-[#f5e6cc]",
      border: "border-[#D4A574]/60",
      text: "text-[#8B5E3C]",
      dot: "bg-[#D4A574]",
      wood: "from-[#C89F77] via-[#D4A574] to-[#c99862]",
      statColor: "gold",
      statGradient: "from-[#D4A574] to-[#c99862]",
      statShadow: "shadow-[#D4A574]/30",
      statBorder: "border-[#D4A574]/40 hover:border-[#D4A574]",
      statBadge: "bg-[#faf0e0] border-[#D4A574]/40 text-[#8B5E3C]",
      statText: "text-[#8B5E3C]",
    },
  };
  
  export const TABLE_STATUS_OPTIONS = Object.values(TABLE_STATUSES);
  
  export const getStatusConfig = (status) =>
    TABLE_STATUSES[status] || TABLE_STATUSES.FREE;
  
  /**
   * Filter options
   */
  export const TABLE_FILTER_OPTIONS = [
    { value: "ALL", label: "🔲 Tất cả trạng thái" },
    ...TABLE_STATUS_OPTIONS.map((s) => ({
      value: s.value,
      label: `${s.emoji} ${s.label}`,
    })),
  ];