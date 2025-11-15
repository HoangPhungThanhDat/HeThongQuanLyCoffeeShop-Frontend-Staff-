import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function Show({ open, orderItem, onClose }) {
  if (!orderItem) return null;

  const formatCurrency = (value) => {
    if (!value) return "0 đ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const InfoRow = ({ label, value, highlight = false }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
      <Typography className="text-sm font-semibold text-gray-600">
        {label}
      </Typography>
      <Typography className={`text-sm font-bold ${highlight ? 'text-amber-700' : 'text-gray-800'}`}>
        {value}
      </Typography>
    </div>
  );

  return (
    <Dialog open={open} handler={onClose} size="sm" className="bg-transparent shadow-none">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <DialogHeader className="bg-gradient-to-r from-[#8B5E3C] to-[#C89F77] text-white p-6 flex justify-between items-center">
          <Typography variant="h5" className="font-bold">
            Chi Tiết Order Item
          </Typography>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200"
          >
            <XMarkIcon className="w-5 h-5 text-white" />
          </button>
        </DialogHeader>

        {/* BODY */}
        <DialogBody className="p-6 bg-white">
          <div className="space-y-0">
            <InfoRow
              label="Mã item"
              value={`#${orderItem.id}`}
            />

            <InfoRow
              label="Mã đơn hàng"
              value={`#${orderItem.orderId}`}
            />

            <InfoRow
              label="Sản phẩm"
              value={orderItem.productName || `#${orderItem.productId}`}
            />

            <InfoRow
              label="Số lượng"
              value={`× ${orderItem.quantity}`}
            />

            <InfoRow
              label="Đơn giá"
              value={formatCurrency(orderItem.price)}
            />

            <InfoRow
              label="Thành tiền"
              value={formatCurrency(orderItem.subtotal)}
              highlight={true}
            />
          </div>
        </DialogBody>

        {/* FOOTER */}
        <DialogFooter className="p-6 pt-4 bg-white">
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#5d3a2f] shadow-md hover:shadow-lg transition-all duration-300 py-3 rounded-xl font-semibold text-white"
          >
            Đóng
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}

export default Show;