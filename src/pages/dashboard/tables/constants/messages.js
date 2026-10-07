
export const TABLE_MESSAGES = {
    // Fetch
    FETCH_ERROR: "❌ Không thể tải danh sách bàn!",
  
    // Update status
    UPDATE_SUCCESS: "✅ Đã đổi trạng thái bàn!",
    UPDATE_ERROR: "❌ Không thể cập nhật trạng thái!",
    NO_CHANGE: "ℹ️ Trạng thái không thay đổi",
  
    // Socket
    SOCKET_STATUS_CHANGED: (tableNumber, statusText, statusIcon) =>
      `${statusIcon} Bàn ${tableNumber} → ${statusText}`,
  };
  
  /**
   * Text hiển thị khi đổi status
   */
  export const STATUS_TEXT_MAP = {
    FREE: "Trống ☕",
    OCCUPIED: "Đang dùng 🫖",
    RESERVED: "Đã đặt 🕰️",
  };
  
  export const STATUS_TEXT_SHORT = {
    FREE: "Trống",
    OCCUPIED: "Đang dùng",
    RESERVED: "Đã đặt",
  };
  
  export const STATUS_ICON_MAP = {
    FREE: "☕",
    OCCUPIED: "🫖",
    RESERVED: "🕰️",
  };