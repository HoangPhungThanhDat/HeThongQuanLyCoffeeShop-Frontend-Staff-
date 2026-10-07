
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import {
  RectangleStackIcon,
  UsersIcon,
  HashtagIcon,
  CalendarDaysIcon,
  XMarkIcon,
  CheckBadgeIcon,
  ArrowPathIcon,
  SparklesIcon,
  FingerPrintIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { getStatusConfig } from "./constants/tableConfig";
import { formatDate } from "./utils/formatters";
import { TablePreviewCard } from "./components/TablePreviewCard";

// ==================== INFO ITEM ====================
function InfoItem({ icon: Icon, label, value, highlight = false }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-amber-100 hover:border-[#8B5E3C]/30 transition-colors duration-200">
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#faf6f1] flex items-center justify-center">
        <Icon className="w-4 h-4 text-[#8B5E3C]" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </Typography>
        <Typography
          className={`text-sm font-semibold truncate ${
            highlight ? "text-[#8B5E3C] font-extrabold" : "text-gray-800"
          }`}
        >
          {value}
        </Typography>
      </div>
    </div>
  );
}

// ==================== MAIN ====================
export function Show({ open, table, onClose }) {
  if (!table) return null;

  const statusConfig = getStatusConfig(table.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Dialog open={open} handler={onClose} size="lg" className="bg-transparent shadow-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="relative bg-gradient-to-r from-[#8B5E3C] via-[#a4714b] to-[#C89F77] p-5 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 -left-4 w-20 h-20 rounded-full bg-white/10" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-1.5 rounded-lg bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <XMarkIcon className="h-4 w-4" strokeWidth={2.5} />
          </button>

          <div className="absolute top-3 left-3 z-20">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20">
              <SparklesIcon className="h-3 w-3 text-amber-200" />
              <span className="text-[9px] font-extrabold text-white uppercase tracking-widest">
                Bàn
              </span>
            </div>
          </div>

          <div className="relative flex items-center gap-4 z-10 pt-4">
            <div className="relative flex-shrink-0">
              <motion.div
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.4 }}
                className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${statusConfig.gradient} flex items-center justify-center shadow-2xl border-2 border-white/40`}
              >
                <div className="absolute inset-1.5 rounded-xl border border-white/20" />
                <span className="text-4xl drop-shadow-md">{statusConfig.emoji}</span>
              </motion.div>

              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center bg-white">
                <span className={`w-3 h-3 rounded-full ${statusConfig.dot}`} />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <Typography className="text-[10px] font-bold text-amber-100 uppercase tracking-widest">
                Chi tiết bàn
              </Typography>
              <Typography variant="h5" className="text-white font-extrabold tracking-tight truncate">
                {table.number}
              </Typography>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 border border-white/20">
                  <FingerPrintIcon className="w-3 h-3 text-white" />
                  <span className="text-[10px] font-bold text-white">#{table.id}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 border border-white/20">
                  <UsersIcon className="w-3 h-3 text-white" />
                  <span className="text-[10px] font-bold text-white">{table.capacity} chỗ</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 border border-white/20">
                  <span className="text-[10px]">{statusConfig.emoji}</span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    {statusConfig.label}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <DialogBody className="p-5 max-h-[55vh] overflow-y-auto bg-[#faf6f1]">
          <div className="space-y-4">
            {/* Quick stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-white border border-amber-100">
                <FingerPrintIcon className="h-4 w-4 text-[#8B5E3C] mb-1.5" />
                <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  Mã bàn
                </Typography>
                <Typography className="text-sm font-extrabold text-[#4e342e]">
                  #{table.id}
                </Typography>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] shadow-sm">
                <UsersIcon className="h-4 w-4 text-amber-200 mb-1.5" />
                <Typography className="text-[9px] font-bold text-amber-200/80 uppercase tracking-wider">
                  Số ghế
                </Typography>
                <Typography className="text-xs font-extrabold text-white truncate">
                  {table.capacity} chỗ
                </Typography>
              </div>

              <div className={`p-3 rounded-xl border bg-gradient-to-br ${statusConfig.light} ${statusConfig.border}`}>
                <StatusIcon className={`h-4 w-4 mb-1.5 ${statusConfig.text}`} strokeWidth={2} />
                <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  Trạng thái
                </Typography>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                  <Typography className={`text-xs font-extrabold ${statusConfig.text} truncate`}>
                    {statusConfig.label}
                  </Typography>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-amber-100">
                <InformationCircleIcon className="h-4 w-4 text-[#8B5E3C] mb-1.5" />
                <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  Mô tả
                </Typography>
                <Typography className="text-xs font-extrabold text-[#4e342e] truncate">
                  {statusConfig.sublabel}
                </Typography>
              </div>
            </div>

            {/* Preview sơ đồ bàn */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-4 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                <Typography className="text-[11px] font-extrabold uppercase text-[#6d4c41] tracking-widest">
                  Xem trước trên sơ đồ
                </Typography>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
              </div>

              <div className="p-4 rounded-2xl bg-white border border-amber-100">
                <div
                  className="relative rounded-xl p-6"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(139, 94, 60, 0.06) 1px, transparent 0)`,
                    backgroundSize: "20px 20px",
                  }}
                >
                  <div className="flex justify-center">
                    <TablePreviewCard
                      number={table.number}
                      capacity={table.capacity}
                      status={table.status}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin chi tiết */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-4 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                <Typography className="text-[11px] font-extrabold uppercase text-[#6d4c41] tracking-widest">
                  Thông tin chi tiết
                </Typography>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <InfoItem icon={HashtagIcon} label="Tên / Số bàn" value={table.number} highlight />
                <InfoItem icon={UsersIcon} label="Sức chứa" value={`${table.capacity} người`} />
                <InfoItem icon={RectangleStackIcon} label="Trạng thái" value={statusConfig.label} />
                <InfoItem
                  icon={InformationCircleIcon}
                  label="Mô tả"
                  value={statusConfig.sublabel}
                />
              </div>
            </div>

            {/* Lịch sử */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-4 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                <Typography className="text-[11px] font-extrabold uppercase text-[#6d4c41] tracking-widest">
                  Lịch sử hoạt động
                </Typography>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-amber-100">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center">
                    <CalendarDaysIcon className="h-4 w-4 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Ngày tạo
                    </Typography>
                    <Typography className="text-sm font-semibold text-gray-800">
                      {formatDate(table.createdAt)}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-amber-100">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#C89F77] to-[#a4714b] flex items-center justify-center">
                    <ArrowPathIcon className="h-4 w-4 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Cập nhật lần cuối
                    </Typography>
                    <Typography className="text-sm font-semibold text-gray-800">
                      {formatDate(table.updatedAt)}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#8B5E3C]/10 flex items-center justify-center">
                <SparklesIcon className="h-4 w-4 text-[#8B5E3C]" />
              </div>
              <Typography className="text-xs text-[#6d4c41] leading-relaxed">
                <span className="font-bold">Ghi chú:</span> Đây là thông tin chi
                tiết của bàn trong hệ thống Coffee Shop. Bàn hiển thị trên sơ
                đồ khu vực phục vụ với trạng thái tương ứng.
              </Typography>
            </div>
          </div>
        </DialogBody>

        {/* FOOTER */}
        <DialogFooter className="bg-white border-t border-amber-100 p-4 flex items-center justify-between gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center text-xs">
              ☕
            </div>
            <Typography className="text-xs text-[#6d4c41] font-bold">
              Coffee Shop Staff
            </Typography>
          </div>

          <Button
            onClick={onClose}
            className="ml-auto bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] text-white px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 normal-case font-bold flex items-center gap-2 text-sm"
          >
            <CheckBadgeIcon className="h-4 w-4" strokeWidth={2.5} />
            Đóng
          </Button>
        </DialogFooter>
      </motion.div>
    </Dialog>
  );
}

export default Show;