// src/pages/dashboard/orderitems/components/OrderItemChangeIndicator.jsx
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";

/**
 * Indicator hiển thị có thay đổi hay không — dùng cho Edit mode
 */
export function OrderItemChangeIndicator({ hasChanges, productChanged = false }) {
  if (hasChanges) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-4 w-full max-w-[300px] p-3 rounded-xl border-2 ${
          productChanged
            ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300"
            : "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
        }`}
      >
        <div className="flex items-center gap-2 justify-center">
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              productChanged ? "bg-yellow-500" : "bg-orange-500"
            }`}
          />
          <Typography
            className={`text-[10px] font-extrabold uppercase tracking-wider ${
              productChanged ? "text-yellow-700" : "text-orange-700"
            }`}
          >
            {productChanged ? "⚠️ Đổi sản phẩm" : "Có thay đổi"}
          </Typography>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mt-4 w-full max-w-[300px] p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
      <div className="flex items-center gap-2 justify-center">
        <span className="w-2 h-2 rounded-full bg-gray-400" />
        <Typography className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
          Chưa có thay đổi
        </Typography>
      </div>
    </div>
  );
}

export default OrderItemChangeIndicator;