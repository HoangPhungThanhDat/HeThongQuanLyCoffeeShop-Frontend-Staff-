
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
  Typography,
} from "@material-tailwind/react";
import {
  XMarkIcon,
  PlusCircleIcon,
  ShoppingCartIcon,
  CubeIcon,
  HashtagIcon,
  BanknotesIcon,
  CalculatorIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

import { useOrderItemForm } from "./hooks/useOrderItemForm";
import { OrderItemReceiptPreview } from "./components/OrderItemReceiptPreview";
import { formatPrice } from "./utils/formatters";

export function Create({ open, orders = [], products = [], onClose, onSuccess }) {
  const {
    formData,
    errors,
    productSearch,
    calculatedSubtotal,
    finalSubtotal,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleProductChange,
    setProductSearch,
    filterProducts,
    handleSubmit,
    handleClose,
  } = useOrderItemForm({ onClose, onSuccess });

  // ============ FILTER PRODUCTS ============
  const filteredProducts = useMemo(
    () => filterProducts(products),
    [filterProducts, products]
  );

  // ============ DATA HELPERS ============
  const selectedProduct = useMemo(
    () => products.find((p) => String(p.id) === String(formData.productId)),
    [products, formData.productId]
  );
  const selectedOrder = useMemo(
    () => orders.find((o) => String(o.id) === String(formData.orderId)),
    [orders, formData.orderId]
  );

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
                Thêm Món Vào Đơn
              </Typography>
              <Typography variant="small" className="text-white/85 font-medium">
                Chọn sản phẩm và số lượng cho đơn hàng ☕
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
                <OrderItemReceiptPreview
                  formData={formData}
                  selectedOrder={selectedOrder}
                  selectedProduct={selectedProduct}
                  finalSubtotal={finalSubtotal}
                  mode="create"
                />

                <div className="mt-4 text-center">
                  <Typography className="text-sm font-bold text-[#4e342e]">
                    Xem trước item
                  </Typography>
                  <Typography className="text-xs text-gray-500 mt-1">
                    Món sẽ hiển thị như thế này
                  </Typography>
                </div>

                {/* Formula hint */}
                {calculatedSubtotal > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 w-full max-w-[300px] p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
                  >
                    <div className="flex items-center gap-2 justify-center mb-1">
                      <CalculatorIcon className="w-3.5 h-3.5 text-green-600" />
                      <Typography className="text-[10px] font-extrabold text-green-700 uppercase tracking-wider">
                        Công thức
                      </Typography>
                    </div>
                    <Typography className="text-[10px] text-green-700 text-center font-semibold">
                      {formData.quantity} × {formatPrice(formData.price)} ={" "}
                      {formatPrice(calculatedSubtotal)}
                    </Typography>
                  </motion.div>
                )}
              </div>

              {/* CỘT PHẢI */}
              <div className="space-y-5">
                {/* Section: Đơn hàng */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Đơn hàng
                    </Typography>
                  </div>

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
                </div>

                {/* Section: Sản phẩm */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Sản phẩm
                    </Typography>
                  </div>

                  <div className="space-y-3">
                    {/* Search */}
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Input
                        label="Tìm kiếm sản phẩm (không dấu vẫn tìm được)"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        disabled={isSubmitting}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                      />
                      {productSearch && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                          <span className="text-[10px] font-extrabold text-[#8B5E3C] bg-[#faf6f1] border border-[#C89F77]/30 px-2 py-0.5 rounded-md">
                            {filteredProducts.length} kết quả
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product select */}
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <CubeIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Select
                        label="Chọn sản phẩm *"
                        value={formData.productId?.toString() || ""}
                        onChange={(val) => handleProductChange(val, products)}
                        disabled={isSubmitting}
                        error={!!errors.productId}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        menuProps={{ className: "!rounded-xl !border-[#C89F77]/30" }}
                      >
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <Option key={product.id} value={product.id.toString()}>
                              ☕ {product.name} · {formatPrice(product.price)}
                            </Option>
                          ))
                        ) : (
                          <Option disabled value="">
                            Không tìm thấy sản phẩm
                          </Option>
                        )}
                      </Select>
                    </div>

                    {/* Selected product info */}
                    {selectedProduct && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                      >
                        <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <Typography className="text-xs font-extrabold text-green-700 truncate">
                            ✓ {selectedProduct.name}
                          </Typography>
                          <Typography className="text-[10px] text-green-600 mt-0.5">
                            ID: #{selectedProduct.id} · Đơn giá:{" "}
                            {formatPrice(selectedProduct.price)}
                          </Typography>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Section: Số lượng & Giá */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Số lượng & Giá
                    </Typography>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <HashtagIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Input
                        type="number"
                        label="Số lượng *"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        error={!!errors.quantity}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <BanknotesIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Input
                        type="number"
                        label="Đơn giá (VNĐ) *"
                        name="price"
                        min="0"
                        step="1000"
                        value={formData.price}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        error={!!errors.price}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Thành tiền */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Thành tiền
                    </Typography>
                  </div>

                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                      <CalculatorIcon className="h-5 w-5 text-[#8B5E3C]" />
                    </div>
                    <Input
                      type="number"
                      label="Thành tiền (VNĐ) — để trống để tự động tính"
                      name="subtotal"
                      min="0"
                      value={formData.subtotal}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      placeholder={
                        calculatedSubtotal
                          ? `Tự động: ${formatPrice(calculatedSubtotal)}`
                          : "0"
                      }
                      className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl !bg-white"
                      labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                    />
                  </div>

                  {calculatedSubtotal > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] shadow-md"
                    >
                      <div className="flex items-center gap-2">
                        <BanknotesIcon className="h-4 w-4 text-amber-200" />
                        <Typography className="text-[10px] font-extrabold text-amber-200 uppercase tracking-widest">
                          Thành tiền
                        </Typography>
                      </div>
                      <Typography className="text-base font-extrabold text-white">
                        {formatPrice(finalSubtotal)}
                      </Typography>
                    </motion.div>
                  )}
                </div>

                {/* Info Note */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                  <InformationCircleIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
                  <Typography className="text-xs text-[#6d4c41] leading-relaxed">
                    <span className="font-bold">Mẹo:</span> Giá sản phẩm sẽ tự động
                    điền khi bạn chọn sản phẩm. Để trống ô{" "}
                    <span className="font-bold">Thành tiền</span> để hệ thống tự tính
                    = Số lượng × Đơn giá.
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
              onClick={() => handleSubmit(products)}
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
                  <CheckBadgeIcon className="h-5 w-5" strokeWidth={2.5} />
                  Thêm Vào Đơn
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