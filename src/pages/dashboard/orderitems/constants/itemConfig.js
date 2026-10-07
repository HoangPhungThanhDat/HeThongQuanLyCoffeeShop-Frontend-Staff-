

/**
 * Cấu hình hiển thị cho order item
 */
export const ITEM_CONFIG = {
    // Kích thước cố định
    MAX_QUANTITY: 1000,
    MAX_PRICE: 1_000_000_000,
  
    // Search debounce
    SEARCH_DEBOUNCE_MS: 300,
  };
  
  /**
   * Filter options cho đơn hàng
   */
  export const getOrderFilterLabel = (order) => {
    if (!order) return "N/A";
    return `#${order.id} · Bàn ${order.table?.number || "N/A"}`;
  };