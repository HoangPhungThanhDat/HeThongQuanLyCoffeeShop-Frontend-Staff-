import { useState } from "react";
import { Tooltip } from "@material-tailwind/react";

import {
  Typography,
  IconButton,
  Button,
} from "@material-tailwind/react";

import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import "animate.css";

export function OrderTable({ orders, onShow, onEdit, onDelete, onUpdateStatus }) {

  // === Hàm định dạng tiền VND ===
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // === Hàm lấy nhãn và màu trạng thái ===
  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING":
        return "Đang chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "PREPARING":
        return "Đang chuẩn bị";
      case "SERVED":
        return "Đã phục vụ";
      case "PAID":
        return "Đã thanh toán";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  // Tùy chọn: gán màu riêng cho từng trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";
      case "CONFIRMED":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "PREPARING":
        return "bg-orange-50 text-orange-600 border-orange-200";
      case "SERVED":
        return "bg-purple-50 text-purple-600 border-purple-200";
      case "PAID":
        return "bg-green-50 text-green-600 border-green-200";
      case "CANCELLED":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  // State để tracking cập nhật đang xử lý
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // === Render nút action cho từng trạng thái ===
  const renderStatusButton = (order) => {
    const { status, id } = order;
    const isUpdating = updatingOrderId === id;

    // Nếu đã hủy hoặc đã thanh toán -> chỉ hiển thị badge
    if (status === "CANCELLED" || status === "PAID") {
      return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getStatusColor(status)}`}>
          <span className="text-xs font-semibold">{getStatusLabel(status)}</span>
        </div>
      );
    }

    // Hiển thị nút tiếp theo theo workflow
    return (
      <div className="flex flex-col gap-2">
        {/* Hiển thị trạng thái hiện tại */}
        <div className={`inline-flex items-center justify-center px-3 py-1 rounded-lg border ${getStatusColor(status)}`}>
          <span className="text-xs font-semibold">{getStatusLabel(status)}</span>
        </div>

        {/* Nút chuyển sang trạng thái tiếp theo */}
        {status === "PENDING" && (
          <Button
            size="sm"
            disabled={isUpdating}
            className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs py-1.5 px-3 rounded-lg shadow-sm transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1 ${
              isUpdating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => handleStatusUpdate(id, "CONFIRMED")}
          >
            {isUpdating ? (
              <>
                <span className="animate-spin">⏳</span> Đang xử lý...
              </>
            ) : (
              <>
                <span>✓</span> Xác nhận
              </>
            )}
          </Button>
        )}

        {status === "CONFIRMED" && (
          <Button
            size="sm"
            disabled={isUpdating}
            className={`bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs py-1.5 px-3 rounded-lg shadow-sm transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1 ${
              isUpdating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => handleStatusUpdate(id, "PREPARING")}
          >
            {isUpdating ? (
              <>
                <span className="animate-spin">⏳</span> Đang xử lý...
              </>
            ) : (
              <>
                <span>🍳</span> Chuẩn bị
              </>
            )}
          </Button>
        )}

        {status === "PREPARING" && (
          <Button
            size="sm"
            disabled={isUpdating}
            className={`bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-xs py-1.5 px-3 rounded-lg shadow-sm transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1 ${
              isUpdating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => handleStatusUpdate(id, "SERVED")}
          >
            {isUpdating ? (
              <>
                <span className="animate-spin">⏳</span> Đang xử lý...
              </>
            ) : (
              <>
                <span>✓</span> Phục vụ
              </>
            )}
          </Button>
        )}

        {status === "SERVED" && (
          <Button
            size="sm"
            disabled={isUpdating}
            className={`bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs py-1.5 px-3 rounded-lg shadow-sm transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1 ${
              isUpdating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => handleStatusUpdate(id, "PAID")}
          >
            {isUpdating ? (
              <>
                <span className="animate-spin">⏳</span> Đang xử lý...
              </>
            ) : (
              <>
                <span>💰</span> Thanh toán
              </>
            )}
          </Button>
        )}

        {/* Nút hủy (luôn hiển thị trừ khi đã served/paid) */}
        {status !== "SERVED" && (
          <Button
            size="sm"
            disabled={isUpdating}
            className={`bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white text-xs py-1 px-3 rounded-lg shadow-sm transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1 ${
              isUpdating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => handleStatusUpdate(id, "CANCELLED")}
          >
            {isUpdating ? (
              <>
                <span className="animate-spin">⏳</span>
              </>
            ) : (
              <>
                <span>✗</span> Hủy
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

  // === Handler cập nhật trạng thái với loading state ===
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    
    try {
      // Gọi function từ parent component
      await onUpdateStatus(orderId, newStatus);
      
      console.log(`✅ Đã cập nhật đơn #${orderId} sang trạng thái: ${newStatus}`);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái:", error);
    } finally {
      // Reset loading state sau 500ms để tránh flicker
      setTimeout(() => {
        setUpdatingOrderId(null);
      }, 500);
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="w-full max-w-7xl bg-white shadow-lg rounded-3xl overflow-hidden border border-gray-100">
        <table className="w-full table-auto text-brown-800">
          <thead>
            <tr className="bg-gradient-to-r from-amber-50 to-orange-50">
              {[
                "STT",
                "#Mã đơn hàng",
                "Bàn",
                "Khuyến Mãi",
                "Tổng Tiền",
                "Trạng Thái & Hành Động",
                "Ghi Chú",
                "Ngày Tạo",
                "Thao Tác",
              ].map((el) => (
                <th
                  key={el}
                  className={`py-4 px-5 ${
                    el === "Thao Tác" ? "text-center" : "text-left"
                  }`}
                >
                  <Typography
                    variant="small"
                    className="text-xs font-bold uppercase text-gray-700 tracking-wider"
                  >
                    {el}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-12">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-6xl mb-4 opacity-20">📋</div>
                    <Typography className="text-sm text-gray-400 font-medium">
                      Chưa có đơn hàng nào
                    </Typography>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr
                  key={order.id}
                  className="hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 transition-all duration-200 border-b border-gray-100 last:border-0"
                >
                  <td className="py-4 px-5 text-sm font-bold text-gray-600">
                    {index + 1}
                  </td>
                  <td className="py-4 px-5 font-mono text-sm text-gray-700 font-semibold">
                    #{order.id}
                  </td>
                  <td className="py-4 px-5 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🪑</span>
                      <span className="font-semibold text-gray-800">
                        {order.table?.number || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-sm text-gray-600">
                    {order.promotion?.name || "Không có"}
                  </td>
                  <td className="py-4 px-5 font-bold text-amber-700 text-sm">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="py-4 px-5">
                    {renderStatusButton(order)}
                  </td>
                  <td className="py-4 px-5 text-sm text-gray-600">
                    {order.notes || "-"}
                  </td>
                  <td className="py-4 px-5 text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="text-center py-4 px-5">
                    <div className="flex justify-center gap-2">
                      {/* Xem */}
                      <Tooltip content="Xem chi tiết" placement="top">
                        <button
                          onClick={() => onShow(order)}
                          className="group relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#5d3a2f] shadow-md hover:shadow-xl hover:shadow-[#8B5E3C]/30 transition-all duration-300 hover:scale-110 active:scale-95"
                        >
                          <EyeIcon className="w-5 h-5 text-white" />
                        </button>
                      </Tooltip>

                      {/* Sửa */}
                      <Tooltip content="Chỉnh sửa" placement="top">
                        <button
                          onClick={() => onEdit(order)}
                          className="group relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#5d3a2f] shadow-md hover:shadow-xl hover:shadow-[#8B5E3C]/30 transition-all duration-300 hover:scale-110 active:scale-95"
                        >
                          <PencilIcon className="w-5 h-5 text-white" />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderTable;