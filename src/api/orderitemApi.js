import axiosClient from "./axiosClient";

const OrderItemAPI = {
  /**
   * Lấy danh sách order items có phân trang
   * @param {{ page?, size?, keyword?, orderId?, productId?, fromDate?, toDate?, sortBy?, sortDir? }} params
   */
  getAll: (params = {}) => {
    const {
      page = 0,
      size = 10,
      keyword,
      orderId,
      productId,
      fromDate,
      toDate,
      sortBy = "id",
      sortDir = "desc",
    } = params;

    const query = { page, size, sortBy, sortDir };
    if (keyword && keyword.trim()) query.keyword = keyword.trim();
    if (orderId != null && orderId !== "ALL") query.orderId = orderId;
    if (productId != null && productId !== "ALL") query.productId = productId;
    if (fromDate) query.fromDate = fromDate;
    if (toDate) query.toDate = toDate;

    return axiosClient.get("/order-items", { params: query });
  },

  // ⭐ THÊM MỚI — fix lỗi stats
  getStats: () => axiosClient.get("/order-items/stats"),

  // Lấy chi tiết một order item
  getById: (id) => axiosClient.get(`/order-items/${id}`),

  // Lấy items theo order
  getByOrderId: (orderId) => axiosClient.get(`/order-items/order/${orderId}`),

  // Thêm order item mới
  create: (data) => axiosClient.post("/order-items", data),

  // Cập nhật order item
  update: (id, data) => axiosClient.put(`/order-items/${id}`, data),

  // Xóa order item
  delete: (id) => axiosClient.delete(`/order-items/${id}`),
};

export default OrderItemAPI;