
import { useState } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { ReceiptPercentIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import "animate.css";

import { CoffeeLoader } from "@/widgets/loaders";
import { Pagination } from "@/widgets/pagination";
import {
  BillTable,
  BillHeader,
  BillStats,
  BillFilters,
} from "./components";
import Create from "./Create";
import Edit from "./Edit";
import Show from "./Show";

import { useBills } from "./hooks/useBills";
import { useBillStats } from "./hooks/useBillStats";
import { useBillFormData } from "./hooks/useBillFormData";
import { useBillMutations } from "./hooks/useBillMutations";

export function Bill() {
  const {
    bills,
    page,
    size,
    totalPages,
    totalElements,
    setPage,
    searchTerm,
    statusFilter,
    methodFilter,
    hasActiveFilters,
    setSearchTerm,
    setStatusFilter,
    setMethodFilter,
    toggleStatusFilter,
    clearFilters,
    isLoading,
    isFetching,
    refetch,
  } = useBills();

  // ⭐ Stats toàn bộ — gọi API riêng
  const { data: stats } = useBillStats();

  const { orders } = useBillFormData();
  const { confirmAndDelete } = useBillMutations();

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openShowDialog, setOpenShowDialog] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // ============ HANDLERS ============
  const handleShow = (bill) => {
    setSelectedBill(bill);
    setOpenShowDialog(true);
  };

  const handleEdit = (bill) => {
    setSelectedBill(bill);
    setOpenEditDialog(true);
  };

  const handleDelete = (id) => confirmAndDelete(id);

  const handleStatsStatusClick = (status) => {
    if (status === "ALL") {
      setStatusFilter("ALL");
    } else {
      toggleStatusFilter(status);
    }
  };

  // ============ LOADER ============
  if (isLoading) {
    return (
      <CoffeeLoader
        title="Đang pha chế hóa đơn"
        subtitle="Vui lòng chờ trong giây lát"
        brand="Coffee Shop Staff"
      />
    );
  }

  // ============ RENDER ============
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3] py-6 lg:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col gap-6">
        {/* HEADER */}
        <BillHeader
          stats={stats}
          onCreate={() => setOpenCreateDialog(true)}
          onRefresh={refetch}
        />

        {/* KPI CARDS */}
        <BillStats
          stats={stats}
          statusFilter={statusFilter}
          onStatusClick={handleStatsStatusClick}
        />

        {/* MAIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="w-full shadow-2xl rounded-3xl border border-amber-100 bg-white overflow-hidden">
            <CardHeader
              variant="gradient"
              className="m-0 p-4 lg:p-6 rounded-none bg-gradient-to-r from-[#8B5E3C] via-[#a4714b] to-[#C89F77] shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 flex-shrink-0">
                    <ReceiptPercentIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <Typography className="font-bold text-white tracking-wide text-base lg:text-lg">
                      Danh Sách Hóa Đơn
                    </Typography>
                    <Typography className="text-xs text-white/80 font-medium">
                      {totalElements > 0
                        ? `Trang ${page + 1}/${totalPages} — ${totalElements} hóa đơn`
                        : "Chưa có hóa đơn"}
                    </Typography>
                  </div>
                </div>

                <BillFilters
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                  methodFilter={methodFilter}
                  onMethodChange={setMethodFilter}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onClear={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>

              {/* Legend */}
              <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap items-center gap-4">
                <Typography className="text-[10px] font-extrabold text-amber-100 uppercase tracking-widest">
                  Chú thích:
                </Typography>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-green-500 border-2 border-white/50" />
                  <span className="text-[10px] font-bold text-white">Đã thanh toán</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 border-2 border-white/50" />
                  <span className="text-[10px] font-bold text-white">Chờ thanh toán</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500 border-2 border-white/50" />
                  <span className="text-[10px] font-bold text-white">Thất bại</span>
                </div>
              </div>
            </CardHeader>

            <CardBody className="p-0">
              <div
                className={
                  isFetching
                    ? "opacity-60 pointer-events-none transition-opacity duration-200"
                    : "transition-opacity duration-200"
                }
              >
                <BillTable
                  bills={bills}
                  onShow={handleShow}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={size}
                onPageChange={setPage}
              />
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* DIALOGS */}
      <Create
        open={openCreateDialog}
        orders={orders}
        onClose={() => setOpenCreateDialog(false)}
      />

      <Edit
        key={selectedBill?.id}
        open={openEditDialog}
        bill={selectedBill}
        orders={orders}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedBill(null);
        }}
      />

      <Show
        open={openShowDialog}
        bill={selectedBill}
        onClose={() => {
          setOpenShowDialog(false);
          setSelectedBill(null);
        }}
      />
    </div>
  );
}

export default Bill;