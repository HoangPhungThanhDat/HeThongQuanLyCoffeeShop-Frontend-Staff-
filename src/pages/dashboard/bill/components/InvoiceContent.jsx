// src/pages/dashboard/bill/components/InvoiceContent.jsx
import { forwardRef } from "react";
import { formatPrice, formatDate } from "../utils/formatters";
import { getMethodConfig, getStatusConfig } from "../constants/billConfig";

/**
 * ⭐ Dùng forwardRef để nhận ref từ component cha
 * Cần thiết cho React 18 (React 19 không cần nhưng vẫn OK)
 */
export const InvoiceContent = forwardRef(function InvoiceContent(
  { bill, orderItems = [], loadingItems = false, qrCodeDataUrl = "" },
  ref
) {
  if (!bill) return null;

  const methodConfig = getMethodConfig(bill.paymentMethod);
  const statusConfig = getStatusConfig(bill.paymentStatus);

  return (
    <div
      ref={ref}
      className="bg-white p-6 w-full max-w-2xl shadow-lg rounded text-sm"
    >
      {/* Header */}
      <div className="text-center mb-4 border-b-2 border-[#8B5E3C] pb-3">
        <h1 className="text-xl font-bold text-[#8B5E3C]">COFFEE SHOP</h1>
        <p className="text-xs text-gray-600">
          Địa chỉ: 85 Phan Kế Bính, P.Đa Kao, Quận 1, TP.HCM
        </p>
        <p className="text-xs text-gray-600">Điện thoại: 0123456789</p>
      </div>

      <h2 className="text-lg font-bold text-center mb-4 text-[#8B5E3C]">
        HÓA ĐƠN
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        <div>
          <p>
            <strong>Mã hóa đơn:</strong> {bill.id}
          </p>
          <p>
            <strong>Mã đơn hàng:</strong> #{bill.orderId || "N/A"}
          </p>
        </div>
        <div className="text-right">
          <p>
            <strong>Ngày:</strong> {formatDate(bill.issuedAt)}
          </p>
          <p>
            <strong>Giờ:</strong>{" "}
            {bill.issuedAt
              ? new Date(bill.issuedAt).toLocaleTimeString("vi-VN")
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <table className="w-full border-collapse mb-4 text-xs">
        <thead>
          <tr className="bg-[#8B5E3C] text-white">
            <th className="border border-gray-300 p-1 text-left">Sản phẩm</th>
            <th className="border border-gray-300 p-1 text-center">SL</th>
            <th className="border border-gray-300 p-1 text-right">Giá</th>
            <th className="border border-gray-300 p-1 text-right">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {loadingItems ? (
            <tr>
              <td colSpan="4" className="text-center text-gray-500 border p-1">
                Đang tải...
              </td>
            </tr>
          ) : orderItems.length > 0 ? (
            orderItems.map((item, i) => (
              <tr key={i}>
                <td className="border border-gray-300 p-1">
                  {item.product?.name || "N/A"}
                </td>
                <td className="border border-gray-300 p-1 text-center">
                  {item.quantity}
                </td>
                <td className="border border-gray-300 p-1 text-right">
                  {formatPrice(item.price)}
                </td>
                <td className="border border-gray-300 p-1 text-right">
                  {formatPrice(item.subtotal)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-gray-500 border p-1">
                Không có sản phẩm
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* QR + Total */}
      <div className="flex gap-4 mb-4 text-xs">
        <div className="flex-shrink-0 flex flex-col items-center">
          {qrCodeDataUrl ? (
            <img
              src={qrCodeDataUrl}
              alt="QR Code"
              className="border border-gray-300 p-1 bg-white rounded w-20 h-20"
            />
          ) : (
            <div className="border border-gray-300 w-20 h-20 flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
              QR
            </div>
          )}
          <p className="text-gray-600 mt-1 text-xs">Mã QR</p>
        </div>

        <div className="flex-1 flex justify-end">
          <div className="w-56 border-t-2 border-[#8B5E3C] pt-2">
            <div className="flex justify-between mb-1">
              <span>Tổng tiền:</span>
              <span className="font-bold">
                {formatPrice(bill.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between mb-1 text-gray-600">
              <span>Chiết khấu:</span>
              <span>0 đ</span>
            </div>
            <div className="flex justify-between border-t-2 border-[#8B5E3C] pt-1 font-bold text-[#8B5E3C]">
              <span>TỔNG CỘNG:</span>
              <span>{formatPrice(bill.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-2 rounded mb-4 text-xs">
        <p>
          <strong>Phương thức thanh toán:</strong> {methodConfig.label}
        </p>
        <p>
          <strong>Trạng thái:</strong> {statusConfig.label}
        </p>
        {bill.notes && (
          <p>
            <strong>Ghi chú:</strong> {bill.notes}
          </p>
        )}
      </div>

      <div className="text-center text-xs text-gray-600 border-t-2 border-[#8B5E3C] pt-2">
        <p>Cảm ơn bạn đã ghé thăm!</p>
        <p>Vui lòng giữ hóa đơn để đối chiếu khi cần</p>
      </div>
    </div>
  );
});

export default InvoiceContent;