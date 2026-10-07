
import { useMemo } from "react";
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
  Typography,
} from "@material-tailwind/react";
import {
  XMarkIcon,
  PlusCircleIcon,
  ShoppingCartIcon,
  BanknotesIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

import { useBillForm } from "./hooks/useBillForm";
import { BillReceiptPreview } from "./components/BillReceiptPreview";
import { getStatusConfig, METHOD_OPTIONS, STATUS_OPTIONS } from "./constants/billConfig";

export function Create({ open, orders = [], onClose, onSuccess }) {
  const {
    formData,
    errors,
    formattedTotal,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    handleClose,
  } = useBillForm({ onClose, onSuccess });

  // ============ DATA HELPERS ============
  const selectedOrder = useMemo(
    () => orders.find((o) => String(o.id) === String(formData.orderId)),
    [orders, formData.orderId]
  );

  const statusConfig = getStatusConfig(formData.paymentStatus);
  const StatusIcon = statusConfig.icon;

  return (
    <Dialog open={open} handler={handleClose} size="xl" className="bg-transparent shadow-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* HEADER */}
        <DialogHeader className="relative bg-gradient-to-r from-[#8B5E3C] via-[#a4714b] to-[#C89F77] p-6 m-0 rounded-none overflow-hidden block">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -left-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute top-1/2 right-1/3 w-20 h-20 rounded-full bg-white/5" />

          <div className="relative flex items-center gap-4 w-full z-10">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg flex-shrink-0">
              <PlusCircleIcon className="h-7 w-7 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <Typography variant="h4" className="text-white font-extrabold tracking-tight text-xl lg:text-2xl">
                Thêm Hóa Đơn Mới
              </Typography>
              <Typography variant="small" className="text-white/85 font-medium">
                Tạo hóa đơn thanh toán cho đơn hàng ☕
              </Typography>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0 disabled:opacity-50"
            >
              <XMarkIcon className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>
        </DialogHeader>

        {/* BODY */}
        <DialogBody className="p-0 max-h-[72vh] overflow-y-auto bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3]">
          <div className="p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-8">
              {/* CỘT TRÁI */}
              <div className="flex flex-col items-center">
                <BillReceiptPreview
                  formData={formData}
                  selectedOrder={selectedOrder}
                  formattedTotal={formattedTotal}
                  mode="create"
                />

                <div className="mt-4 text-center">
                  <Typography className="text-sm font-bold text-[#4e342e]">
                    Xem trước hóa đơn
                  </Typography>
                  <Typography className="text-xs text-gray-500 mt-1">
                    Hóa đơn sẽ hiển thị như thế này
                  </Typography>
                </div>

                <div className="mt-4 w-full max-w-[300px] p-3 rounded-xl bg-gradient-to-br from-[#f5ede3] to-[#faf6f1] border border-[#C89F77]/30">
                  <Typography className="text-[10px] font-extrabold text-[#8B5E3C] uppercase tracking-widest text-center mb-1">
                    💡 Gợi ý
                  </Typography>
                  <Typography className="text-[10px] text-[#6d4c41]/80 text-center leading-relaxed">
                    Chọn đơn hàng và nhập tổng tiền để tạo hóa đơn
                  </Typography>
                </div>
              </div>

              {/* CỘT PHẢI */}
              <div className="space-y-5">
                {/* Section: Đơn hàng & Thanh toán */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Đơn hàng & Thanh toán
                    </Typography>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <ShoppingCartIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Select
                        label="Chọn đơn hàng *"
                        value={formData.orderId?.toString() || ""}
                        onChange={(val) => handleSelectChange("orderId", val)}
                        disabled={isSubmitting}
                        error={!!errors.orderId}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        menuProps={{ className: "!rounded-xl !border-[#C89F77]/30" }}
                      >
                        {orders.map((order) => (
                          <Option key={order.id} value={order.id.toString()}>
                            📋 Đơn #{order.id} · Bàn {order.table?.number || "N/A"}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <BanknotesIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Input
                        type="number"
                        label="Tổng tiền (VNĐ) *"
                        name="totalAmount"
                        min="0"
                        step="1000"
                        value={formData.totalAmount}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        error={!!errors.totalAmount}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Phương thức & Trạng thái */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Phương thức & Trạng thái
                    </Typography>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <CreditCardIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Select
                        label="Phương thức *"
                        value={formData.paymentMethod}
                        onChange={(val) => handleSelectChange("paymentMethod", val)}
                        disabled={isSubmitting}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        menuProps={{ className: "!rounded-xl !border-[#C89F77]/30" }}
                      >
                        {METHOD_OPTIONS.map((m) => (
                          <Option key={m.value} value={m.value}>
                            {m.emoji} {m.label}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <CheckCircleIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Select
                        label="Trạng thái *"
                        value={formData.paymentStatus}
                        onChange={(val) => handleSelectChange("paymentStatus", val)}
                        disabled={isSubmitting}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        menuProps={{ className: "!rounded-xl !border-[#C89F77]/30" }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <Option key={s.value} value={s.value}>
                            {s.emoji} {s.label}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  {/* Status preview */}
                  <div
                    className={`mt-3 flex items-center gap-3 p-3 rounded-xl border-2 bg-gradient-to-r ${statusConfig.light} ${statusConfig.border}`}
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <StatusIcon className={`w-5 h-5 ${statusConfig.text}`} strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${statusConfig.dot} ${formData.paymentStatus === "PENDING" ? "animate-pulse" : ""}`} />
                        <Typography className={`text-xs font-extrabold ${statusConfig.text}`}>
                          {statusConfig.emoji} {statusConfig.label}
                        </Typography>
                      </div>
                      <Typography className="text-[10px] text-gray-500 mt-0.5">
                        {statusConfig.description}
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* Section: Thời gian xuất */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Thời gian xuất hóa đơn
                    </Typography>
                  </div>

                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                      <CalendarDaysIcon className="h-5 w-5 text-[#8B5E3C]" />
                    </div>
                    <Input
                      type="datetime-local"
                      label="Ngày xuất hóa đơn"
                      name="issuedAt"
                      value={formData.issuedAt}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                      labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                    />
                  </div>
                </div>

                {/* Section: Ghi chú */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Ghi chú
                    </Typography>
                  </div>

                  <div className="relative">
                    <div className="absolute left-3 top-3 z-10 pointer-events-none">
                      <DocumentTextIcon className="h-5 w-5 text-[#8B5E3C]" />
                    </div>
                    <Textarea
                      label="Ghi chú hóa đơn (không bắt buộc)"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      rows={3}
                      className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                      labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                    />
                    <div className="mt-1 text-right">
                      <Typography
                        className={`text-[10px] font-semibold ${
                          formData.notes.length > 200 ? "text-orange-500" : "text-gray-400"
                        }`}
                      >
                        {formData.notes.length} ký tự
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* Info Note */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                  <InformationCircleIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
                  <Typography className="text-xs text-[#6d4c41] leading-relaxed">
                    <span className="font-bold">Lưu ý:</span> Các trường có dấu{" "}
                    <span className="text-red-500 font-bold">*</span> là bắt buộc. Hóa đơn sẽ được
                    tạo cho đơn hàng đã chọn với tổng số tiền tương ứng.
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>

        {/* FOOTER */}
        <DialogFooter className="bg-white border-t border-amber-100 p-4 lg:p-5 gap-3 flex items-center justify-between">
          <Typography className="text-xs text-gray-400 font-medium hidden sm:block">
            ☕ Coffee Shop Staff
          </Typography>
          <div className="flex gap-3 ml-auto">
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 px-6 rounded-xl normal-case font-bold transition-all duration-200 disabled:opacity-50"
            >
              Hủy Bỏ
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] text-white px-8 rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#8B5E3C]/30 transition-all duration-300 hover:scale-105 active:scale-95 normal-case font-bold disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5" strokeWidth={2.5} />
                  Tạo Hóa Đơn
                </span>
              )}
            </Button>
          </div>
        </DialogFooter>
      </motion.div>
    </Dialog>
  );
}

export default Create;