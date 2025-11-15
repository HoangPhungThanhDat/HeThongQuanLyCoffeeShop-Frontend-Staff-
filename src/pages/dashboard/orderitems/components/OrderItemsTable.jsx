import { Typography, Tooltip } from "@material-tailwind/react";
import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

export function OrderItemsTable({ orderItems, onShow, onEdit, onDelete }) {
  const formatCurrency = (value) => {
    if (!value) return "0 đ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="w-full max-w-7xl bg-white shadow-lg rounded-3xl overflow-hidden border border-gray-100">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gradient-to-r from-amber-50 to-orange-50">
              {["STT", "Đơn hàng", "Sản phẩm", "Số lượng", "Đơn giá", "Thành tiền", "Hành Động"].map((el) => (
                <th
                  key={el}
                  className={`py-4 px-6 ${
                    el === "Hành Động" ? "text-center" : "text-left"
                  }`}
                >
                  <Typography variant="small" className="text-xs font-bold uppercase text-gray-700 tracking-wider">
                    {el}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orderItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-6xl mb-4 opacity-20">🍽️</div>
                    <Typography className="text-sm text-gray-400 font-medium">
                      Chưa có order item nào
                    </Typography>
                  </div>
                </td>
              </tr>
            ) : (
              orderItems.map((item, index) => {
                const className = `py-4 px-6 ${
                  index === orderItems.length - 1 ? "" : "border-b border-gray-100"
                }`;

                return (
                  <tr 
                    key={item.id} 
                    className="hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 transition-all duration-200"
                  >
                    <td className={className}>
                      <Typography className="text-sm font-bold text-gray-600">
                        {index + 1}
                      </Typography>
                    </td>
                    
                    {/* MÃ ĐƠN HÀNG */}
                    <td className={className}>
                      <Typography className="text-sm font-bold text-blue-600 font-mono">
                        #{item.orderId}
                      </Typography>
                    </td>
                    
                    {/* TÊN SẢN PHẨM */}
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">☕</span>
                        <Typography className="text-sm font-semibold text-gray-800">
                          {item.productName || `#${item.productId}`}
                        </Typography>
                      </div>
                    </td>
                    
                    {/* SỐ LƯỢNG */}
                    <td className={className}>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                        <span className="text-sm">×</span>
                        <Typography className="text-sm font-bold text-blue-700">
                          {item.quantity}
                        </Typography>
                      </div>
                    </td>
                    
                    {/* ĐƠN GIÁ */}
                    <td className={className}>
                      <Typography className="text-sm font-semibold text-gray-700">
                        {formatCurrency(item.price)}
                      </Typography>
                    </td>
                    
                    {/* THÀNH TIỀN */}
                    <td className={className}>
                      <Typography className="text-sm font-bold text-amber-700">
                        {formatCurrency(item.subtotal)}
                      </Typography>
                    </td>
                    
                    {/* HÀNH ĐỘNG */}
                    <td className={`${className} text-center`}>
                      <div className="flex justify-center gap-2">
                        {/* Xem */}
                        <Tooltip content="Xem chi tiết" placement="top">
                          <button
                            onClick={() => onShow(item)}
                            className="group relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#5d3a2f] shadow-md hover:shadow-xl hover:shadow-[#8B5E3C]/30 transition-all duration-300 hover:scale-110 active:scale-95"
                          >
                            <EyeIcon className="w-5 h-5 text-white" />
                          </button>
                        </Tooltip>

                        {/* Sửa */}
                        <Tooltip content="Chỉnh sửa" placement="top">
                          <button
                            onClick={() => onEdit(item)}
                            className="group relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#5d3a2f] shadow-md hover:shadow-xl hover:shadow-[#8B5E3C]/30 transition-all duration-300 hover:scale-110 active:scale-95"
                          >
                            <PencilIcon className="w-5 h-5 text-white" />
                          </button>
                        </Tooltip>

                        {/* Xóa */}
                        <Tooltip content="Xóa order item" placement="top">
                          <button
                            onClick={() => onDelete(item.id)}
                            className="group relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-110 active:scale-95"
                          >
                            <TrashIcon className="w-5 h-5 text-white" />
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

export default OrderItemsTable;