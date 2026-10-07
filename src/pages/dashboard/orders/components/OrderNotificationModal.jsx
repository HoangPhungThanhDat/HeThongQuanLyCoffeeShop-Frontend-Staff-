
import { motion, AnimatePresence } from "framer-motion";
import { ORDER_MESSAGES } from "../constants/messages";

/**
 * Modal thông báo đơn hàng mới (từ SocketContext)
 */
export function OrderNotificationModal({ notification, onDismiss }) {
  return (
    <AnimatePresence>
      {notification && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            onClick={onDismiss}
          />
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-6 right-6 z-[70] w-[90%] max-w-lg"
          >
            <div className="relative bg-gradient-to-br from-[#2c1810] via-[#3d2415] to-[#4a2c1a] rounded-3xl shadow-2xl border-2 border-amber-600/50 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl">☕</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-amber-100 mb-1">
                    {ORDER_MESSAGES.NEW_ORDER_TITLE}
                  </h3>
                  <p className="text-amber-300/80 text-sm">
                    {ORDER_MESSAGES.NEW_ORDER_DESC}
                  </p>
                </div>
              </div>

              <div className="bg-black/20 rounded-2xl p-4 mb-4 border border-amber-600/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🪑</span>
                    <div>
                      <p className="text-amber-200/70 text-xs">Số bàn</p>
                      <p className="text-amber-100 font-bold text-xl">
                        {notification.tableNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-200/70 text-xs mb-1">Tổng tiền</p>
                    <p className="text-amber-400 font-bold text-2xl">
                      {notification.totalPrice?.toLocaleString()}đ
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onDismiss}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {ORDER_MESSAGES.NEW_ORDER_ACCEPT}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default OrderNotificationModal;