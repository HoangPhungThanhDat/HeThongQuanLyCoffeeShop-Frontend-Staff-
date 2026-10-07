import axiosClient from "./axiosClient";

const TableAPI = {
  // Lấy danh sách tables
  getAll: () => axiosClient.get("/tables"),

  // Lấy chi tiết một table
  getById: (id) => axiosClient.get(`/tables/${id}`),

  // Thêm table mới
  create: (data) => axiosClient.post("/tables", data),

  // Cập nhật table
  update: (id, data) => axiosClient.put(`/tables/${id}`, data),

  // Xóa table
  delete: (id) => axiosClient.delete(`/tables/${id}`),
};

export default TableAPI;