import { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";
import BillApi from "@/api/billApi";
import Swal from "sweetalert2";

export function Create({ open, orders, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    orderId: "",
    totalAmount: "",
    paymentMethod: "CASH",
    paymentStatus: "PENDING",
    notes: "",
    issuedAt: "",
  });

  const paymentMethods = [
    { value: "CASH", label: "Tiền mặt" },
    { value: "CARD", label: "Thẻ" },
    { value: "MOBILE", label: "Ví điện tử" },
  ];

  const paymentStatuses = [
    { value: "PENDING", label: "Chờ thanh toán" },
    { value: "COMPLETED", label: "Đã thanh toán" },
    { value: "FAILED", label: "Thất bại" },
  ];

  const showToast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.orderId) {
      showToast("warning", "⚠️ Vui lòng chọn đơn hàng!");
      return;
    }

    if (!formData.totalAmount || parseFloat(formData.totalAmount) <= 0) {
      showToast("warning", "⚠️ Vui lòng nhập tổng tiền hợp lệ!");
      return;
    }

    const payload = {
      order: { id: parseInt(formData.orderId) },
      totalAmount: parseFloat(formData.totalAmount),
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentStatus,
      notes: formData.notes,
      issuedAt: formData.issuedAt || new Date().toISOString(),
    };

    try {
      await BillApi.create(payload);
      // Reset form
      const now = new Date();
      const vietnamTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
      const currentDateTime = vietnamTime.toISOString().slice(0, 16);
      
      setFormData({
        orderId: "",
        totalAmount: "",
        paymentMethod: "CASH",
        paymentStatus: "PENDING",
        notes: "",
        issuedAt: currentDateTime,
      });
      onClose();
      onSuccess();
    } catch (error) {
      showToast("error", "❌ Không thể thêm hóa đơn!");
    }
  };

  // Set default datetime when dialog opens
  useState(() => {
    if (open && !formData.issuedAt) {
      const now = new Date();
      const vietnamTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
      const currentDateTime = vietnamTime.toISOString().slice(0, 16);
      setFormData(prev => ({ ...prev, issuedAt: currentDateTime }));
    }
  }, [open]);

  return (
    <Dialog open={open} handler={onClose} size="md">
      <DialogHeader className="bg-gradient-to-r from-[#8B5E3C] to-[#C89F77] text-white rounded-t-lg">
        Thêm Hóa Đơn Mới
      </DialogHeader>
      <DialogBody divider className="flex flex-col gap-4 bg-[#fffaf5] max-h-[70vh] overflow-y-auto">
        <Select
          label="Chọn đơn hàng"
          value={formData.orderId.toString()}
          onChange={(val) => handleSelectChange("orderId", val)}
        >
          {orders.map((order) => (
            <Option key={order.id} value={order.id.toString()}>
              Đơn hàng #{order.id}
            </Option>
          ))}
        </Select>

        <Input
          label="Tổng tiền (VNĐ)"
          name="totalAmount"
          type="number"
          value={formData.totalAmount}
          onChange={handleInputChange}
          required
        />

        <Select
          label="Phương thức thanh toán"
          value={formData.paymentMethod}
          onChange={(val) => handleSelectChange("paymentMethod", val)}
        >
          {paymentMethods.map((method) => (
            <Option key={method.value} value={method.value}>
              {method.label}
            </Option>
          ))}
        </Select>

        <Select
          label="Trạng thái thanh toán"
          value={formData.paymentStatus}
          onChange={(val) => handleSelectChange("paymentStatus", val)}
        >
          {paymentStatuses.map((status) => (
            <Option key={status.value} value={status.value}>
              {status.label}
            </Option>
          ))}
        </Select>

        <Input
          label="Ngày xuất hóa đơn"
          name="issuedAt"
          type="datetime-local"
          value={formData.issuedAt}
          onChange={handleInputChange}
          required
        />

        <Textarea
          label="Ghi chú"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={3}
        />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={onClose} className="mr-2">
          Hủy
        </Button>
        <Button
          variant="gradient"
          color="green"
          className="bg-[#8B5E3C] hover:bg-[#a4714b]"
          onClick={handleSubmit}
        >
          Thêm mới
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default Create;