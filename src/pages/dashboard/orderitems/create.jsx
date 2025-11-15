import { useState, useMemo } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import OrderItemAPI from "@/api/orderitemApi";
import Swal from "sweetalert2";

export function Create({ open, orders, products, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    orderId: "",
    productId: "",
    quantity: "",
    price: "",
    subtotal: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductSelect = (productId) => {
    const selected = products.find((p) => p.id === Number(productId));
    setFormData((prev) => ({
      ...prev,
      productId,
      price: selected ? selected.price : "",
    }));
  };

  const handleSubmit = async () => {
    if (!formData.orderId || !formData.productId || !formData.quantity || !formData.price) {
      showToast("warning", "⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const payload = {
      order: { id: Number(formData.orderId) },
      product: { id: Number(formData.productId) },
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      subtotal: Number(formData.subtotal) || Number(formData.price) * Number(formData.quantity),
    };

    try {
      await OrderItemAPI.create(payload);
      setFormData({ orderId: "", productId: "", quantity: "", price: "", subtotal: "" });
      setSearchTerm("");
      onClose();
      onSuccess();
    } catch (error) {
      showToast("error", "❌ Không thể thêm order item!");
    }
  };

  return (
    <Dialog 
      open={open} 
      handler={onClose} 
      size="lg"
      className="bg-transparent shadow-none"
    >
      <div className="relative bg-white rounded-lg overflow-hidden shadow-xl">
        
        {/* Header with Coffee Brown Theme */}
        <DialogHeader className="relative bg-gradient-to-r from-[#8B5E3C] to-[#C89F77] text-white p-6 rounded-t-lg border-b-2 border-[#8B5E3C]">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold">Thêm Sản Phẩm Vào Đơn</h3>
              <p className="text-amber-100 text-sm font-light mt-1">Chọn sản phẩm và số lượng cho đơn hàng</p>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="relative p-6 bg-gradient-to-br from-[#f9f5f0] to-[#fffaf5] max-h-[70vh] overflow-y-auto">
          <div className="space-y-5">
            {/* Order Selection Card */}
            <div className="bg-white rounded-lg p-5 shadow border border-[#D4A574]">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#8B5E3C] mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Chọn Đơn Hàng
              </label>
              <Select
                label="Đơn hàng"
                name="orderId"
                value={formData.orderId}
                onChange={(val) => setFormData((prev) => ({ ...prev, orderId: val }))}
                className="border-[#D4A574]"
                required
              >
                {orders.map((order) => (
                  <Option key={order.id} value={order.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#f9f5f0] text-[#8B5E3C] px-2 py-1 rounded text-xs font-semibold">
                        #{order.id}
                      </span>
                      <span>Đơn hàng số {order.id}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </div>

            {/* Product Selection Card */}
            <div className="bg-white rounded-lg p-5 shadow border border-[#D4A574]">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#8B5E3C] mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Tìm & Chọn Sản Phẩm
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    label="Tìm kiếm sản phẩm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nhập tên sản phẩm..."
                    className="!border-[#D4A574] focus:!border-[#8B5E3C]"
                    icon={
                      <svg className="w-5 h-5 text-[#8B5E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    }
                  />
                  {searchTerm && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="text-xs text-[#8B5E3C] bg-[#f9f5f0] px-2 py-1 rounded-full">
                        {filteredProducts.length} kết quả
                      </span>
                    </div>
                  )}
                </div>
                <Select
                  label="Chọn sản phẩm"
                  name="productId"
                  value={formData.productId}
                  onChange={(val) => handleProductSelect(val)}
                  className="border-[#D4A574]"
                  required
                >
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <Option key={product.id} value={product.id.toString()}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-[#8B5E3C] font-semibold text-sm">
                            {product.price?.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                      </Option>
                    ))
                  ) : (
                    <Option disabled>
                      <div className="text-center text-gray-400 py-2">
                        <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Không tìm thấy sản phẩm
                      </div>
                    </Option>
                  )}
                </Select>
              </div>
            </div>

            {/* Quantity and Price Card */}
            <div className="bg-white rounded-lg p-5 shadow border border-[#D4A574]">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#8B5E3C] mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Chi Tiết Số Lượng & Giá
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    label="Số lượng"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="!border-[#D4A574] focus:!border-[#8B5E3C]"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5E3C] font-medium">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <Input
                    label="Đơn giá"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="!border-[#D4A574] focus:!border-[#8B5E3C]"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5E3C] font-semibold text-sm">
                    ₫
                  </div>
                </div>
              </div>
            </div>

            {/* Subtotal Card */}
            <div className="bg-[#f9f5f0] rounded-lg p-5 shadow border border-[#D4A574]">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#8B5E3C] mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tổng Thành Tiền
              </label>
              <Input
                label="Thành tiền"
                name="subtotal"
                type="number"
                value={formData.subtotal || (formData.quantity && formData.price ? formData.quantity * formData.price : "")}
                onChange={handleInputChange}
                placeholder="Tự động tính nếu để trống"
                className="!border-[#D4A574] focus:!border-[#8B5E3C] bg-white"
              />
              {formData.quantity && formData.price && (
                <div className="mt-3 text-center">
                  <div className="inline-block bg-[#8B5E3C] text-white px-6 py-3 rounded-lg shadow">
                    <span className="text-sm font-medium">Tổng tiền: </span>
                    <span className="text-xl font-bold">
                      {(formData.quantity * formData.price).toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogBody>

        <DialogFooter className="bg-gradient-to-br from-[#f9f5f0] to-[#fffaf5] p-6 border-t border-[#D4A574]">
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outlined"
              color="red"
              onClick={onClose}
              className="flex-1 sm:flex-none border-2"
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Hủy Bỏ
            </Button>
            <Button
              className="flex-1 sm:flex-none bg-[#8B5E3C] hover:bg-[#a4714b] shadow"
              onClick={handleSubmit}
            >
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Thêm Vào Đơn
            </Button>
          </div>
        </DialogFooter>
      </div>
    </Dialog>
  );
}

export default Create;