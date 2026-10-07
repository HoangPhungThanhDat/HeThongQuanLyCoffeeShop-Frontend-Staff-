import axiosClient from "./axiosClient";

const BillAPI = {
  /**
   * Lấy danh sách hoá đơn có phân trang
   * @param {{ page?, size?, keyword?, paymentStatus?, paymentMethod?,
   *           fromDate?, toDate?, sortBy?, sortDir? }} params
   */
  getAll: (params = {}) => {
    const {
      page = 0,
      size = 10,
      keyword,
      paymentStatus,
      paymentMethod,
      fromDate,
      toDate,
      sortBy = "id",
      sortDir = "desc",
    } = params;

    const query = { page, size, sortBy, sortDir };
    if (keyword && keyword.trim()) query.keyword = keyword.trim();
    if (paymentStatus && paymentStatus !== "ALL") query.paymentStatus = paymentStatus;
    if (paymentMethod && paymentMethod !== "ALL") query.paymentMethod = paymentMethod;
    if (fromDate) query.fromDate = fromDate;
    if (toDate) query.toDate = toDate;

    return axiosClient.get("/bills", { params: query });
  },

  // ⭐ THÊM MỚI — fix lỗi stats = 0
  getStats: () => axiosClient.get("/bills/stats"),

  // Lấy chi tiết một hóa đơn
  getById: (id) => axiosClient.get(`/bills/${id}`),

  // Lấy bill theo order
  getByOrderId: (orderId) => axiosClient.get(`/bills/order/${orderId}`),

  // Thêm hóa đơn mới
  create: (data) => axiosClient.post("/bills", data),

  // Cập nhật hóa đơn
  update: (id, data) => axiosClient.put(`/bills/${id}`, data),

  // Xóa hóa đơn
  delete: (id) => axiosClient.delete(`/bills/${id}`),

  // Lấy tất cả cho dropdown (không phân trang)
  getAllForSelect: async () => {
    const res = await axiosClient.get("/bills", { params: { size: 1000 } });
    return res.data.content ?? [];
  },
};

export default BillAPI;