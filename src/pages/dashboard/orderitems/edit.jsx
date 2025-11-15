import { useState, useEffect, useMemo } from "react";
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

export function Edit({ open, orderItem, orders, products, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    orderId: "",
    productId: "",
    quantity: "",
    price: "",
    subtotal: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [originalProductId, setOriginalProductId] = useState(null);

  useEffect(() => {
    if (orderItem) {
      const productId = String(orderItem.productId || orderItem.product?.id || "");
      setFormData({
        orderId: String(orderItem.orderId || orderItem.order?.id || ""),
        productId: productId,
        quantity: String(orderItem.quantity || ""),
        price: String(orderItem.price || ""),
        subtotal: String(orderItem.subtotal || ""),
      });
      setOriginalProductId(productId); // Lưu product ID gốc
      setSearchTerm("");
    }
  }, [orderItem]);

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

  const removeVietnameseTones = (str) => {
    if (!str) return "";
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    
    const normalizedSearch = removeVietnameseTones(searchTerm)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
    
    return products.filter((p) => {
      const normalizedName = removeVietnameseTones(p.name)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
      
      return normalizedName.includes(normalizedSearch);
    });
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
      price: selected ? selected.price : prev.price,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.orderId || !formData.productId || !formData.quantity || !formData.price) {
      showToast("warning", "⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const productChanged = String(formData.productId) !== String(originalProductId);
    
    // Nếu sản phẩm thay đổi, cần xác nhận
    if (productChanged) {
      const oldProduct = products.find(p => p.id === Number(originalProductId));
      const newProduct = products.find(p => p.id === Number(formData.productId));
      
      const confirm = await Swal.fire({
        title: "Thay đổi sản phẩm?",
        html: `
          <div class="text-left space-y-2">
            <p><strong>Sản phẩm cũ:</strong> ${oldProduct?.name || 'N/A'}</p>
            <p><strong>Sản phẩm mới:</strong> ${newProduct?.name || 'N/A'}</p>
            <p class="text-red-600 mt-3">⚠️ Hệ thống sẽ xóa item cũ và tạo item mới</p>
          </div>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#22c55e",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      });

      if (!confirm.isConfirmed) {
        return;
      }
    }

    const payload = {
      order: { id: Number(formData.orderId) },
      product: { id: Number(formData.productId) },
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      subtotal: Number(formData.subtotal) || Number(formData.price) * Number(formData.quantity),
    };

    try {
      if (productChanged) {
        console.log("🔄 Sản phẩm thay đổi - Xóa item cũ và tạo mới...");
        
        // Bước 1: Xóa order item cũ
        await OrderItemAPI.delete(orderItem.id);
        console.log("✅ Đã xóa item cũ ID:", orderItem.id);
        
        // Bước 2: Tạo order item mới
        await OrderItemAPI.create(payload);
        console.log("✅ Đã tạo item mới với product ID:", formData.productId);
        
        showToast("success", "✅ Đã thay đổi sản phẩm thành công!");
      } else {
        console.log("📝 Chỉ cập nhật số lượng/giá...");
        
        // Chỉ cập nhật số lượng và giá (không đổi product)
        const updatePayload = {
          quantity: Number(formData.quantity),
          price: Number(formData.price),
          subtotal: Number(formData.subtotal) || Number(formData.price) * Number(formData.quantity),
        };
        
        await OrderItemAPI.update(orderItem.id, updatePayload);
        console.log("✅ Đã cập nhật item:", orderItem.id);
      }
      
      onClose();
      onSuccess();
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật:", error);
      console.error("❌ Error details:", error.response?.data);
      showToast("error", "❌ Không thể cập nhật order item!");
    }
  };

  const currentProduct = products.find(p => p.id === Number(formData.productId));
  const productChanged = String(formData.productId) !== String(originalProductId);

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
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold">Chỉnh Sửa Sản Phẩm</h3>
              <p className="text-amber-100 text-sm font-light mt-1">Cập nhật thông tin chi tiết đơn hàng</p>
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
                Đơn Hàng
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

            {/* Product Selection Card with Search */}
            <div className="bg-white rounded-lg p-5 shadow border border-[#D4A574]">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#8B5E3C] mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Tìm & Chọn Sản Phẩm
              </label>
              
              {/* Warning khi thay đổi sản phẩm */}
              {productChanged && (
                <div className="mb-3 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="text-sm">
                      <p className="font-semibold text-yellow-800">Cảnh báo thay đổi sản phẩm</p>
                      <p className="text-yellow-700 mt-1">Khi bạn thay đổi sản phẩm, hệ thống sẽ xóa item cũ và tạo item mới.</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Hiển thị sản phẩm hiện tại */}
              {currentProduct && !searchTerm && (
                <div className="mb-3 p-3 bg-[#f9f5f0] border border-[#D4A574] rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Sản phẩm hiện tại:</span>
                      <span className="font-semibold text-[#8B5E3C]">{currentProduct.name}</span>
                    </div>
                    <span className="text-[#8B5E3C] font-semibold">
                      {currentProduct.price?.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="relative">
                  <Input
                    label="Tìm kiếm sản phẩm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nhập tên sản phẩm để tìm kiếm..."
                    className="!border-[#D4A574] focus:!border-[#8B5E3C]"
                    icon={
                      <svg className="w-5 h-5 text-[#8B5E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    }
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white bg-[#8B5E3C] hover:bg-[#a4714b] px-2 py-1 rounded-full transition-colors"
                    >
                      ✕ Xóa
                    </button>
                  )}
                </div>
                
                <Select
                  key={`${formData.productId}-${searchTerm}`}
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
                        Không tìm thấy sản phẩm "{searchTerm}"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {productChanged ? "Xóa & Tạo Mới" : "Cập Nhật"}
            </Button>
          </div>
        </DialogFooter>
      </div>
    </Dialog>
  );
}

export default Edit;