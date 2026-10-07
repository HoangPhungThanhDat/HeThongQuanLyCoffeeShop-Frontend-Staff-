
import Swal from "sweetalert2";

const baseConfig = {
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  customClass: {
    popup: "my-toast animate__animated animate__fadeInRight",
  },
};

export const toast = {
  success: (title) => Swal.fire({ ...baseConfig, icon: "success", title }),
  error: (title) => Swal.fire({ ...baseConfig, icon: "error", title }),
  warning: (title) => Swal.fire({ ...baseConfig, icon: "warning", title }),
  info: (title) => Swal.fire({ ...baseConfig, icon: "info", title }),
};