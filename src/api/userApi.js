import axiosClient from "./axiosClient";
import axios from "axios";

const userApi = {
  getAll: () => axiosClient.get("/users"),
  getById: (id) => axiosClient.get(`/users/${id}`),

  // Thêm user mới với FormData
  create: (formData) => {
    const token = localStorage.getItem("token");
    return axios.post("http://localhost:8080/api/users", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Cập nhật user với FormData
  update: (id, formData) => {
    const token = localStorage.getItem("token");
    return axios.put(`http://localhost:8080/api/users/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  delete: (id) => axiosClient.delete(`/users/${id}`),
};

export default userApi;
