import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function Show({ open, table, onClose }) {
  if (!table) return null;

  const getStatusDisplay = (status) => {
    switch (status) {
      case "FREE":
        return "Trống";
      case "OCCUPIED":
        return "Đang dùng";
      case "RESERVED":
        return "Đã đặt";
      default:
        return "Trống";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "FREE":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "OCCUPIED":
        return "bg-rose-100 text-rose-700 border border-rose-200";
      case "RESERVED":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      default:
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "FREE":
        return "🟢";
      case "OCCUPIED":
        return "🔴";
      case "RESERVED":
        return "🟡";
      default:
        return "🟢";
    }
  };

  const InfoRow = ({ label, value, isStatus = false }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
      <Typography className="text-sm font-semibold text-gray-600">
        {label}
      </Typography>
      {isStatus ? (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${value.color}`}>
          <span>{value.icon}</span>
          <span>{value.text}</span>
        </div>
      ) : (
        <Typography className="text-sm font-bold text-gray-800">
          {value}
        </Typography>
      )}
    </div>
  );

  return (
    <Dialog open={open} handler={onClose} size="sm" className="bg-transparent shadow-none">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* HEADER */}
        <DialogHeader className="bg-gradient-to-r from-[#8B5E3C] to-[#C89F77] text-white p-6 flex justify-between items-center">
          <Typography variant="h5" className="font-bold">
            Chi Tiết Bàn
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
              label="Mã bàn"
              value={`#${table.id}`}
            />

            <InfoRow
              label="Tên bàn"
              value={table.number}
            />

            <InfoRow
              label="Số ghế"
              value={`${table.capacity} người`}
            />

            <InfoRow
              label="Trạng thái"
              isStatus={true}
              value={{
                text: getStatusDisplay(table.status),
                color: getStatusColor(table.status),
                icon: getStatusIcon(table.status),
              }}
            />

            <InfoRow
              label="Ngày tạo"
              value={table.createdAt ? new Date(table.createdAt).toLocaleString("vi-VN") : "N/A"}
            />

            <InfoRow
              label="Cập nhật lần cuối"
              value={table.updatedAt ? new Date(table.updatedAt).toLocaleString("vi-VN") : "N/A"}
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