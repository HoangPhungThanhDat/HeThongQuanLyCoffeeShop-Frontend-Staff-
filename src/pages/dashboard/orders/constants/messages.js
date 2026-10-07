
export const ORDER_MESSAGES = {
    // Fetch
    FETCH_ERROR: "❌ Không thể tải danh sách đơn hàng!",
    FETCH_TABLES_ERROR: "❌ Không thể tải danh sách bàn!",
    FETCH_EMPLOYEES_ERROR: "❌ Không thể tải danh sách nhân viên!",
    FETCH_PROMOTIONS_ERROR: "❌ Không thể tải danh sách khuyến mãi!",
  
    // Create
    CREATE_SUCCESS: "🎉 Thêm đơn hàng mới thành công!",
    CREATE_ERROR: "❌ Không thể thêm đơn hàng!",
  
    // Update
    UPDATE_SUCCESS: "✅ Cập nhật đơn hàng thành công!",
    UPDATE_ERROR: "❌ Không thể cập nhật đơn hàng!",
  
    // Update status
    UPDATE_STATUS_SUCCESS: (label) => `✅ Đã cập nhật sang "${label}"`,
    UPDATE_STATUS_ERROR: "❌ Không thể cập nhật trạng thái!",
    ORDER_NOT_FOUND: "❌ Không tìm thấy đơn hàng!",
    UPDATE_TABLE_ERROR: "❌ Lỗi cập nhật bàn!",
  
    // Delete
    DELETE_SUCCESS: "🗑️ Xóa đơn hàng thành công!",
    DELETE_ERROR: "❌ Không thể xóa đơn hàng!",
  
    // Socket
    NEW_ORDER_TITLE: "🔔 Đơn Hàng Mới!",
    NEW_ORDER_DESC: "Vui lòng xử lý đơn hàng này",
    NEW_ORDER_ACCEPT: "✓ Đã Nhận - Bắt Đầu Xử Lý",
  
    // Validation
    TABLE_REQUIRED: "⚠️ Vui lòng chọn bàn!",
    EMPLOYEE_REQUIRED: "⚠️ Vui lòng chọn nhân viên!",
    AMOUNT_REQUIRED: "⚠️ Vui lòng nhập tổng tiền hợp lệ!",
    VALIDATION_ERROR: "⚠️ Vui lòng kiểm tra lại thông tin!",
  };
  
  export const ORDER_DELETE_CONFIRM = {
    title: "Bạn có chắc chắn muốn xóa?",
    text: "Hành động này không thể hoàn tác!",
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  };
  
  /**
   * Text hiển thị status (dùng cho toast update)
   */
  export const STATUS_LABEL_MAP = {
    PENDING: "Đang chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    PREPARING: "Đang chuẩn bị",
    SERVED: "Đã phục vụ",
    PAID: "Đã thanh toán",
    CANCELLED: "Đã hủy",
  };