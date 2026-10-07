// src/pages/dashboard/tables/index.jsx
import { useState } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { RectangleStackIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import "animate.css";

import { CoffeeLoader } from "@/widgets/loaders";
import {
  TablesTable,
  TablesHeader,
  TablesStats,
  TablesSearch,
  TablesFilters,
} from "./components";
import Show from "./Show";

import { useTables } from "./hooks/useTables";
import { useTableStatusMutation } from "./hooks/useTableStatusMutation";
import { useSocketTables } from "./hooks/useSocketTables";
import { TABLE_STATUS_OPTIONS } from "./constants/tableConfig";

export function Tables() {
  const {
    tables,
    filteredTables,
    stats,
    searchTerm,
    statusFilter,
    hasActiveFilters,
    setSearchTerm,
    setStatusFilter,
    toggleStatusFilter,
    clearFilters,
    isLoading,
    refetch,
  } = useTables();

  const { updateStatus } = useTableStatusMutation();

  // ⭐ Socket.IO real-time
  useSocketTables({ enabled: true });

  const [openShowDialog, setOpenShowDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  // ============ HANDLERS ============
  const handleShow = (table) => {
    setSelectedTable(table);
    setOpenShowDialog(true);
  };

  const handleStatusChange = async (tableId, newStatus) => {
    const currentTable = tables.find((t) => t.id === tableId);
    if (!currentTable) return;
    await updateStatus(tableId, currentTable, newStatus);
  };

  // ============ LOADER ============
  if (isLoading) {
    return (
      <CoffeeLoader
        title="Đang pha chế sơ đồ bàn"
        subtitle="Vui lòng chờ trong giây lát"
        brand="Coffee Shop Staff"
      />
    );
  }

  // ============ RENDER ============
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3] py-6 lg:py-8 2xl:py-10">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 flex flex-col gap-6 lg:gap-8">
        {/* Page Header */}
        <TablesHeader onRefresh={refetch} />

        {/* Stats */}
        <TablesStats
          stats={stats}
          statusFilter={statusFilter}
          onStatusClick={toggleStatusFilter}
        />

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          <Card className="w-full shadow-2xl rounded-3xl border border-amber-100 bg-white overflow-hidden">
            <CardHeader
              variant="gradient"
              className="m-0 p-4 lg:p-6 2xl:p-7 rounded-none bg-gradient-to-r from-[#8B5E3C] via-[#a4714b] to-[#C89F77] shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 flex-shrink-0">
                    <RectangleStackIcon className="w-5 h-5 2xl:w-6 2xl:h-6 text-white" />
                  </div>
                  <div>
                    <Typography
                      variant="h6"
                      className="font-bold text-white tracking-wide text-base lg:text-lg 2xl:text-xl"
                    >
                      Sơ Đồ Bàn
                    </Typography>
                    <Typography className="text-xs 2xl:text-sm text-white/80 font-medium">
                      {filteredTables.length} / {tables.length} bàn hiển thị
                    </Typography>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <TablesFilters
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    onClear={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                  />
                  <TablesSearch value={searchTerm} onChange={setSearchTerm} />
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap items-center gap-4">
                <Typography className="text-[10px] font-extrabold text-amber-100 uppercase tracking-widest">
                  Chú thích:
                </Typography>
                {TABLE_STATUS_OPTIONS.map((s) => (
                  <div key={s.value} className="flex items-center gap-1.5">
                    <span className={`w-3 h-3 rounded-full ${s.dot} border-2 border-white/50`} />
                    <span className="text-[10px] font-bold text-white">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardHeader>

            <CardBody className="p-0">
              <TablesTable
                tables={filteredTables}
                onShow={handleShow}
                onStatusChange={handleStatusChange}
              />
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Show dialog */}
      <Show
        open={openShowDialog}
        table={selectedTable}
        onClose={() => {
          setOpenShowDialog(false);
          setSelectedTable(null);
        }}
      />
    </div>
  );
}

export default Tables;