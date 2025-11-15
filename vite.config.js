

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3003,       // Cổng muốn chạy (đổi tùy ý)
    strictPort: false, // false = nếu cổng 3000 bị chiếm thì Vite tự nhảy sang cổng khác
    open: true,        // Tự mở trình duyệt khi start (tuỳ chọn)
  },
});
