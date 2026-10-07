import { Typography, Tooltip } from "@material-tailwind/react";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CubeIcon,
  ShoppingCartIcon,
  BanknotesIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export function OrderItemsTable({ orderItems = [], onShow, onEdit, onDelete }) {
  // ⭐ Guard: orderItems có thể undefined
  const safeItems = Array.isArray(orderItems) ? orderItems : [];

  const formatCurrency = (value) => {
    if (!value) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCompactPrice = (price) => {
    if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M`;
    if (price >= 1_000) return `${(price / 1_000).toFixed(0)}K`;
    return price.toString();
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
            {/* ⭐ colgroup viết liền, không whitespace */}
            <colgroup><col className="w-[5%]" /><col className="w-[9%]" /><col className="w-[12%]" /><col className="w-[28%]" /><col className="w-[9%]" /><col className="w-[12%]" /><col className="w-[13%]" /><col className="w-[12%]" /></colgroup>

            <thead>
              <tr className="bg-gradient-to-r from-[#faf6f1] via-[#f5ede3] to-[#faf6f1] border-b-2 border-amber-100">
                {[
                  "STT",
                  "Mã Item",
                  "Đơn Hàng",
                  "Sản Phẩm",
                  "SL",
                  "Đơn Giá",
                  "Thành Tiền",
                  "Hành Động",
                ].map((el) => (
                  <th
                    key={el}
                    className={`py-4 px-3 lg:px-5 ${
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
              {safeItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-16">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center mb-4">
                        <span className="text-5xl">🍽️</span>
                      </div>
                      <Typography className="text-base text-[#8B5E3C] font-bold mb-1">
                        Chưa có item nào
                      </Typography>
                      <Typography className="text-xs text-gray-400">
                        Các món trong đơn hàng sẽ hiển thị ở đây
                      </Typography>
                    </div>
                  </td>
                </tr>
              ) : (
                safeItems.map((item, index) => {
                  const className = `py-4 px-3 lg:px-5 align-middle ${
                    index === safeItems.length - 1
                      ? ""
                      : "border-b border-amber-50"
                  }`;

                  return (
                    <motion.tr
                      key={item.id}
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

                      {/* Mã Item */}
                      <td className={className}>
                        <div className="flex items-center gap-1.5">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-sm">
                            <HashtagIcon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                          </div>
                          <Typography className="text-sm font-extrabold text-[#8B5E3C] whitespace-nowrap">
                            {item.id}
                          </Typography>
                        </div>
                      </td>

                      {/* Đơn hàng */}
                      <td className={className}>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 whitespace-nowrap">
                          <ShoppingCartIcon className="w-3 h-3 text-blue-600" strokeWidth={2.5} />
                          <Typography className="text-xs font-extrabold text-blue-700 truncate">
                            #{item.orderId}
                          </Typography>
                        </span>
                      </td>

                      {/* Sản phẩm */}
                      <td className={`${className} min-w-0`}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center group-hover:from-[#8B5E3C] group-hover:to-[#6d4c41] transition-all duration-300 shadow-sm">
                            <CubeIcon className="w-4 h-4 text-[#8B5E3C] group-hover:text-white transition-colors" strokeWidth={2.2} />
                          </div>
                          <div className="min-w-0">
                            <Typography className="text-sm font-bold text-[#4e342e] group-hover:text-[#8B5E3C] transition-colors truncate">
                              {item.productName || `SP #${item.productId}`}
                            </Typography>
                            <Typography className="text-[10px] text-gray-400">
                              ID: #{item.productId || "N/A"}
                            </Typography>
                          </div>
                        </div>
                      </td>

                      {/* Số lượng */}
                      <td className={className}>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                          <span className="text-sm">×</span>
                          <Typography className="text-sm font-extrabold text-blue-700">
                            {item.quantity}
                          </Typography>
                        </div>
                      </td>

                      {/* Đơn giá */}
                      <td className={className}>
                        <div className="flex flex-col">
                          <Typography className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                            {formatCurrency(item.price)}
                          </Typography>
                          <Typography className="text-[9px] text-gray-400 font-bold">
                            {formatCompactPrice(item.price)}₫
                          </Typography>
                        </div>
                      </td>

                      {/* Thành tiền */}
                      <td className={className}>
                        <Typography className="text-sm font-extrabold text-[#8B5E3C] whitespace-nowrap">
                          {formatCurrency(item.subtotal)}
                        </Typography>
                      </td>

                      {/* Hành động */}
                      <td className={`${className} text-center`}>
                        <div className="flex justify-center gap-1.5">
                          <Tooltip content="Xem chi tiết" placement="top">
                            <button
                              onClick={() => onShow?.(item)}
                              className="group/btn inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border-2 border-[#8B5E3C]/20 hover:border-[#8B5E3C] hover:bg-gradient-to-br hover:from-[#8B5E3C] hover:to-[#6d4c41] shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <EyeIcon className="w-4 h-4 text-[#8B5E3C] group-hover/btn:text-white transition-colors" strokeWidth={2.2} />
                            </button>
                          </Tooltip>

                          <Tooltip content="Chỉnh sửa" placement="top">
                            <button
                              onClick={() => onEdit?.(item)}
                              className="group/btn inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border-2 border-amber-500/30 hover:border-amber-500 hover:bg-gradient-to-br hover:from-amber-500 hover:to-amber-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <PencilIcon className="w-4 h-4 text-amber-600 group-hover/btn:text-white transition-colors" strokeWidth={2.2} />
                            </button>
                          </Tooltip>

                          <Tooltip content="Xóa item" placement="top">
                            <button
                              onClick={() => onDelete?.(item.id)}
                              className="group/btn inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border-2 border-red-300 hover:border-red-500 hover:bg-gradient-to-br hover:from-red-500 hover:to-red-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <TrashIcon className="w-4 h-4 text-red-500 group-hover/btn:text-white transition-colors" strokeWidth={2.2} />
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
        {safeItems.length > 0 && (
          <div className="px-4 lg:px-6 py-4 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5] border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-2">
            <Typography className="text-xs font-semibold text-[#6d4c41]">
              Tổng cộng:{" "}
              <span className="font-bold text-[#8B5E3C]">{safeItems.length}</span>{" "}
              items
            </Typography>
            <div className="flex items-center gap-4 text-xs flex-wrap justify-center">
              <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
                <CubeIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                {safeItems.reduce((s, i) => s + (i.quantity || 0), 0)} phần
              </span>
              <span className="flex items-center gap-1.5 text-green-600 font-semibold">
                <BanknotesIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                {new Intl.NumberFormat("vi-VN").format(
                  safeItems.reduce((s, i) => s + (i.subtotal || 0), 0)
                )}{" "}
                ₫
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default OrderItemsTable;