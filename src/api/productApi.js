import axiosClient from "./axiosClient";
import axios from "axios";

// ✅ Lấy API URL từ biến môi trường
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const productApi = {
  getAll: () => axiosClient.get("/products"),
  getById: (id) => axiosClient.get(`/products/${id}`),

  // Thêm product mới với FormData
  create: (formData) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API_URL}/products`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Cập nhật product với FormData
  update: (id, formData) => {
    const token = localStorage.getItem("token");
    return axios.put(`${API_URL}/products/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  delete: (id) => axiosClient.delete(`/products/${id}`),
  getNewest: () => axiosClient.get("/products/newest"),
};

export default productApi;