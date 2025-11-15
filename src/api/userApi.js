import axiosClient from "./axiosClient";
import axios from "axios";

// ✅ Lấy API URL từ biến môi trường
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const userApi = {
  getAll: () => axiosClient.get("/users"),
  getById: (id) => axiosClient.get(`/users/${id}`),

  // Thêm user mới với FormData
  create: (formData) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API_URL}/users`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Cập nhật user với FormData
  update: (id, formData) => {
    const token = localStorage.getItem("token");
    return axios.put(`${API_URL}/users/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  delete: (id) => axiosClient.delete(`/users/${id}`),
};

export default userApi;