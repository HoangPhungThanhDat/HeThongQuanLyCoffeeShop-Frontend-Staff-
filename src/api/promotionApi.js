import axiosClient from "./axiosClient";

const promotionApi = {
  // Lấy danh sách promotions
  getAll: () => axiosClient.get("/promotions"),

  // Lấy chi tiết một promotion
  getById: (id) => axiosClient.get(`/promotions/${id}`),

  // Thêm promotion mới
  create: (data) => axiosClient.post("/promotions", data),

  // Cập nhật promotion
  update: (id, data) => axiosClient.put(`/promotions/${id}`, data),

  // Xóa promotion
  delete: (id) => axiosClient.delete(`/promotions/${id}`),
};

export default promotionApi;