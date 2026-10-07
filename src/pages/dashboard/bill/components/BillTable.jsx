import { Typography, Tooltip } from "@material-tailwind/react";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  ReceiptPercentIcon,
  BanknotesIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export function BillTable({ bills, onShow, onEdit, onDelete }) {
  const formatCurrency = (amount) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCompactPrice = (price) => {
    if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M`;
    if (price >= 1_000) return `${(price / 1_000).toFixed(0)}K`;
    return price.toString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==================== METHOD CONFIG ====================
  const getMethodConfig = (method) => {
    switch (method) {
      case "CASH":
        return {
          label: "Tiền mặt",
          emoji: "💵",
          icon: BanknotesIcon,
          bg: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700",
        };
      case "CARD":
        return {
          label: "Thẻ",
          emoji: "💳",
          icon: CreditCardIcon,
          bg: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700",
        };
      case "MOBILE":
        return {
          label: "Ví điện tử",
          emoji: "📱",
          icon: DevicePhoneMobileIcon,
          bg: "bg-gradient-to-r from-purple-50 to-fuchsia-50 border-purple-200 text-purple-700",
        };
      default:
        return {
          label: method || "N/A",
          emoji: "💳",
          icon: CreditCardIcon,
          bg: "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-700",
        };
    }
  };

  // ==================== STATUS CONFIG ====================
  const getStatusConfig = (status) => {
    switch (status) {
      case "COMPLETED":
        return {
          label: "Đã thanh toán",
          icon: CheckCircleIcon,
          bg: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700",
          dot: "bg-green-500",
        };
      case "PENDING":
        return {
          label: "Chờ thanh toán",
          icon: ClockIcon,
          bg: "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-700",
          dot: "bg-amber-500",
        };
      case "FAILED":
        return {
          label: "Thất bại",
          icon: XCircleIcon,
          bg: "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700",
          dot: "bg-red-500",
        };
      default:
        return {
          label: status || "N/A",
          icon: ClockIcon,
          bg: "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-700",
          dot: "bg-gray-500",
        };
    }
  };

  const getOrderId = (bill) => {
    if (bill.order && bill.order.id) return bill.order.id;
    if (bill.orderId) return bill.orderId;
    return "N/A";
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-white overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full table-fixed min-w-[1100px]">
            <colgroup>
              <col className="w-[5%]" />   {/* STT */}
              <col className="w-[10%]" />  {/* Mã HĐ */}
              <col className="w-[10%]" />  {/* Đơn hàng */}
              <col className="w-[12%]" />  {/* Tổng tiền */}
              <col className="w-[13%]" />  {/* Phương thức */}
              <col className="w-[13%]" />  {/* Trạng thái */}
              <col className="w-[13%]" />  {/* Ngày xuất */}
              <col className="w-[12%]" />  {/* Ghi chú */}
              <col className="w-[12%]" />  {/* Hành động */}
            </colgroup>

            <thead>
              <tr className="bg-gradient-to-r from-[#faf6f1] via-[#f5ede3] to-[#faf6f1] border-b-2 border-amber-100">
                {[
                  "STT",
                  "Mã HĐ",
                  "Đơn Hàng",
                  "Tổng Tiền",
                  "Phương Thức",
                  "Trạng Thái",
                  "Ngày Xuất",
                  "Ghi Chú",
                  "Hành Động",
                ].map((el) => (
                  <th
                    key={el}
                    className={`py-4 px-3 lg:px-4 ${
                      el === "Hành Động" ? "text-center" : "text-left"
                    }`}
                  >
                    <Typography className="text-[10px] font-extrabold uppercase text-[#6d4c41] tracking-wider whitespace-nowrap">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {bills.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-16">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center mb-4">
                        <span className="text-5xl">🧾</span>
                      </div>
                      <Typography className="text-base text-[#8B5E3C] font-bold mb-1">
                        Chưa có hóa đơn nào
                      </Typography>
                      <Typography className="text-xs text-gray-400">
                        Hóa đơn mới sẽ xuất hiện ở đây
                      </Typography>
                    </div>
                  </td>
                </tr>
              ) : (
                bills.map((bill, index) => {
                  const className = `py-4 px-3 lg:px-4 align-middle ${
                    index === bills.length - 1
                      ? ""
                      : "border-b border-amber-50"
                  }`;
                  const methodCfg = getMethodConfig(bill.paymentMethod);
                  const statusCfg = getStatusConfig(bill.paymentStatus);
                  const StatusIcon = statusCfg.icon;

                  return (
                    <motion.tr
                      key={bill.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
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

                      {/* Mã HĐ */}
                      <td className={className}>
                        <div className="flex items-center gap-1.5">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-sm">
                            <HashtagIcon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                          </div>
                          <Typography className="text-sm font-extrabold text-[#8B5E3C] whitespace-nowrap">
                            {bill.id}
                          </Typography>
                        </div>
                      </td>

                      {/* Đơn hàng */}
                      <td className={className}>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 whitespace-nowrap">
                          <ReceiptPercentIcon className="w-3 h-3 text-blue-600" strokeWidth={2.5} />
                          <Typography className="text-xs font-extrabold text-blue-700 truncate">
                            #{getOrderId(bill)}
                          </Typography>
                        </span>
                      </td>

                      {/* Tổng tiền */}
                      <td className={className}>
                        <div className="flex flex-col">
                          <Typography className="text-sm font-extrabold text-[#8B5E3C] whitespace-nowrap">
                            {formatCurrency(bill.totalAmount)}
                          </Typography>
                          <Typography className="text-[9px] text-gray-400 font-bold">
                            {formatCompactPrice(bill.totalAmount)}₫
                          </Typography>
                        </div>
                      </td>

                      {/* Phương thức */}
                      <td className={className}>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap ${methodCfg.bg}`}
                        >
                          <span className="text-sm">{methodCfg.emoji}</span>
                          {methodCfg.label}
                        </span>
                      </td>

                      {/* Trạng thái */}
                      <td className={className}>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap ${statusCfg.bg}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                          {statusCfg.label}
                        </span>
                      </td>

                      {/* Ngày xuất */}
                      <td className={className}>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1">
                            <CalendarDaysIcon className="w-3 h-3 text-[#8B5E3C]" strokeWidth={2.5} />
                            <Typography className="text-[10px] font-bold text-gray-700">
                              {new Date(bill.issuedAt).toLocaleDateString("vi-VN")}
                            </Typography>
                          </div>
                          <div className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3 text-gray-400" strokeWidth={2.5} />
                            <Typography className="text-[10px] font-medium text-gray-500">
                              {new Date(bill.issuedAt).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Typography>
                          </div>
                        </div>
                      </td>

                      {/* Ghi chú */}
                      <td className={`${className} min-w-0`}>
                        {bill.notes ? (
                          <div className="flex items-start gap-1.5">
                            <DocumentTextIcon
                              className="w-3.5 h-3.5 text-[#8B5E3C] flex-shrink-0 mt-0.5"
                              strokeWidth={2.2}
                            />
                            <Tooltip content={bill.notes} placement="top">
                              <Typography className="text-[10px] text-gray-600 truncate">
                                {bill.notes}
                              </Typography>
                            </Tooltip>
                          </div>
                        ) : (
                          <Typography className="text-[10px] text-gray-400 italic">
                            —
                          </Typography>
                        )}
                      </td>

                      {/* Hành động */}
                      <td className={`${className} text-center`}>
                        <div className="flex justify-center gap-1.5">
                          {/* Xuất hóa đơn */}
                          <Tooltip content="Xuất hóa đơn" placement="top">
                            <button
                              onClick={() => onShow(bill)}
                              className="group/btn inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border-2 border-blue-300 hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <DocumentArrowDownIcon className="w-4 h-4 text-blue-500 group-hover/btn:text-white transition-colors" strokeWidth={2.5} />
                            </button>
                          </Tooltip>

                          {/* Xem chi tiết */}
                          <Tooltip content="Xem chi tiết" placement="top">
                            <button
                              onClick={() => onShow(bill)}
                              className="group/btn inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border-2 border-[#8B5E3C]/20 hover:border-[#8B5E3C] hover:bg-gradient-to-br hover:from-[#8B5E3C] hover:to-[#6d4c41] shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <EyeIcon className="w-4 h-4 text-[#8B5E3C] group-hover/btn:text-white transition-colors" strokeWidth={2.2} />
                            </button>
                          </Tooltip>

                          {/* Chỉnh sửa */}
                          <Tooltip content="Chỉnh sửa" placement="top">
                            <button
                              onClick={() => onEdit(bill)}
                              className="group/btn inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border-2 border-amber-500/30 hover:border-amber-500 hover:bg-gradient-to-br hover:from-amber-500 hover:to-amber-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <PencilIcon className="w-4 h-4 text-amber-600 group-hover/btn:text-white transition-colors" strokeWidth={2.2} />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Stats */}
        {bills.length > 0 && (
          <div className="px-4 lg:px-6 py-4 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5] border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-2">
            <Typography className="text-xs font-semibold text-[#6d4c41]">
              Tổng cộng:{" "}
              <span className="font-bold text-[#8B5E3C]">{bills.length}</span>{" "}
              hóa đơn
            </Typography>
            <div className="flex items-center gap-4 text-xs flex-wrap justify-center">
              <span className="flex items-center gap-1.5 text-green-600 font-semibold">
                <CheckCircleIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                {bills.filter((b) => b.paymentStatus === "COMPLETED").length} Đã TT
              </span>
              <span className="flex items-center gap-1.5 text-amber-600 font-semibold">
                <ClockIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                {bills.filter((b) => b.paymentStatus === "PENDING").length} Chờ
              </span>
              <span className="flex items-center gap-1.5 text-red-600 font-semibold">
                <XCircleIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                {bills.filter((b) => b.paymentStatus === "FAILED").length} Thất bại
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default BillTable;