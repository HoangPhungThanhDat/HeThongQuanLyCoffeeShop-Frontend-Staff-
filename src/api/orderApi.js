// src/api/orderApi.js
import axiosClient from "./axiosClient";

const OrderAPI = {
  /**
   * Lấy danh sách đơn hàng có phân trang + filter
   * @param {{ page?, size?, keyword?, status?, fromDate?, toDate?, tableId?, sortBy?, sortDir? }} params
   * @returns {Promise} response.data = { content, page, size, totalElements, totalPages, ... }
   */
  getAll: (params = {}) => {
    const {
      page = 0,
      size = 10,
      keyword,
      status,
      fromDate,
      toDate,
      tableId,
      sortBy = "id",
      sortDir = "desc",
    } = params;

    const query = { page, size, sortBy, sortDir };
    if (keyword && keyword.trim()) query.keyword = keyword.trim();
    if (status && status !== "ALL") query.status = status;
    if (fromDate) query.fromDate = fromDate;
    if (toDate) query.toDate = toDate;
    if (tableId != null && tableId !== "ALL") query.tableId = tableId;

    return axiosClient.get("/orders", { params: query });
  },

  // ⭐ THÊM MỚI: thống kê toàn bộ đơn hàng
  getStats: () => axiosClient.get("/orders/stats"),

  // Lấy chi tiết một order
  getById: (id) => axiosClient.get(`/orders/${id}`),

  // Lấy orders theo status (nếu cần)
  getByStatus: (status) => axiosClient.get(`/orders/status/${status}`),

  // Thêm order mới
  create: (data) => axiosClient.post("/orders", data),

  // Cập nhật order
  update: (id, data) => axiosClient.put(`/orders/${id}`, data),

  // Xóa order
  delete: (id) => axiosClient.delete(`/orders/${id}`),

  // ⭐ THÊM MỚI: thêm món vào đơn hàng
  addItems: (orderId, items) =>
    axiosClient.post(`/orders/${orderId}/add-items`, items),

  // ⭐ THÊM MỚI: lấy tất cả orders cho dropdown (không phân trang)
  getAllForSelect: async () => {
    const res = await axiosClient.get("/orders", { params: { size: 1000 } });
    return res.data.content ?? [];
  },
};

export default OrderAPI;