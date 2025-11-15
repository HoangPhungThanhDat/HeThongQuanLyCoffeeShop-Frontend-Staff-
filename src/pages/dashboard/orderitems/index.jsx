import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography, Button } from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import OrderItemAPI from "@/api/orderitemApi";
import OrderAPI from "@/api/orderApi";
import ProductAPI from "@/api/productApi";
import Swal from "sweetalert2";
import "animate.css";
import OrderItemsTable from "./components/OrderItemsTable";
import Create from "./create";
import Edit from "./edit";
import Show from "./show";
import { motion } from "framer-motion";
import socket from "../../../socket";

export function OrderItems() {
  const [orderItems, setOrderItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openShowDialog, setOpenShowDialog] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
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

  const fetchOrderItems = async () => {
    try {
      setLoading(true);
      const response = await OrderItemAPI.getAll();
      const sortedItems = response.data.sort((a, b) => b.id - a.id);
      setOrderItems(sortedItems);
      console.log("✅ Fetched order items:", sortedItems.length);
    } catch (error) {
      console.error("Lỗi:", error);
      showToast("error", "❌ Không thể tải danh sách order items!");
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

  const fetchProducts = async () => {
    try {
      const response = await ProductAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      showToast("error", "❌ Không thể tải danh sách sản phẩm!");
    }
  };

  // ✅ SOCKET LISTENER - Tự động cập nhật khi có món mới
  useEffect(() => {
    console.log("🔌 Kết nối Socket trong OrderItems...");

    socket.on("connect", () => {
      console.log("✅ Socket connected trong OrderItems:", socket.id);
    });

    // ✅ Lắng nghe thông báo thêm món (ĐÃ CẬP NHẬT)
    socket.on("items-added-to-order", (data) => {
      console.log("\n📦 ==========================================");
      console.log("📦 Nhận thông báo có món mới được thêm");
      console.log("📦 ==========================================");
      console.log("   - Order ID:", data.orderId);
      console.log("   - Added Items:", data.addedItems?.length || 0);
      console.log("   - New Total:", data.newTotal);
      console.log("   - Total Items in Order:", data.totalItems);
      console.log("==========================================\n");
      
      // Tự động refresh danh sách order items
      fetchOrderItems();
      
      // ✅ Hiển thị toast với thông tin chi tiết hơn
      const itemsText = data.addedItems?.length === 1 
        ? "1 món mới" 
        : `${data.addedItems?.length || 0} món mới`;
      
      showToast(
        "info", 
        `📦 Đơn #${data.orderId} thêm ${itemsText} - Tổng: ${(data.newTotal || 0).toLocaleString()}đ`
      );
    });

    // ✅ THÊM: Lắng nghe staff-notification (để đồng bộ)
    socket.on("staff-notification", (data) => {
      if (data.type === "items-added") {
        console.log("🔔 Staff notification: items added to order #" + data.orderId);
        // Refresh để đồng bộ
        fetchOrderItems();
      }
    });

    return () => {
      socket.off("connect");
      socket.off("items-added-to-order");
      socket.off("staff-notification");
      console.log("🔌 Đã ngắt Socket listener trong OrderItems");
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setPageLoading(true);
        await Promise.all([fetchOrderItems(), fetchOrders(), fetchProducts()]);
      } finally {
        setTimeout(() => setPageLoading(false), 1200);
      }
    };
    load();
  }, []);

  const handleShowOrderItem = (item) => {
    setSelectedOrderItem(item);
    setOpenShowDialog(true);
  };

  const handleEditOrderItem = (item) => {
    setSelectedOrderItem(item);
    setOpenEditDialog(true);
  };

  const handleDeleteOrderItem = async (id) => {
    const confirm = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    });

    if (confirm.isConfirmed) {
      try {
        await OrderItemAPI.delete(id);
        showToast("success", "🗑️ Xóa order item thành công!");
        fetchOrderItems();
      } catch (error) {
        showToast("error", "❌ Không thể xóa order item!");
      }
    }
  };

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
      <Card className="shadow-xl rounded-2xl border border-brown-200 bg-gradient-to-br from-[#f9f5f0] to-[#fffaf5]">
        <CardHeader
          variant="gradient"
          color="brown"
          className="mb-8 p-6 rounded-t-2xl bg-gradient-to-r from-[#8B5E3C] to-[#C89F77] shadow-md"
        >
          <div className="flex items-center justify-between">
            <Typography variant="h6" color="white" className="font-semibold tracking-wide">
              📦 Danh Sách Order Items
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
            <OrderItemsTable
              orderItems={orderItems}
              onShow={handleShowOrderItem}
              onEdit={handleEditOrderItem}
              onDelete={handleDeleteOrderItem}
            />
          )}
        </CardBody>
      </Card>

      <Create
        open={openCreateDialog}
        orders={orders}
        products={products}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={() => {
          fetchOrderItems();
          showToast("success", "🎉 Thêm order item thành công!");
        }}
      />

      <Edit
        open={openEditDialog}
        orderItem={selectedOrderItem}
        orders={orders}
        products={products}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedOrderItem(null);
        }}
        onSuccess={() => {
          fetchOrderItems();
          showToast("success", "✅ Cập nhật order item thành công!");
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