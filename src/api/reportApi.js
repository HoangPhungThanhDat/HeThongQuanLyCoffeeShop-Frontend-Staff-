
import axiosClient from "./axiosClient";

const reportApi = {
  getRevenue: async (from, to) => {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;

    const res = await axiosClient.get("/reports/revenue", { params });
    return res?.data !== undefined ? res.data : res;
  },
};

export default reportApi;