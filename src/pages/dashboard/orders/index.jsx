// src/pages/dashboard/orders/index.jsx
import { useState, useCallback } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import "animate.css";

import { CoffeeLoader } from "@/widgets/loaders";
import { Pagination } from "@/widgets/pagination";
import {
  OrderTable,
  OrderKanban,
  OrderHeader,
  OrderStats,
  OrderSearch,
  OrderFilters,
  OrderNotificationModal,
} from "./components";
import Create from "./Create";
import Edit from "./Edit";
import Show from "./Show";

import { useOrders } from "./hooks/useOrders";
import { useOrderStats } from "./hooks/useOrderStats";
import { useOrderFormData } from "./hooks/useOrderFormData";
import { useOrderMutations } from "./hooks/useOrderMutations";
import { useOrderStatusMutation } from "./hooks/useOrderStatusMutation";
import { useSocketOrders } from "./hooks/useSocketOrders";

export function Orders() {
  const [viewMode, setViewMode] = useState("kanban"); // "kanban" | "table"

  // ⭐ useOrders nhận mode → biết dùng phân trang hay fetch all
  const {
    orders,
    filteredOrders,
    page,
    size,
    totalPages,
    totalElements,
    setPage,
    searchTerm,
    selectedStatus,
    hasActiveFilters,
    setSearchTerm,
    setSelectedStatus,
    clearFilters,
    isLoading,
    isFetching,
    refetch,
  } = useOrders({ mode: viewMode });

  // ⭐ Stats toàn bộ — gọi API riêng
  const { data: stats } = useOrderStats();

  const { tables, employees, promotions } = useOrderFormData();
  const { create, update } = useOrderMutations();
  const { updateStatus } = useOrderStatusMutation();

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openShowDialog, setOpenShowDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ============ HANDLERS ============
  const handleShow = useCallback((order) => {
    setSelectedOrder(order);
    setOpenShowDialog(true);
  }, []);

  const handleEdit = useCallback((order) => {
    setSelectedOrder(order);
    setOpenEditDialog(true);
  }, []);

  const handleDelete = async (id) => {
    // Staff không xóa đơn
  };

  // ⭐ Socket integration
  const { newOrderNotification, dismissNotification } = useSocketOrders({
    onShowOrder: handleShow,
  });

  // ============ LOADER ============
  if (isLoading) {
    return (
      <CoffeeLoader
        title="Đang pha chế đơn hàng"
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
        <OrderHeader
          activeOrders={stats?.activeOrders ?? 0}
          onCreate={() => setOpenCreateDialog(true)}
          onRefresh={refetch}
        />

        {/* STATS */}
        <OrderStats stats={stats} />

        {/* MAIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="w-full shadow-2xl rounded-3xl border border-amber-100 bg-white overflow-hidden">
            <CardHeader
              variant="gradient"
              className="m-0 p-4 lg:p-6 rounded-none bg-gradient-to-r from-[#8B5E3C] via-[#a4714b] to-[#C89F77] shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 flex-shrink-0">
                    <ClipboardDocumentListIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <Typography className="font-bold text-white text-base lg:text-lg">
                      {viewMode === "kanban"
                        ? "Bảng Kanban Đơn Hàng"
                        : "Danh Sách Đơn Hàng"}
                    </Typography>
                    <Typography className="text-xs text-white/80 font-medium">
                      {viewMode === "table"
                        ? totalElements > 0
                          ? `Trang ${page + 1}/${totalPages} — ${totalElements} đơn hàng`
                          : "Chưa có đơn hàng"
                        : `${filteredOrders.length} / ${orders.length} đơn hàng hiển thị`}
                    </Typography>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <OrderFilters
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    onClear={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                  />
                  <OrderSearch value={searchTerm} onChange={setSearchTerm} />
                </div>
              </div>
            </CardHeader>

            <CardBody className="p-0">
              {viewMode === "kanban" ? (
                // ⭐ KANBAN — hiển thị tất cả, KHÔNG phân trang
                <OrderKanban
                  orders={filteredOrders}
                  onShow={handleShow}
                  onEdit={handleEdit}
                  onUpdateStatus={updateStatus}
                />
              ) : (
                // ⭐ TABLE — phân trang
                <>
                  <div
                    className={
                      isFetching
                        ? "opacity-60 pointer-events-none transition-opacity duration-200"
                        : "transition-opacity duration-200"
                    }
                  >
                    <OrderTable
                      orders={filteredOrders}
                      onShow={handleShow}
                      onEdit={handleEdit}
                      onUpdateStatus={updateStatus}
                    />
                  </div>

                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    pageSize={size}
                    onPageChange={setPage}
                  />
                </>
              )}
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* NOTIFICATION MODAL */}
      <OrderNotificationModal
        notification={newOrderNotification}
        onDismiss={dismissNotification}
      />

      {/* DIALOGS */}
      <Create
        open={openCreateDialog}
        tables={tables}
        employees={employees}
        promotions={promotions}
        onClose={() => setOpenCreateDialog(false)}
      />

      <Edit
        key={selectedOrder?.id}
        open={openEditDialog}
        order={selectedOrder}
        tables={tables}
        employees={employees}
        promotions={promotions}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedOrder(null);
        }}
      />

      <Show
        open={openShowDialog}
        order={selectedOrder}
        onClose={() => {
          setOpenShowDialog(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}

export default Orders;