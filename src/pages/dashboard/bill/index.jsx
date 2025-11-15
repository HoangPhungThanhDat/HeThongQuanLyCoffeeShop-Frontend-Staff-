import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography, Button } from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import BillApi from "@/api/billApi";
import OrderAPI from "@/api/orderApi";
import Swal from "sweetalert2";
import "animate.css";
import BillTable from "./components/BillTable";
import Create from "./Create";
import Edit from "./Edit";
import Show from "./Show";
import { motion } from "framer-motion";

export function Bill() {
  const [bills, setBills] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openShowDialog, setOpenShowDialog] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
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

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await BillApi.getAll();
      
      // ⭐ SẮP XẾP THEO ID GIẢM DẦN (MỚI NHẤT LÊN ĐẦU)
      const sortedBills = response.data.sort((a, b) => b.id - a.id);
      setBills(sortedBills);
    } catch (error) {
      console.error("Lỗi:", error);
      showToast("error", "❌ Không thể tải danh sách hóa đơn!");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await OrderAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      showToast("error", "❌ Không thể tải danh sách đơn hàng!");
    }
  };

  const handleShowBill = (bill) => {
    setSelectedBill(bill);
    setOpenShowDialog(true);
  };

  const handleEditBill = (bill) => {
    setSelectedBill(bill);
    setOpenEditDialog(true);
  };

  // ✅ SỬA: Load dữ liệu ban đầu
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setPageLoading(true);
        // ✅ CHỈ GỌI CÁC HÀM CÓ SẴN
        await Promise.all([
          fetchBills(),
          fetchOrders()
        ]);
      } catch (error) {
        console.error("Lỗi load dữ liệu:", error);
        showToast("error", "❌ Không thể tải dữ liệu!");
      } finally {
        // Delay nhẹ để animation loading mượt hơn
        setTimeout(() => setPageLoading(false), 1200);
      }
    };
    
    loadInitialData();
  }, []);

  if (pageLoading) {
    return (
      <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-gradient-to-br from-[#1e1b17] via-[#2c2623] to-[#3a2f2b] text-amber-100">
        
        {/* Ánh sáng nền lớn lung linh */}
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-yellow-600/10 via-amber-500/20 to-transparent blur-3xl"
          animate={{ opacity: [0.4, 0.6, 0.3], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
  
        {/* Cốc cà phê */}
        <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-tr from-[#4e342e] to-[#6d4c41] shadow-[0_0_50px_rgba(255,215,0,0.3)] border border-amber-400/40 backdrop-blur-md overflow-visible z-10">
          <span className="text-6xl">☕</span>
  
          {/* Quầng sáng vàng xoay quanh cốc */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-40 h-40 rounded-full bg-gradient-to-tr from-yellow-400/20 via-yellow-300/10 to-transparent blur-3xl"
              style={{ rotate: `${i * 90}deg` }}
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 6 + i, ease: "linear" }}
            />
          ))}
  
          {/* Muỗng quay tròn quanh cốc */}
          <motion.div
            className="absolute w-2 h-12 bg-gray-300 rounded-full shadow-md"
            style={{ top: "80%", left: "50%", transformOrigin: "0 -40px" }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          />
  
          {/* Khói cà phê */}
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
  
          {/* Hạt ánh sáng nhấp nháy gần cốc */}
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
  
        {/* Dòng chữ chính */}
        <motion.h1
          className="mt-16 text-2xl font-semibold tracking-wide bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,215,0,0.25)]"
          animate={{ backgroundPositionX: ["0%", "100%", "0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          Đang pha chế dữ liệu cho bạn...
        </motion.h1>
  
        {/* Subtle subtitle */}
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
      <Card className="shadow-xl rounded-2xl border border-brown-200 bg-gradient-to-br from-[#f9f5f0] to-[#fffaf5]">
        <CardHeader
          variant="gradient"
          color="brown"
          className="mb-8 p-6 rounded-t-2xl bg-gradient-to-r from-[#8B5E3C] to-[#C89F77] shadow-md"
        >
          <div className="flex items-center justify-between">
            <Typography variant="h6" color="white" className="font-semibold tracking-wide">
              🧾 Danh Sách Hóa Đơn
            </Typography>
            <Button
              size="sm"
              color="white"
              className="flex items-center gap-2 bg-[#8B5E3C] hover:bg-[#a4714b] transition-all duration-300"
              onClick={() => setOpenCreateDialog(true)}
            >
              <PlusIcon className="h-4 w-4" />
              Thêm mới
            </Button>
          </div>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {loading ? (
            <div className="text-center py-8 animate-pulse">
              <Typography className="text-brown-600">Đang tải...</Typography>
            </div>
          ) : (
            <BillTable
              bills={bills}
              onShow={handleShowBill}
              onEdit={handleEditBill}
            />
          )}
        </CardBody>
      </Card>

      {/* Dialogs */}
      <Create
        open={openCreateDialog}
        orders={orders}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={() => {
          fetchBills();
          showToast("success", "🎉 Thêm hóa đơn mới thành công!");
        }}
      />

      <Edit
        open={openEditDialog}
        bill={selectedBill}
        orders={orders}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedBill(null);
        }}
        onSuccess={() => {
          fetchBills();
          showToast("success", "✅ Cập nhật hóa đơn thành công!");
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