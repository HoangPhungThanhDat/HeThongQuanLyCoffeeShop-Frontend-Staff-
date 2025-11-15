import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import TableAPI from "@/api/tableApi";
import Swal from "sweetalert2";
import "animate.css";
import TablesTable from "./components/TablesTable";
import Show from "./show";
import { motion } from "framer-motion";
import socket from "../../../socket";

export function Tables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openShowDialog, setOpenShowDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  const showToast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      customClass: {
        popup: "my-toast animate__animated animate__fadeInRight",
      },
    });
  };

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await TableAPI.getAll();
      setTables(response.data);
      console.log("✅ Fetched tables:", response.data.length);
    } catch (error) {
      console.error("Lỗi:", error);
      showToast("error", "❌ Không thể tải danh sách bàn!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CẬP NHẬT TRẠNG THÁI NHANH
  const handleStatusChange = async (tableId, newStatus) => {
    try {
      // Tìm bàn hiện tại
      const currentTable = tables.find(t => t.id === tableId);
      
      if (currentTable.status === newStatus) {
        showToast("info", "ℹ️ Trạng thái không thay đổi");
        return;
      }

      // Hiển thị loading
      const loadingToast = Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "⏳ Đang cập nhật...",
        showConfirmButton: false,
        timer: 1000,
      });

      // Gọi API update (dùng luôn API edit có sẵn)
      await TableAPI.update(tableId, {
        ...currentTable,
        status: newStatus
      });

      // Refresh lại danh sách
      await fetchTables();

      // Hiển thị thông báo thành công
      const statusText = newStatus === "OCCUPIED" 
        ? "Đang dùng 🔴" 
        : newStatus === "FREE" 
        ? "Trống 🟢" 
        : "Đã đặt 🟡";
      
      showToast("success", `✅ Đã đổi sang: ${statusText}`);

    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      showToast("error", "❌ Không thể cập nhật trạng thái!");
    }
  };

  // Socket.IO listener
  useEffect(() => {
    fetchTables();

    console.log("🔌 Đang kết nối Socket.IO cho Tables...");
    
    socket.on("connect", () => {
      console.log("✅ Socket connected trong Tables:", socket.id);
    });

    socket.on("table-status-changed", async (data) => {
      console.log("\n🪑 ==========================================");
      console.log("🪑 NHẬN CẬP NHẬT TRẠNG THÁI BÀN");
      console.log("🪑 ==========================================");
      console.log(`   - Table ID: ${data.tableId}`);
      console.log(`   - Table Number: ${data.tableNumber}`);
      console.log(`   - New Status: ${data.newStatus}`);
      console.log(`   - Order ID: ${data.orderId}`);
      console.log(`   - Timestamp: ${data.timestamp}`);
      console.log("==========================================\n");
      
      await fetchTables();
      
      const statusText = data.newStatus === "OCCUPIED" 
        ? "Đang dùng" 
        : data.newStatus === "FREE" 
        ? "Trống" 
        : "Đã đặt";
      
      const statusIcon = data.newStatus === "OCCUPIED" 
        ? "🔴" 
        : data.newStatus === "FREE" 
        ? "🟢" 
        : "🟡";
      
      showToast("info", `${statusIcon} Bàn ${data.tableNumber} → ${statusText}`);
    });

    return () => {
      socket.off("connect");
      socket.off("table-status-changed");
      console.log("🔌 Đã ngắt kết nối Socket listeners trong Tables");
    };
  }, []);

  const handleShowTable = (table) => {
    setSelectedTable(table);
    setOpenShowDialog(true);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setPageLoading(true);
        await fetchTables();
      } finally {
        setTimeout(() => setPageLoading(false), 1200);
      }
    };
    load();
  }, []);

  if (pageLoading) {
    return (
      <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-gradient-to-br from-[#1e1b17] via-[#2c2623] to-[#3a2f2b] text-amber-100">
        
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-yellow-600/10 via-amber-500/20 to-transparent blur-3xl"
          animate={{ opacity: [0.4, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
  
        <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-tr from-[#4e342e] to-[#6d4c41] shadow-[0_0_50px_rgba(255,215,0,0.3)] border border-amber-400/40 backdrop-blur-md overflow-visible z-10">
          <span className="text-6xl">☕</span>
  
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-40 h-40 rounded-full bg-gradient-to-tr from-yellow-400/20 via-yellow-300/10 to-transparent blur-3xl"
              style={{ rotate: `${i * 90}deg` }}
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 6 + i, ease: "linear" }}
            />
          ))}
  
          <motion.div
            className="absolute w-2 h-12 bg-gray-300 rounded-full shadow-md"
            style={{ top: "80%", left: "50%", transformOrigin: "0 -40px" }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          />
  
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-12 w-10 h-32 bg-gradient-to-t from-transparent via-white/40 to-transparent blur-2xl opacity-60"
              style={{
                left: `${48 + i * 12}px`,
                transform: `rotate(${i % 2 === 0 ? -10 : 10}deg)`,
              }}
              animate={{
                y: [0, -80, 0],
                opacity: [0.4, 0.7, 0.2],
                scaleX: [1, 0.8, 1],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.8,
              }}
            />
          ))}
  
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-amber-300/70 blur-sm"
              initial={{
                top: `${Math.random() * 60 + 10}px`,
                left: `${Math.random() * 60 - 30}px`,
              }}
              animate={{
                scale: [0.5, 1.2, 0.5],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 1.5,
              }}
            />
          ))}
        </div>
  
        <motion.h1
          className="mt-16 text-2xl font-semibold tracking-wide bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,215,0,0.25)]"
          animate={{ backgroundPositionX: ["0%", "100%", "0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          Đang pha chế dữ liệu cho bạn...
        </motion.h1>
  
        <motion.p
          className="mt-2 text-sm text-amber-200 opacity-70"
          animate={{ opacity: [0.4, 1, 0.6, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Vui lòng chờ trong giây lát ☕✨
        </motion.p>
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card className="shadow-2xl rounded-3xl border border-gray-100 bg-white">
        <CardHeader
          variant="gradient"
          color="brown"
          className="mb-8 p-6 rounded-t-2xl bg-gradient-to-r from-[#8B5E3C] to-[#C89F77] shadow-md"
        >
          <div className="flex items-center justify-between">
            <Typography variant="h6" color="white" className="font-semibold tracking-wide">
              🪑 Danh Sách Bàn
            </Typography>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
              <Typography className="text-white font-semibold text-sm">
                Tổng: {tables.length} bàn
              </Typography>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {loading ? (
            <div className="text-center py-12 animate-pulse">
              <div className="text-6xl mb-4">⏳</div>
              <Typography className="text-gray-500 font-medium">Đang tải dữ liệu...</Typography>
            </div>
          ) : (
            <TablesTable
              tables={tables}
              onShow={handleShowTable}
              onStatusChange={handleStatusChange}
            />
          )}
        </CardBody>
      </Card>
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