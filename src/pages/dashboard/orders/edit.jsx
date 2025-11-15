import { useState, useEffect } from "react";
import {
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Select, Option, Input, Button, Typography
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import OrderAPI from "@/api/orderApi";
import socket from "../../../socket"; 
import Swal from "sweetalert2";

export function Edit({ open, onClose, onSuccess, order, tables, employees, promotions }) {
  const [formData, setFormData] = useState({
    tableId: "",
    employeeId: "",
    promotionId: "",
    totalAmount: "",
    status: "PENDING",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
      setFormData({
        tableId: order.table?.id || "",
        employeeId: order.employee?.id || "",
        promotionId: order.promotion?.id || "",
        totalAmount: order.totalAmount || "",
        status: order.status || "PENDING",
        notes: order.notes || "",
      });
    }
  }, [order]);

  const showToast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      customClass: {
        popup: "my-toast animate__animated animate__fadeInRight",
      },
    });
  };

  const handleSubmit = async () => {
    if (submitting) return;

    if (!formData.tableId) return showToast("warning", "⚠️ Vui lòng chọn bàn!");
    if (!formData.employeeId) return showToast("warning", "⚠️ Vui lòng chọn nhân viên!");
    if (!formData.totalAmount || parseFloat(formData.totalAmount) <= 0)
      return showToast("warning", "⚠️ Vui lòng nhập tổng tiền hợp lệ!");

    try {
      setSubmitting(true);

      const orderData = {
        table: { id: formData.tableId },
        employee: { id: formData.employeeId },
        promotion: formData.promotionId ? { id: formData.promotionId } : null,
        totalAmount: parseFloat(formData.totalAmount),
        status: formData.status,
        notes: formData.notes,
      };

      await OrderAPI.update(order.id, orderData);
      
      const tableInfo = tables.find(t => t.id === formData.tableId);
      socket.emit("order-status-updated", {
        orderId: order.id,
        status: formData.status,
        tableNumber: tableInfo?.number || order.table?.number || "N/A",
        updatedAt: new Date().toISOString(),
      });

      console.log(`📤 Đã emit "order-status-updated" cho đơn hàng #${order.id} - Trạng thái: ${formData.status}`);

      showToast("success", "✅ Cập nhật đơn hàng thành công!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error.response || error);
      showToast("error", error.response?.data?.message || "❌ Không thể cập nhật đơn hàng!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} handler={onClose} size="md" className="bg-transparent shadow-none">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <DialogHeader className="bg-gradient-to-r from-[#8B5E3C] to-[#C89F77] text-white p-6 flex justify-between items-center flex-shrink-0">
          <Typography variant="h5" className="font-bold">
            Cập Nhật Đơn Hàng
          </Typography>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
          >
            <XMarkIcon className="w-5 h-5 text-white" />
          </button>
        </DialogHeader>

        {/* BODY */}
        <DialogBody className="p-6 bg-white overflow-y-auto flex-1">
          <div className="space-y-5">
            {/* Chọn bàn */}
            <div>
              <Typography className="text-sm font-semibold text-gray-700 mb-2">
                Bàn
              </Typography>
              <Select
                value={formData.tableId}
                onChange={(val) => setFormData((p) => ({ ...p, tableId: val }))}
                className="border-gray-300"
              >
                {tables.map((table) => (
                  <Option key={table.id} value={table.id}>
                    Bàn {table.number}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Chọn nhân viên */}
            <div>
              <Typography className="text-sm font-semibold text-gray-700 mb-2">
                Nhân viên phục vụ
              </Typography>
              <Select
                value={formData.employeeId}
                onChange={(val) => setFormData((p) => ({ ...p, employeeId: val }))}
                className="border-gray-300"
              >
                {employees.map((emp) => (
                  <Option key={emp.id} value={emp.id}>
                    {emp.fullName}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Chọn khuyến mãi */}
            <div>
              <Typography className="text-sm font-semibold text-gray-700 mb-2">
                Khuyến mãi (tùy chọn)
              </Typography>
              <Select
                value={formData.promotionId}
                onChange={(val) => setFormData((p) => ({ ...p, promotionId: val }))}
                className="border-gray-300"
              >
                <Option value="">Không áp dụng</Option>
                {promotions.map((promo) => (
                  <Option key={promo.id} value={promo.id}>
                    {promo.name}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Grid 2 cột: Tổng tiền và Trạng thái */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography className="text-sm font-semibold text-gray-700 mb-2">
                  Tổng tiền (VND)
                </Typography>
                <Input
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData((p) => ({ ...p, totalAmount: e.target.value }))}
                  className="border-gray-300"
                />
              </div>

              <div>
                <Typography className="text-sm font-semibold text-gray-700 mb-2">
                  Trạng thái
                </Typography>
                <Select
                  value={formData.status}
                  onChange={(val) => setFormData((p) => ({ ...p, status: val }))}
                  className="border-gray-300"
                >
                  <Option value="PENDING">🕒 Chờ xử lý</Option>
                  <Option value="CONFIRMED">✅ Đã xác nhận</Option>
                  <Option value="PREPARING">☕ Đang chuẩn bị</Option>
                  <Option value="SERVED">🍽️ Đã phục vụ</Option>
                  <Option value="PAID">💰 Đã thanh toán</Option>
                  <Option value="CANCELLED">❌ Đã hủy</Option>
                </Select>
              </div>
            </div>

            {/* Ghi chú */}
            <div>
              <Typography className="text-sm font-semibold text-gray-700 mb-2">
                Ghi chú
              </Typography>
              <Input
                value={formData.notes}
                onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                className="border-gray-300"
              />
            </div>
          </div>
        </DialogBody>

        {/* FOOTER */}
        <DialogFooter className="p-6 pt-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
          <div className="flex gap-3 w-full">
            <Button
              onClick={onClose}
              className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm py-3 rounded-xl font-semibold transition-all duration-200"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className={`flex-1 bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#5d3a2f] text-white shadow-md hover:shadow-lg py-3 rounded-xl font-semibold transition-all duration-300 ${
                submitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? "Đang xử lý..." : "Cập nhật"}
            </Button>
          </div>
        </DialogFooter>
      </div>
    </Dialog>
  );
}

export default Edit;