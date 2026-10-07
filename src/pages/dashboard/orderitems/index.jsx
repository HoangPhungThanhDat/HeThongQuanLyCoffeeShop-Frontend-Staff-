
import { useState } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import "animate.css";

import { CoffeeLoader } from "@/widgets/loaders";
import { Pagination } from "@/widgets/pagination";
import {
  OrderItemsTable,
  OrderItemsHeader,
  OrderItemsStats,
  OrderItemsFilters,
} from "./components";
import Create from "./Create";
import Edit from "./Edit";
import Show from "./Show";

import { useOrderItems } from "./hooks/useOrderItems";
import { useOrderItemStats } from "./hooks/useOrderItemStats";
import { useOrderItemFormData } from "./hooks/useOrderItemFormData";
import { useOrderItemMutations } from "./hooks/useOrderItemMutations";
import { useSocketOrderItems } from "./hooks/useSocketOrderItems";

export function OrderItems() {
  const {
    orderItems,
    page,
    size,
    totalPages,
    totalElements,
    setPage,
    searchTerm,
    orderFilter,
    hasActiveFilters,
    setSearchTerm,
    setOrderFilter,
    clearFilters,
    isLoading,
    isFetching,
    refetch,
  } = useOrderItems();

  // ⭐ Stats toàn bộ — gọi API riêng
  const { data: stats } = useOrderItemStats();

  const { orders, products } = useOrderItemFormData();
  const { confirmAndDelete } = useOrderItemMutations();

  // ⭐ Socket real-time
  useSocketOrderItems({ enabled: true });

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openShowDialog, setOpenShowDialog] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);

  // ============ HANDLERS ============
  const handleShow = (item) => {
    setSelectedOrderItem(item);
    setOpenShowDialog(true);
  };

  const handleEdit = (item) => {
    setSelectedOrderItem(item);
    setOpenEditDialog(true);
  };

  const handleDelete = (id) => confirmAndDelete(id);

  // ============ LOADER ============
  if (isLoading) {
    return (
      <CoffeeLoader
        title="Đang pha chế chi tiết đơn"
        subtitle="Vui lòng chờ trong giây lát"
        brand="Coffee Shop Staff"
      />
    );
  }

  // ============ RENDER ============
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3] py-6 lg:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col gap-6">
        {/* PAGE HEADER */}
        <OrderItemsHeader
          stats={stats}
          onCreate={() => setOpenCreateDialog(true)}
          onRefresh={refetch}
        />

        {/* KPI CARDS */}
        <OrderItemsStats stats={stats} />

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
                    <ClipboardDocumentListIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <Typography className="font-bold text-white tracking-wide text-base lg:text-lg">
                      Danh Sách Chi Tiết Đơn
                    </Typography>
                    <Typography className="text-xs text-white/80 font-medium">
                      {totalElements > 0
                        ? `Trang ${page + 1}/${totalPages} — ${totalElements} items`
                        : "Chưa có items"}
                    </Typography>
                  </div>
                </div>

                <OrderItemsFilters
                  orders={orders}
                  orderFilter={orderFilter}
                  onOrderFilterChange={setOrderFilter}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onClear={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
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
                <OrderItemsTable
                  orderItems={orderItems}
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
        products={products}
        onClose={() => setOpenCreateDialog(false)}
      />

      <Edit
        key={selectedOrderItem?.id}
        open={openEditDialog}
        orderItem={selectedOrderItem}
        orders={orders}
        products={products}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedOrderItem(null);
        }}
      />

      <Show
        open={openShowDialog}
        orderItem={selectedOrderItem}
        onClose={() => {
          setOpenShowDialog(false);
          setSelectedOrderItem(null);
        }}
      />
    </div>
  );
}

export default OrderItems;