
export const ORDER_ITEM_MESSAGES = {
    // Fetch
    FETCH_ERROR: "❌ Không thể tải danh sách order items!",
    FETCH_ORDERS_ERROR: "❌ Không thể tải danh sách đơn hàng!",
    FETCH_PRODUCTS_ERROR: "❌ Không thể tải danh sách sản phẩm!",
  
    // Create
    CREATE_SUCCESS: "🎉 Thêm order item thành công!",
    CREATE_ERROR: "❌ Không thể thêm order item!",
  
    // Update
    UPDATE_SUCCESS: "✅ Cập nhật order item thành công!",
    UPDATE_ERROR: "❌ Không thể cập nhật order item!",
    CHANGE_PRODUCT_SUCCESS: "✅ Đã thay đổi sản phẩm thành công!",
  
    // Delete
    DELETE_SUCCESS: "🗑️ Xóa order item thành công!",
    DELETE_ERROR: "❌ Không thể xóa order item!",
  
    // Validation
    ORDER_REQUIRED: "⚠️ Vui lòng chọn đơn hàng!",
    PRODUCT_REQUIRED: "⚠️ Vui lòng chọn sản phẩm!",
    QUANTITY_REQUIRED: "⚠️ Vui lòng nhập số lượng hợp lệ!",
    PRICE_REQUIRED: "⚠️ Vui lòng nhập đơn giá hợp lệ!",
    VALIDATION_ERROR: "⚠️ Vui lòng kiểm tra lại thông tin!",
    INCOMPLETE_FORM: "⚠️ Vui lòng nhập đầy đủ thông tin!",
  
    // Socket
    SOCKET_ITEMS_ADDED: (orderId, itemsText, total) =>
      `📦 Đơn #${orderId} thêm ${itemsText} - Tổng: ${total.toLocaleString()}đ`,
  };
  
  export const ORDER_ITEM_DELETE_CONFIRM = {
    title: "Bạn có chắc chắn muốn xóa?",
    text: "Hành động này không thể hoàn tác!",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  };