import axiosClient from "./axiosClient";

const CategoryAPI = {
  // Lấy danh sách categories
  getAll: () => axiosClient.get("/categories"),

  // Lấy chi tiết một category
  getById: (id) => axiosClient.get(`/categories/${id}`),

  // Thêm category mới
  create: (data) => axiosClient.post("/categories", data),

  // Cập nhật category
  update: (id, data) => axiosClient.put(`/categories/${id}`, data),

  // Xóa category
  delete: (id) => axiosClient.delete(`/categories/${id}`),
};

export default CategoryAPI;