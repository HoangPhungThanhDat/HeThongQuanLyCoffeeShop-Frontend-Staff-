import axiosClient from "./axiosClient";

const BillAPI = {
  // Lấy danh sách hóa đơn
  getAll: () => axiosClient.get("/bills"),

  // Lấy chi tiết một hóa đơn
  getById: (id) => axiosClient.get(`/bills/${id}`),

  // Thêm hóa đơn mới
  create: (data) => axiosClient.post("/bills", data),

  // Cập nhật hóa đơn
  update: (id, data) => axiosClient.put(`/bills/${id}`, data),

  // Xóa hóa đơn
  delete: (id) => axiosClient.delete(`/bills/${id}`),
};

export default BillAPI;