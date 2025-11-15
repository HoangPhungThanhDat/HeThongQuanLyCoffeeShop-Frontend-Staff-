import axiosClient from "./axiosClient";

const AuthAPI = {
  login: (data) => axiosClient.post("/auth/login", data),
  

   logout: () => {
    localStorage.removeItem("token");
 
  }, 
};

export default AuthAPI;