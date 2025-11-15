
import { Typography, Tooltip } from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { DocumentArrowDownIcon } from "@heroicons/react/24/solid";

export function BillTable({ bills, onShow, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0 đ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const paymentMethods = {
    CASH: "Tiền mặt",
    CARD: "Thẻ",
    MOBILE: "Ví điện tử",
  };

  const paymentStatuses = {
    PENDING: { label: "Chờ thanh toán", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    COMPLETED: { label: "Đã thanh toán", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    FAILED: { label: "Thất bại", color: "bg-rose-100 text-rose-700 border-rose-200" },
  };

  const getPaymentMethodLabel = (method) => paymentMethods[method] || method;
  const getPaymentStatusLabel = (status) => paymentStatuses[status]?.label || status;
  const getPaymentStatusColor = (status) => paymentStatuses[status]?.color || "bg-gray-50 text-gray-600 border-gray-200";

  // ✅ HELPER: Lấy Order ID từ bill
  const getOrderId = (bill) => {
    if (bill.order && bill.order.id) {
      return bill.order.id;
    }
    if (bill.orderId) {
      return bill.orderId;
    }
    return "N/A";
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="w-full max-w-7xl bg-white shadow-lg rounded-3xl overflow-hidden border border-gray-100">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gradient-to-r from-amber-50 to-orange-50">
              {["STT", "Mã đơn hàng", "Tổng tiền", "Phương thức", "Trạng thái", "Ngày xuất", "Ghi chú", "Hành Động"].map((el) => (
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
            {bills.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-12">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-6xl mb-4 opacity-20">🧾</div>
                    <Typography className="text-sm text-gray-400 font-medium">
                      Chưa có hóa đơn nào
                    </Typography>
                  </div>
                </td>
              </tr>
            ) : (
              bills.map((bill, index) => {
                const className = `py-4 px-6 ${
                  index === bills.length - 1 ? "" : "border-b border-gray-100"
                }`;

                return (
                  <tr 
                    key={bill.id} 
                    className="hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 transition-all duration-200"
                  >
                    <td className={className}>
                      <Typography className="text-sm font-bold text-gray-600">
                        {index + 1}
                      </Typography>
                    </td>
                    
                    {/* ✅ ORDER ID */}
                    <td className={className}>
                      <Typography className="text-sm font-bold text-blue-600 font-mono">
                        #{getOrderId(bill)}
                      </Typography>
                    </td>
                    
                    {/* ✅ TỔNG TIỀN */}
                    <td className={className}>
                      <Typography className="text-sm font-bold text-amber-700">
                        {formatCurrency(bill.totalAmount)}
                      </Typography>
                    </td>
                    
                    {/* ✅ PHƯƠNG THỨC THANH TOÁN */}
                    <td className={className}>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                        {bill.paymentMethod === "MOBILE" && (
                          <span className="text-base">📱</span>
                        )}
                        {bill.paymentMethod === "CASH" && (
                          <span className="text-base">💵</span>
                        )}
                        {bill.paymentMethod === "CARD" && (
                          <span className="text-base">💳</span>
                        )}
                        <Typography className="text-xs font-semibold text-gray-700">
                          {getPaymentMethodLabel(bill.paymentMethod)}
                        </Typography>
                      </div>
                    </td>
                    
                    {/* ✅ TRẠNG THÁI THANH TOÁN */}
                    <td className={className}>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${getPaymentStatusColor(bill.paymentStatus)}`}>
                        {bill.paymentStatus === "COMPLETED" && "✓"}
                        {bill.paymentStatus === "PENDING" && "⏳"}
                        {bill.paymentStatus === "FAILED" && "✗"}
                        <span>{getPaymentStatusLabel(bill.paymentStatus)}</span>
                      </div>
                    </td>
                    
                    {/* ✅ NGÀY XUẤT */}
                    <td className={className}>
                      <Typography className="text-xs text-gray-600">
                        {formatDate(bill.issuedAt)}
                      </Typography>
                    </td>
                    
                    {/* ✅ GHI CHÚ */}
                    <td className={className}>
                      <Typography className="text-xs text-gray-500 truncate max-w-[120px]" title={bill.notes}>
                        {bill.notes || "-"}
                      </Typography>
                    </td>
                    
                    {/* ✅ HÀNH ĐỘNG */}
                    <td className={`${className} text-center`}>
                      <div className="flex justify-center gap-2">
                        {/* Xuất hóa đơn */}
                        <Tooltip content="Xuất hóa đơn" placement="top">
                          <button
                            onClick={() => onShow(bill)}
                            className="group relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-110 active:scale-95"
                          >
                            <DocumentArrowDownIcon className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                          </button>
                        </Tooltip>

                        {/* Chỉnh sửa */}
                        <Tooltip content="Chỉnh sửa" placement="top">
                          <button
                            onClick={() => onEdit(bill)}
                            className="group relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#5d3a2f] shadow-md hover:shadow-xl hover:shadow-[#8B5E3C]/30 transition-all duration-300 hover:scale-110 active:scale-95"
                          >
                            <PencilIcon className="w-5 h-5 text-white" />
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

export default BillTable;