import { 
  Dialog, 
  DialogHeader, 
  DialogBody, 
  DialogFooter, 
  Typography, 
  Button 
} from "@material-tailwind/react";
import {
  XMarkIcon,
  CalendarIcon,
  BanknotesIcon,
  UserIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
  TagIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

export function Show({ open, order, onClose }) {
  const formatPrice = (v) => {
    if (!v) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(v);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "N/A";
    }
  };

  // Mapping trạng thái đơn hàng
  const statusConfig = {
    PENDING: {
      label: "Chờ xử lý",
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      icon: ClockIcon,
      gradient: "from-yellow-400 to-orange-400"
    },
    CONFIRMED: {
      label: "Đã xác nhận",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: CheckCircleIcon,
      gradient: "from-blue-400 to-cyan-400"
    },
    PREPARING: {
      label: "Đang pha chế",
      color: "bg-purple-50 text-purple-700 border-purple-200",
      icon: ClockIcon,
      gradient: "from-purple-400 to-pink-400"
    },
    READY: {
      label: "Sẵn sàng",
      color: "bg-green-50 text-green-700 border-green-200",
      icon: CheckCircleIcon,
      gradient: "from-green-400 to-emerald-400"
    },
    DELIVERING: {
      label: "Đang giao",
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      icon: TruckIcon,
      gradient: "from-indigo-400 to-blue-400"
    },
    COMPLETED: {
      label: "Hoàn thành",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: CheckCircleIcon,
      gradient: "from-emerald-400 to-teal-400"
    },
    PAID: {
      label: "Đã thanh toán",
      color: "bg-teal-50 text-teal-700 border-teal-200",
      icon: CheckCircleIcon,
      gradient: "from-teal-400 to-cyan-400"
    },
    CANCELLED: {
      label: "Đã hủy",
      color: "bg-red-50 text-red-700 border-red-200",
      icon: XCircleIcon,
      gradient: "from-red-400 to-rose-400"
    }
  };

  // ✅ XỬ LÝ AN TOÀN: Lấy status config với fallback
  const getStatusConfig = () => {
    if (!order || !order.status) {
      return statusConfig.PENDING;
    }
    return statusConfig[order.status] || {
      label: order.status,
      color: "bg-gray-50 text-gray-700 border-gray-200",
      icon: ClockIcon,
      gradient: "from-gray-400 to-gray-500"
    };
  };

  const currentStatus = getStatusConfig();
  const StatusIcon = currentStatus.icon;

  return (
    <AnimatePresence>
      {open && (
        <Dialog 
          open={open} 
          handler={onClose} 
          size="lg"
          className="bg-transparent shadow-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-gradient-to-br from-[#fffaf5] to-[#fff5eb] rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header với Coffee Theme */}
            <DialogHeader className="relative bg-gradient-to-r from-[#8B5E3C] via-[#A0826D] to-[#C89F77] text-white p-0 overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-30 translate-y-30"></div>
              </div>

              <div className="relative flex items-center justify-between p-6 w-full">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                    <span className="text-3xl">☕</span>
                  </div>
                  <div>
                    <Typography variant="h4" className="font-bold text-white mb-1 drop-shadow-lg">
                      Chi Tiết Đơn Hàng
                    </Typography>
                    <Typography className="text-white/90 text-sm font-medium">
                      Mã đơn: #{order?.id || "N/A"}
                    </Typography>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all border border-white/30"
                >
                  <XMarkIcon className="w-6 h-6 text-white" />
                </motion.button>
              </div>
            </DialogHeader>

            <DialogBody className="p-0 max-h-[70vh] overflow-y-auto">
              {order ? (
                <div className="p-6 space-y-6">
                  {/* Status Badge - Prominent */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center"
                  >
                    <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 ${currentStatus.color} shadow-md`}>
                      <StatusIcon className="w-6 h-6" />
                      <span className="font-bold text-lg">{currentStatus.label}</span>
                    </div>
                  </motion.div>

                  {/* Main Info Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Card 1: Thông tin cơ bản */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white rounded-2xl p-5 shadow-lg border border-brown-100 hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                          <CalendarIcon className="w-5 h-5 text-white" />
                        </div>
                        <Typography variant="h6" className="font-bold text-brown-900">
                          Thông Tin Cơ Bản
                        </Typography>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-brown-100">
                          <span className="text-brown-600 font-medium">Ngày tạo:</span>
                          <span className="text-brown-900 font-semibold">{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-brown-100">
                          <span className="text-brown-600 font-medium">Bàn số:</span>
                          <span className="inline-flex items-center gap-2 bg-brown-50 px-3 py-1 rounded-lg">
                            <MapPinIcon className="w-4 h-4 text-brown-600" />
                            <span className="text-brown-900 font-bold">
                              {order.table ? `Bàn ${order.table.number}` : "N/A"}
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-brown-600 font-medium">Nhân viên:</span>
                          <span className="inline-flex items-center gap-2 text-brown-900 font-semibold">
                            <UserIcon className="w-4 h-4 text-brown-600" />
                            {order.employee?.fullName || "Chưa phân công"}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Card 2: Thanh toán */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 shadow-lg border border-green-200 hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                          <BanknotesIcon className="w-5 h-5 text-white" />
                        </div>
                        <Typography variant="h6" className="font-bold text-green-900">
                          Thanh Toán
                        </Typography>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white rounded-xl p-4 shadow-sm">
                          <div className="text-green-600 text-sm font-semibold mb-2">TỔNG TIỀN</div>
                          <div className="text-3xl font-black text-green-700">
                            {formatPrice(order.totalAmount)}
                          </div>
                        </div>

                        {order.promotion && (
                          <div className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-lg flex items-center justify-center">
                              <TagIcon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 font-medium">Khuyến mãi</div>
                              <div className="text-sm font-bold text-rose-600">{order.promotion.name}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Ghi chú section */}
                  {order.notes && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 shadow-lg border border-blue-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                          <ClipboardDocumentListIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <Typography variant="h6" className="font-bold text-blue-900 mb-2">
                            Ghi Chú
                          </Typography>
                          <div className="bg-white rounded-xl p-4 shadow-sm">
                            <Typography className="text-gray-700 leading-relaxed">
                              {order.notes}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Order Items - nếu có */}
                  {order.orderItems && order.orderItems.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white rounded-2xl p-5 shadow-lg border border-brown-100"
                    >
                      <Typography variant="h6" className="font-bold text-brown-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">☕</span>
                        Danh Sách Món ({order.orderItems.length})
                      </Typography>
                      
                      <div className="space-y-3">
                        {order.orderItems.map((item, index) => (
                          <div 
                            key={item.id || index}
                            className="flex items-center justify-between p-4 bg-brown-50 rounded-xl hover:bg-brown-100 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-lg">{item.quantity || 0}</span>
                              </div>
                              <div>
                                <div className="font-bold text-brown-900">{item.product?.name || "N/A"}</div>
                                <div className="text-sm text-brown-600">{formatPrice(item.price)}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-brown-500 mb-1">Tổng</div>
                              <div className="font-bold text-lg text-green-700">{formatPrice(item.subtotal)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <XCircleIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <Typography className="text-center text-gray-500 italic text-lg">
                    Không có dữ liệu đơn hàng để hiển thị
                  </Typography>
                </div>
              )}
            </DialogBody>

            <DialogFooter className="bg-gradient-to-r from-brown-50 to-amber-50 p-6 border-t border-brown-100">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-[#8B5E3C] to-[#A0826D] hover:from-[#7a5235] hover:to-[#8f7260] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                >
                  Đóng
                </Button>
              </motion.div>
            </DialogFooter>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

export default Show;