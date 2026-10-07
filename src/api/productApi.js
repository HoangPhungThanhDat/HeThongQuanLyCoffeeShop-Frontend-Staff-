import axiosClient from "./axiosClient";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

const productApi = {
  /**
   * Lấy danh sách sản phẩm có phân trang
   * @param {{ page?: number, size?: number, keyword?: string,
   *           categoryId?: number|string, sortBy?: string, sortDir?: 'asc'|'desc' }} params
   * @returns {Promise} response.data = { content, page, size, totalElements, totalPages, ... }
   */
  getAll: (params = {}) => {
    const {
      page = 0,
      size = 10,
      keyword,
      categoryId,
      sortBy = "id",
      sortDir = "desc",
    } = params;

    const query = { page, size, sortBy, sortDir };
    if (keyword && keyword.trim()) query.keyword = keyword.trim();
    if (categoryId != null && categoryId !== "ALL") query.categoryId = categoryId;

    return axiosClient.get("/products", { params: query });
  },

  getById: (id) => axiosClient.get(`/products/${id}`),
  getNewest: () => axiosClient.get("/products/newest"),
  getStats: () => axiosClient.get("/products/stats"),
  // Tạo product mới — gửi FormData (ảnh + data)
  create: (formData) => {
    const token = localStorage.getItem("token");
    return axios.post(`${BASE_URL}/products`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Cập nhật product — gửi FormData
  update: (id, formData) => {
    const token = localStorage.getItem("token");
    return axios.put(`${BASE_URL}/products/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  delete: (id) => axiosClient.delete(`/products/${id}`),

  // ⭐ Upload ảnh riêng — gửi 1 file, nhận về URL Cloudinary
  uploadImage: (file) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    return axios.post(`${BASE_URL}/products/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default productApi;