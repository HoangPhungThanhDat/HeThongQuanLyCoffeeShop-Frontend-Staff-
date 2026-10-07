
import { useMemo } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
  Input,
  Button,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import {
  PencilSquareIcon,
  XMarkIcon,
  RectangleStackIcon,
  UserIcon,
  GiftIcon,
  BanknotesIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  CalculatorIcon,
  ExclamationTriangleIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

import { useOrderForm } from "./hooks/useOrderForm";
import { OrderReceiptPreview } from "./components/OrderReceiptPreview";
import { getStatusConfig, ORDER_STATUS_OPTIONS } from "./constants/orderStatus";

export function Edit({ open, onClose, order, tables = [], employees = [], promotions = [] }) {
  const {
    formData,
    errors,
    changes,
    formattedTotal,
    isSubmitting,
    canSubmit,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    handleClose,
  } = useOrderForm({
    id: order?.id,
    initialData: order,
    onClose,
  });

  // ============ DATA HELPERS ============
  const selectedTable = useMemo(
    () => tables.find((t) => String(t.id) === String(formData.tableId)),
    [tables, formData.tableId]
  );
  const selectedEmployee = useMemo(
    () => employees.find((e) => String(e.id) === String(formData.employeeId)),
    [employees, formData.employeeId]
  );
  const selectedPromotion = useMemo(
    () => promotions.find((p) => String(p.id) === String(formData.promotionId)),
    [promotions, formData.promotionId]
  );

  const statusConfig = getStatusConfig(formData.status);
  const StatusIcon = statusConfig.icon;

  if (!order) return null;

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
              <PencilSquareIcon className="h-7 w-7 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <Typography variant="h4" className="text-white font-extrabold tracking-tight text-xl lg:text-2xl">
                Cập Nhật Đơn Hàng
              </Typography>
              <Typography variant="small" className="text-white/85 font-medium">
                Chỉnh sửa đơn hàng #{order?.id} ☕
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
              {/* ===== CỘT TRÁI ===== */}
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-[300px]">
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${statusConfig.gradient} blur-xl opacity-30 transition-opacity duration-300`}
                  />
                  <OrderReceiptPreview
                    formData={formData}
                    selectedTable={selectedTable}
                    selectedEmployee={selectedEmployee}
                    selectedPromotion={selectedPromotion}
                    formattedTotal={formattedTotal}
                    mode="edit"
                    orderId={order?.id}
                    changeFlags={{
                      tableChanged: changes.tableChanged,
                      employeeChanged: changes.employeeChanged,
                      promotionChanged: changes.promotionChanged,
                      statusChanged: changes.statusChanged,
                    }}
                  />
                </div>

                <div className="mt-4 text-center">
                  <Typography className="text-sm font-bold text-[#4e342e]">
                    Xem trước hóa đơn
                  </Typography>
                  <Typography className="text-xs text-gray-500 mt-1">
                    Đơn hàng sẽ hiển thị như thế này
                  </Typography>
                </div>

                {/* Change indicator */}
                {changes.hasChanges ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 w-full max-w-[300px] p-3 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200"
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      <Typography className="text-[10px] font-extrabold text-orange-700 uppercase tracking-wider">
                        Có thay đổi chưa lưu
                      </Typography>
                    </div>
                  </motion.div>
                ) : (
                  <div className="mt-4 w-full max-w-[300px] p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
                    <div className="flex items-center gap-2 justify-center">
                      <span className="w-2 h-2 rounded-full bg-gray-400" />
                      <Typography className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
                        Chưa có thay đổi
                      </Typography>
                    </div>
                  </div>
                )}
              </div>

              {/* ===== CỘT PHẢI: FORM ===== */}
              <div className="space-y-5">
                {/* Current Order Banner */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-[#f5ede3] to-[#faf6f1] border-2 border-[#C89F77]/30">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center flex-shrink-0 shadow-md">
                    <ShoppingCartIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography className="text-xs font-extrabold uppercase text-[#8B5E3C] tracking-widest">
                      Đang chỉnh sửa
                    </Typography>
                    <Typography className="text-sm font-bold text-[#4e342e] truncate">
                      Đơn #{order?.id}{" "}
                      <span className="text-[#8B5E3C]/70 font-medium">
                        · {order?.table?.number || "N/A"}
                      </span>
                    </Typography>
                  </div>
                </div>

                {/* Section: Đơn hàng */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Thông tin đơn hàng
                    </Typography>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <RectangleStackIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Select
                        label="Chọn bàn *"
                        value={formData.tableId?.toString() || ""}
                        onChange={(val) => handleSelectChange("tableId", val)}
                        disabled={isSubmitting}
                        error={!!errors.tableId}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        menuProps={{ className: "!rounded-xl !border-[#C89F77]/30" }}
                      >
                        {tables.map((t) => (
                          <Option key={t.id} value={t.id.toString()}>
                            🪑 Bàn {t.number} · {t.capacity} chỗ
                          </Option>
                        ))}
                      </Select>
                      {changes.tableChanged && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                          <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                            Đã sửa
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <UserIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Select
                        label="Chọn nhân viên *"
                        value={formData.employeeId?.toString() || ""}
                        onChange={(val) => handleSelectChange("employeeId", val)}
                        disabled={isSubmitting}
                        error={!!errors.employeeId}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        menuProps={{ className: "!rounded-xl !border-[#C89F77]/30" }}
                      >
                        {employees.map((e) => (
                          <Option key={e.id} value={e.id.toString()}>
                            👤 {e.fullName}
                          </Option>
                        ))}
                      </Select>
                      {changes.employeeChanged && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                          <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                            Đã sửa
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section: Khuyến mãi & Giá */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Khuyến mãi & Thanh toán
                    </Typography>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <GiftIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Select
                        label="Khuyến mãi (tùy chọn)"
                        value={formData.promotionId?.toString() || ""}
                        onChange={(val) => handleSelectChange("promotionId", val)}
                        disabled={isSubmitting}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        menuProps={{ className: "!rounded-xl !border-[#C89F77]/30" }}
                      >
                        <Option value="">Không áp dụng</Option>
                        {promotions.map((promo) => (
                          <Option key={promo.id} value={promo.id.toString()}>
                            🎁 {promo.name}
                          </Option>
                        ))}
                      </Select>
                      {changes.promotionChanged && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                          <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                            Đã sửa
                          </span>
                        </div>
                      )}
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
                      {changes.amountChanged && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                          <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                            Đã sửa
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedPromotion && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200"
                    >
                      <GiftIcon className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" strokeWidth={2.2} />
                      <div className="flex-1 min-w-0">
                        <Typography className="text-xs font-extrabold text-pink-700">
                          🎁 {selectedPromotion.name}
                        </Typography>
                      </div>
                    </motion.div>
                  )}

                  {formattedTotal && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] shadow-md"
                    >
                      <div className="flex items-center gap-2">
                        <CalculatorIcon className="h-4 w-4 text-amber-200" />
                        <Typography className="text-[10px] font-extrabold text-amber-200 uppercase tracking-widest">
                          Tổng tiền
                        </Typography>
                      </div>
                      <Typography className="text-base font-extrabold text-white">
                        {formattedTotal}
                      </Typography>
                    </motion.div>
                  )}
                </div>

                {/* Section: Trạng thái & Ghi chú */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Trạng thái & Ghi chú
                    </Typography>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <ClipboardDocumentListIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Select
                        label="Trạng thái đơn hàng *"
                        value={formData.status}
                        onChange={(val) => handleSelectChange("status", val)}
                        disabled={isSubmitting}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        menuProps={{ className: "!rounded-xl !border-[#C89F77]/30" }}
                      >
                        {ORDER_STATUS_OPTIONS.map((s) => (
                          <Option key={s.value} value={s.value}>
                            {s.emoji} {s.label}
                          </Option>
                        ))}
                      </Select>
                      {changes.statusChanged && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                          <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                            Đã sửa
                          </span>
                        </div>
                      )}
                    </div>

                    <div
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 bg-gradient-to-r ${statusConfig.light} ${statusConfig.border}`}
                    >
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <StatusIcon className={`w-5 h-5 ${statusConfig.text}`} strokeWidth={2.2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${statusConfig.dot} ${
                              formData.status === "PENDING" ? "animate-pulse" : ""
                            }`}
                          />
                          <Typography className={`text-xs font-extrabold ${statusConfig.text}`}>
                            {statusConfig.emoji} {statusConfig.label}
                          </Typography>
                        </div>
                        <Typography className="text-[10px] text-gray-500 mt-0.5">
                          {statusConfig.description}
                        </Typography>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-3 z-10 pointer-events-none">
                        <DocumentTextIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Textarea
                        label="Ghi chú đơn hàng"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        rows={3}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                      />
                      <div className="flex items-center justify-between mt-1">
                        <div>
                          {changes.notesChanged && (
                            <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                              Đã sửa
                            </span>
                          )}
                        </div>
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
                </div>

                {/* Section: Trạng thái thay đổi */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Trạng thái thay đổi
                    </Typography>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                    {[
                      { key: "tableChanged", icon: RectangleStackIcon, label: "Bàn" },
                      { key: "employeeChanged", icon: UserIcon, label: "Nhân viên" },
                      { key: "promotionChanged", icon: GiftIcon, label: "Khuyến mãi" },
                      { key: "amountChanged", icon: BanknotesIcon, label: "Tổng tiền" },
                      { key: "statusChanged", icon: ClipboardDocumentListIcon, label: "Trạng thái" },
                      { key: "notesChanged", icon: DocumentTextIcon, label: "Ghi chú" },
                    ].map(({ key, icon: Icon, label }) => {
                      const changed = changes[key];
                      return (
                        <div
                          key={key}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all duration-300 ${
                            changed
                              ? "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
                              : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              changed ? "bg-orange-100" : "bg-green-100"
                            }`}
                          >
                            <Icon
                              className={`w-3.5 h-3.5 ${
                                changed ? "text-orange-600" : "text-green-600"
                              }`}
                              strokeWidth={2.5}
                            />
                          </div>
                          <div className="min-w-0">
                            <Typography
                              className={`text-[9px] font-bold uppercase tracking-wider ${
                                changed ? "text-orange-700" : "text-green-700"
                              }`}
                            >
                              {label}
                            </Typography>
                            <Typography
                              className={`text-[10px] font-extrabold ${
                                changed ? "text-orange-700" : "text-green-700"
                              }`}
                            >
                              {changed ? "● Đã sửa" : "✓ Không đổi"}
                            </Typography>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Info Note */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                  <InformationCircleIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
                  <Typography className="text-xs text-[#6d4c41] leading-relaxed">
                    <span className="font-bold">Lưu ý:</span> Các trường có dấu{" "}
                    <span className="text-red-500 font-bold">*</span> là bắt buộc. Sau khi cập
                    nhật, hệ thống sẽ gửi thông báo realtime qua Socket để cập nhật Kanban Board
                    cho tất cả nhân viên.
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
              disabled={isSubmitting || !canSubmit}
              className={`px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 normal-case font-bold flex items-center gap-2 ${
                canSubmit
                  ? "bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] text-white hover:shadow-[#8B5E3C]/30 hover:scale-105 active:scale-95"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } disabled:opacity-50 disabled:hover:scale-100`}
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
                  Cập Nhật
                </span>
              )}
            </Button>
          </div>
        </DialogFooter>
      </motion.div>
    </Dialog>
  );
}

export default Edit;