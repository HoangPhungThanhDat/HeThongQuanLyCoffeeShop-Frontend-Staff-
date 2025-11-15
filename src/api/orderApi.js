import axiosClient from "./axiosClient";

const OrderAPI = {
  // Lấy danh sách orders
  getAll: () => axiosClient.get("/orders"),

  // Lấy chi tiết một orders
  getById: (id) => axiosClient.get(`/orders/${id}`),

  // Thêm orders mới
  create: (data) => axiosClient.post("/orders", data),

  // Cập nhật orders
  update: (id, data) => axiosClient.put(`/orders/${id}`, data),

  // Xóa orders
  delete: (id) => axiosClient.delete(`/orders/${id}`),
};

export default OrderAPI;