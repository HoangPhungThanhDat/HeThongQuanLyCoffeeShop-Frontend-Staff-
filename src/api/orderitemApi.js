import axiosClient from "./axiosClient";

const OrderItemAPI = {
  // Lấy danh sách order items
  getAll: () => axiosClient.get("/order-items"),

  // Lấy chi tiết một order item
  getById: (id) => axiosClient.get(`/order-items/${id}`),

  // Thêm order item mới
  create: (data) => axiosClient.post("/order-items", data),

  // Cập nhật order item
  update: (id, data) => axiosClient.put(`/order-items/${id}`, data),

  // Xóa order item
  delete: (id) => axiosClient.delete(`/order-items/${id}`),


   // Lấy danh sách sản phẩm theo orderId
   getByOrderId: (orderId) => axiosClient.get(`/order-items/order/${orderId}`),
};

export default OrderItemAPI;