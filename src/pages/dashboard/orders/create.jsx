import { useState } from "react";
import {
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Select, Option, Input, Button
} from "@material-tailwind/react";
import OrderAPI from "@/api/orderApi";
import Swal from "sweetalert2";
export function Create({ open, onClose, onSuccess, tables, employees, promotions }) {
  const [formData, setFormData] = useState({
    tableId: "",
    employeeId: "",
    promotionId: "",
    totalAmount: "",
    status: "PENDING",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

    // === Hàm thông báo SweetAlert2 ===
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
        showClass: {
          popup: "animate__animated animate__slideInRight",
        },
        hideClass: {
          popup: "animate__animated animate__slideOutRight",
        },
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
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

      await OrderAPI.create(orderData);
      showToast("success", "🎉 Thêm đơn hàng mới thành công!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Lỗi khi thêm đơn hàng:", error.response || error);
      showToast("error", error.response?.data?.message || "❌ Không thể thêm đơn hàng!");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <Dialog open={open} handler={onClose} size="lg">
      <DialogHeader className="bg-gradient-to-r from-[#8B5E3C] to-[#C89F77] text-white rounded-t-lg shadow-md">
        ➕ Thêm Đơn Hàng Mới
      </DialogHeader>

      <DialogBody divider className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto bg-[#fffaf5]">
        <Select label="Chọn Bàn" value={formData.tableId} onChange={(val) => setFormData(p => ({ ...p, tableId: val }))}>
          {tables.map(t => <Option key={t.id} value={t.id}>Bàn {t.number}</Option>)}
        </Select>

        <Select label="Chọn Nhân Viên" value={formData.employeeId} onChange={(val) => setFormData(p => ({ ...p, employeeId: val }))}>
          {employees.map(e => <Option key={e.id} value={e.id}>{e.fullName}</Option>)}
        </Select>

        <Select label="Chọn Khuyến Mãi" value={formData.promotionId} onChange={(val) => setFormData(p => ({ ...p, promotionId: val }))}>
          <Option value="">Không áp dụng</Option>
          {promotions.map(promo => <Option key={promo.id} value={promo.id}>{promo.name}</Option>)}
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Tổng Tiền (VND)" type="number" value={formData.totalAmount}
            onChange={(e) => setFormData(p => ({ ...p, totalAmount: e.target.value }))} />
          <Select label="Trạng Thái" value={formData.status} onChange={(val) => setFormData(p => ({ ...p, status: val }))}>
            <Option value="PENDING">🕒 Chờ xử lý</Option>
            <Option value="CONFIRMED">✅ Đã xác nhận</Option>
            <Option value="PREPARING">☕ Đang chuẩn bị</Option>
            <Option value="SERVED">🍽️ Đã phục vụ</Option>
            <Option value="PAID">💰 Đã thanh toán</Option>
            <Option value="CANCELLED">❌ Đã hủy</Option>
          </Select>
        </div>

        <Input label="Ghi Chú" value={formData.notes} onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))} />
      </DialogBody>

      <DialogFooter className="bg-[#fffaf5] rounded-b-lg">
        <Button variant="text" color="red" onClick={onClose}>Hủy</Button>
        <Button color="green" className="bg-[#8B5E3C]" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Đang xử lý..." : "Thêm mới"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
export default Create;