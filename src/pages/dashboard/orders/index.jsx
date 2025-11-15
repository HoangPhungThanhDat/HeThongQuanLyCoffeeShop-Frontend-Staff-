import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

import OrderTable from "./components/OrderTable";
import Create from "./Create";
import Edit from "./Edit";
import Show from "./Show";

import OrderAPI from "@/api/orderApi";
import TableAPI from "@/api/tableApi";
import EmployeeAPI from "@/api/userApi";
import PromotionAPI from "@/api/promotionApi";

import socket from "../../../socket";
import Swal from "sweetalert2";
import "animate.css";

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [promotions, setPromotions] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  // Dialog states
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openShowDialog, setOpenShowDialog] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  // State cho thông báo đơn hàng mới
  const [newOrderNotification, setNewOrderNotification] = useState(null);

  // === SweetAlert2 toast helper ===
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
      showClass: {
        popup: "animate__animated animate__slideInRight",
      },
      hideClass: {
        popup: "animate__animated animate__slideOutRight",
      },
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  };

  // Hàm lấy nhãn trạng thái
  const getStatusLabel = (status) => {
    switch (status) {
      case "PENDING": return "Đang chờ xác nhận";
      case "CONFIRMED": return "Đã xác nhận";
      case "PREPARING": return "Đang chuẩn bị";
      case "SERVED": return "Đã phục vụ";
      case "PAID": return "Đã thanh toán";
      case "CANCELLED": return "Đã hủy";
      default: return "Không xác định";
    }
  };

  // Hàm hiển thị thông báo đơn hàng mới với âm thanh
  const showNewOrderNotification = (orderData) => {
    // Phát âm thanh thông báo - sử dụng Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      const playBeep = (frequency, startTime, duration) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);
        
        oscillator.start(audioContext.currentTime + startTime);
        oscillator.stop(audioContext.currentTime + startTime + duration);
      };
      
      playBeep(800, 0, 0.1);
      playBeep(1000, 0.15, 0.1);
      playBeep(1200, 0.3, 0.15);
      
    } catch (err) {
      console.log('Audio play failed:', err);
    }
    
    setNewOrderNotification(orderData);
  };

  // Thêm style toast
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .swal2-popup.my-toast {
        background-color: #f0fff4 !important;
        color: #166534 !important;
        font-weight: bold;
        border-left: 6px solid #22c55e;
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
        padding: 1rem;
        border-radius: 10px;
      }
      .swal2-timer-progress-bar {
        background: #22c55e !important;
        height: 4px;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // === Socket.IO listeners ===
  useEffect(() => {
    console.log("🔌 Đang kết nối Socket.IO từ trang Orders...");

    // Kết nối socket
    socket.on("connect", () => {
      console.log("✅ Socket connected trong Orders:", socket.id);
    });

    // Nhận đơn hàng mới từ khách hàng
    socket.on("new-order", (orderData) => {
      console.log("📦 Nhận đơn hàng mới qua Socket.IO:", orderData);
      showNewOrderNotification(orderData);
      fetchOrders();
    });

    // Nhận cảnh báo đơn hàng
    socket.on("order-warning", async (data) => {
      console.log("⚠️ Nhận cảnh báo:", data);
      await Swal.fire({
        title: `Cảnh báo đơn #${data.orderId}`,
        text: data.message,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Đóng",
      });
    });

    // Nhận yêu cầu hủy đơn từ khách hàng
    socket.on("order-cancel-request", async (data) => {
      console.log("🚫 Nhận yêu cầu hủy đơn:", data);
      
      const result = await Swal.fire({
        title: "Yêu cầu hủy đơn hàng",
        html: `
          <p>Khách hàng yêu cầu hủy đơn <strong>#${data.orderId}</strong></p>
          <p class="text-sm text-gray-600 mt-2">Thời gian: ${new Date(data.requestedAt).toLocaleString('vi-VN')}</p>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Đồng ý hủy",
        cancelButtonText: "Từ chối",
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
      });

      if (result.isConfirmed) {
        const order = orders.find(o => o.id === parseInt(data.orderId) || o.id === data.orderId);
        if (order) {
          await handleUpdateStatus(data.orderId, "CANCELLED");
          showToast("success", "✅ Đã hủy đơn hàng theo yêu cầu khách hàng");
        }
      } else {
        showToast("info", "ℹ️ Đã từ chối yêu cầu hủy đơn");
      }
    });

    // ✅ NHẬN THÔNG BÁO THÊM MÓN
    socket.on("staff-notification", async (data) => {
      console.log("\n📢 ==========================================");
      console.log("📢 Nhận thông báo từ khách hàng");
      console.log("📢 ==========================================");
      console.log("   - Type:", data.type);
      console.log("   - Order ID:", data.orderId);
      console.log("   - Items:", data.items?.length || 0);
      console.log("   - Additional Amount:", data.additionalAmount);
      console.log("   - New Total:", data.newTotal);
      console.log("==========================================\n");
      
      if (data.type === "items-added") {
        // Phát âm thanh
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const playBeep = (frequency, startTime, duration) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);
            oscillator.start(audioContext.currentTime + startTime);
            oscillator.stop(audioContext.currentTime + startTime + duration);
          };
          playBeep(600, 0, 0.1);
          playBeep(800, 0.1, 0.15);
        } catch (err) {
          console.log('Audio play failed:', err);
        }

        // ✅ REFRESH DANH SÁCH ORDERS
        console.log("🔄 Đang refresh danh sách orders...");
        await fetchOrders();
        console.log("✅ Đã refresh xong!");

        // Hiển thị thông báo
        const result = await Swal.fire({
          title: "🍽️ Khách hàng thêm món!",
          html: `
            <div class="text-left">
              <p class="mb-2">Đơn hàng <strong>#${data.orderId}</strong> vừa thêm ${data.items?.length || 0} món mới:</p>
              <ul class="list-disc list-inside text-sm text-gray-700 mb-3">
                ${(data.items || []).map(item => `
                  <li>${item.name || 'N/A'} x${item.quantity} - ${((item.price || 0) * item.quantity).toLocaleString()}đ</li>
                `).join('')}
              </ul>
              <div class="border-t pt-3 mt-3">
                <p class="font-bold text-green-600 mb-2">
                  ➕ Giá trị thêm: ${(data.additionalAmount || 0).toLocaleString()}đ
                </p>
                <p class="font-bold text-blue-600 text-lg">
                  💰 Tổng đơn hàng mới: ${(data.newTotal || 0).toLocaleString()}đ
                </p>
              </div>
            </div>
          `,
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Xem đơn hàng",
          cancelButtonText: "Đóng",
          confirmButtonColor: "#22c55e",
          cancelButtonColor: "#6b7280",
          customClass: {
            popup: 'animate__animated animate__bounceIn'
          }
        });

        if (result.isConfirmed) {
          try {
            const res = await OrderAPI.getAll();
            const sorted = Array.isArray(res.data) ? [...res.data].sort((a, b) => b.id - a.id) : [];
            setOrders(sorted);
            
            const order = sorted.find(o => o.id === parseInt(data.orderId));
            
            if (order) {
              handleShowOrder(order);
            } else {
              showToast("warning", "⚠️ Không tìm thấy đơn hàng. Vui lòng refresh trang!");
            }
          } catch (error) {
            console.error("❌ Lỗi khi fetch orders:", error);
            showToast("error", "❌ Không thể tải đơn hàng!");
          }
        }
      }
    });

    // ✅ NHẬN THÔNG BÁO GỌI NHÂN VIÊN
    socket.on("staff-call-notification", async (data) => {
      console.log("\n🔔 ==========================================");
      console.log("🔔 KHÁCH HÀNG GỌI NHÂN VIÊN");
      console.log("🔔 ==========================================");
      console.log("   - Bàn số:", data.tableNumber);
      console.log("   - Order ID:", data.orderId);
      console.log("   - Khách hàng:", data.customerName);
      console.log("   - Tin nhắn:", data.message);
      console.log("   - Thời gian:", data.timestamp);
      console.log("==========================================\n");
      
      // 1️⃣ PHÁT ÂM THANH CHUÔNG GỌI (3 tiếng beep)
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const playBeep = (frequency, startTime, duration) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = frequency;
          oscillator.type = 'sine';
          
          // Volume
          gainNode.gain.setValueAtTime(0.5, audioContext.currentTime + startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);
          
          oscillator.start(audioContext.currentTime + startTime);
          oscillator.stop(audioContext.currentTime + startTime + duration);
        };
        
        // Chuông gọi: 3 tiếng beep
        playBeep(1000, 0, 0.15);      // Beep 1
        playBeep(1000, 0.2, 0.15);    // Beep 2  
        playBeep(1200, 0.4, 0.2);     // Beep 3 (cao hơn)
        
      } catch (err) {
        console.log('❌ Không thể phát âm thanh:', err);
      }
      
      // 2️⃣ HIỂN THỊ POPUP THÔNG BÁO
      const result = await Swal.fire({
        title: "🔔 Khách Hàng Gọi Nhân Viên!",
        html: `
          <div class="text-left space-y-4">
            <!-- Thông tin bàn -->
            <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border-2 border-amber-300 shadow-lg">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-3xl shadow-xl animate-bounce">
                    🪑
                  </div>
                  <div>
                    <p class="text-gray-600 text-sm font-medium mb-1">Bàn số</p>
                    <p class="text-4xl font-bold text-amber-600">${data.tableNumber}</p>
                  </div>
                </div>
                
                <div class="text-right">
                  <p class="text-gray-600 text-sm font-medium mb-1">Đơn hàng</p>
                  <p class="text-xl font-bold text-blue-600">#${data.orderId}</p>
                </div>
              </div>
              
              <!-- Khách hàng -->
              <div class="flex items-center gap-2 bg-white/60 rounded-lg p-3 mb-2">
                <span class="text-xl">👤</span>
                <div>
                  <p class="text-xs text-gray-500">Khách hàng</p>
                  <p class="font-semibold text-gray-800">${data.customerName}</p>
                </div>
              </div>
              
              <!-- Tin nhắn -->
              <div class="flex items-start gap-2 bg-white/60 rounded-lg p-3">
                <span class="text-xl mt-0.5">💬</span>
                <div class="flex-1">
                  <p class="text-xs text-gray-500 mb-1">Yêu cầu</p>
                  <p class="text-gray-800 font-medium">${data.message || 'Yêu cầu hỗ trợ'}</p>
                </div>
              </div>
            </div>
            
            <!-- Thời gian -->
            <div class="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg p-2">
              <span>🕐</span>
              <span>${new Date(data.timestamp).toLocaleString('vi-VN')}</span>
            </div>
            
            <!-- Lưu ý -->
            <div class="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-3">
              <p class="text-sm text-blue-800">
                <strong>💡 Lưu ý:</strong> Vui lòng đến bàn ${data.tableNumber} để hỗ trợ khách hàng ngay!
              </p>
            </div>
          </div>
        `,
        icon: "warning",
        iconColor: "#f59e0b",
        showCancelButton: true,
        confirmButtonText: " Đã nhận - Đang đến",
        cancelButtonText: "Đóng",
        confirmButtonColor: "#22c55e",
        cancelButtonColor: "#6b7280",
        customClass: {
          popup: 'animate__animated animate__bounceIn swal2-show',
          confirmButton: 'shadow-lg hover:shadow-xl transform hover:scale-105 transition-all',
          cancelButton: 'shadow hover:shadow-lg transform hover:scale-105 transition-all'
        },
        backdrop: `
          rgba(0,0,0,0.6)
          left top
          no-repeat
        `,
        allowOutsideClick: false,
        allowEscapeKey: false,
        width: '600px',
      });

      // 3️⃣ NẾU NHÂN VIÊN XÁC NHẬN ĐÃ NHẬN
      if (result.isConfirmed) {
        console.log("✅ Nhân viên đã xác nhận nhận thông báo");
        
        // Gửi xác nhận về server
        socket.emit("staff-acknowledge-call", {
          tableNumber: data.tableNumber,
          orderId: data.orderId,
          staffName: "Nhân viên", // Có thể lấy tên từ auth
          acknowledgedAt: new Date().toISOString()
        });
        
        // Hiển thị toast xác nhận
        showToast("success", `✅ Đã nhận - Đang đến bàn ${data.tableNumber}`);
        
        // Làm nổi bật đơn hàng trong bảng (optional)
        setTimeout(() => {
          const orderRow = document.querySelector(`[data-order-id="${data.orderId}"]`);
          if (orderRow) {
            orderRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            orderRow.style.backgroundColor = '#fef3c7';
            setTimeout(() => {
              orderRow.style.transition = 'background-color 1s ease';
              orderRow.style.backgroundColor = '';
            }, 2000);
          }
        }, 500);
      }
    });

    // ✅ THÊM LISTENER CHO items-added-to-order
    socket.on("items-added-to-order", async (data) => {
      console.log("🔔 Sync event: items-added-to-order", data);
      await fetchOrders();
    });

    // Nhận xác nhận cập nhật thành công từ server
    socket.on("order-status-update-success", (data) => {
      console.log("✅ Server xác nhận cập nhật thành công:", data);
    });

    // Nhận lỗi cập nhật từ server
    socket.on("order-status-update-error", (data) => {
      console.error("❌ Lỗi cập nhật từ server:", data);
      showToast("error", "Cập nhật thất bại, vui lòng thử lại!");
    });

    // === ✅ NHẬN THÔNG BÁO THANH TOÁN THÀNH CÔNG - COFFEE THEME ===
    // === ✅ NHẬN THÔNG BÁO THANH TOÁN THÀNH CÔNG - COFFEE THEME ===
    socket.on("payment-notification", async (data) => {
      console.log("\n💳 ==========================================");
      console.log("💳 NHẬN THÔNG BÁO THANH TOÁN THÀNH CÔNG");
      console.log("💳 ==========================================");
      console.log("   - Order ID:", data.orderId);
      console.log("   - Table Number:", data.tableNumber);
      console.log("   - Amount:", data.amount);
      console.log("   - Payment Method:", data.paymentMethod);
      console.log("   - Transaction No:", data.transactionNo);
      console.log("==========================================\n");
      
      // ✅ QUAN TRỌNG: GỬI SOCKET EVENT CẬP NHẬT TRẠNG THÁI PAID
      console.log(`📡 Gửi socket event staff-update-status cho đơn #${data.orderId} → PAID`);
      socket.emit("staff-update-status", {
        orderId: data.orderId.toString(),
        newStatus: "PAID",
        timestamp: new Date().toISOString(),
        staffId: socket.id,
        source: "payment-system" // Đánh dấu là từ hệ thống thanh toán
      });
      
      // 1️⃣ PHÁT ÂM THANH CHUÔNG TIỀN (2 tiếng Ding-Ding)
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const playBeep = (frequency, startTime, duration) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = frequency;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);
          
          oscillator.start(audioContext.currentTime + startTime);
          oscillator.stop(audioContext.currentTime + startTime + duration);
        };
        
        // Âm thanh chuông tiền: Ding-Ding
        playBeep(1200, 0, 0.2);      // Ding cao
        playBeep(900, 0.25, 0.25);   // Ding thấp
        
      } catch (err) {
        console.log('❌ Không thể phát âm thanh:', err);
      }
      
      // 2️⃣ REFRESH DANH SÁCH ORDERS
      await fetchOrders();
      
      // 🔥 2.5️⃣ CẬP NHẬT TRẠNG THÁI BÀN VỀ FREE (TRỐNG)
      // Lấy thông tin table từ orders nếu server không gửi
      const currentOrder = orders.find(o => o.id === parseInt(data.orderId));
      const tableId = data.tableId || currentOrder?.table?.id;
      const tableNumber = data.tableNumber || currentOrder?.table?.tableNumber;
      const tableCapacity = data.tableCapacity || currentOrder?.table?.capacity;
      
      if (tableId && tableNumber) {
        try {
          console.log("\n🪑 ==========================================");
          console.log("🪑 CẬP NHẬT TRẠNG THÁI BÀN SAU KHI THANH TOÁN");
          console.log("🪑 ==========================================");
          console.log(`   - Table ID: ${tableId}`);
          console.log(`   - Table Number: ${tableNumber}`);
          console.log(`   - New Status: FREE (Trống)`);
          console.log("==========================================\n");
          
          // Gọi API cập nhật trạng thái bàn
          await TableAPI.update(tableId, {
            tableNumber: tableNumber,
            capacity: tableCapacity || 4,
            status: "FREE"
          });
          
          console.log(`✅ Đã cập nhật trạng thái bàn ${tableNumber} sang FREE qua API`);
          
          // GỬI SOCKET EVENT ĐỂ CẬP NHẬT REALTIME CHO TẤT CẢ CLIENTS (QUAN TRỌNG!)
          socket.emit("table-status-changed", {
            tableId: tableId,
            tableNumber: tableNumber,
            newStatus: "FREE",
            orderId: data.orderId.toString(),
            timestamp: new Date().toISOString(),
            updatedBy: socket.id,
            reason: "PAYMENT_COMPLETED"
          });
          
          console.log(`✅ Đã gửi socket event table-status-changed cho bàn ${tableNumber}`);
          
        } catch (tableError) {
          console.error("❌ Lỗi khi cập nhật trạng thái bàn:", tableError);
        }
      } else {
        console.warn("⚠️ Không tìm thấy tableId hoặc tableNumber để cập nhật trạng thái bàn!");
      }
      
      // 3️⃣ HIỂN THỊ POPUP - COFFEE SHOP THEME (COMPACT VERSION)
      const result = await Swal.fire({
        title: false,
        html: `
          <div class="text-center space-y-4 py-3">
            <!-- Coffee Cup Success Animation -->
            <div class="flex justify-center mb-3">
              <div class="relative">
                <!-- Main Cup -->
                <div class="w-20 h-20 bg-gradient-to-br from-[#6F4E37] to-[#8B6F47] rounded-b-2xl flex items-center justify-center shadow-xl border-2 border-[#D4A574] relative overflow-hidden">
                  <!-- Coffee Steam (Smaller) -->
                  <div class="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1">
                    <div class="w-1.5 h-8 bg-gradient-to-t from-[#8B6F47]/60 to-transparent rounded-full animate-pulse" style="animation-delay: 0s"></div>
                    <div class="w-1.5 h-10 bg-gradient-to-t from-[#8B6F47]/60 to-transparent rounded-full animate-pulse" style="animation-delay: 0.3s"></div>
                    <div class="w-1.5 h-8 bg-gradient-to-t from-[#8B6F47]/60 to-transparent rounded-full animate-pulse" style="animation-delay: 0.6s"></div>
                  </div>
                  
                  <!-- Checkmark -->
                  <span class="text-3xl text-white relative z-10">✓</span>
                  
                  <!-- Shine Effect -->
                  <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                </div>
                
                <!-- Cup Handle (Smaller) -->
                <div class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-5 h-8 border-2 border-[#6F4E37] rounded-r-full"></div>
                
                <!-- Saucer (Smaller) -->
                <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 h-3 bg-gradient-to-br from-[#D4A574] to-[#C19A6B] rounded-full shadow-md"></div>
              </div>
            </div>
            
            <!-- Title (Compact) -->
            <div class="space-y-1">
              <h2 class="text-2xl font-bold bg-gradient-to-r from-[#6F4E37] to-[#8B6F47] bg-clip-text text-transparent">
                Thanh Toán Thành Công!
              </h2>
              <p class="text-gray-500 text-xs">Cảm ơn quý khách đã sử dụng dịch vụ</p>
            </div>
            
            <!-- Payment Info Card (Compact & Horizontal) -->
            <div class="bg-gradient-to-br from-[#FFF8F0] to-[#F5E6D3] rounded-xl p-4 border-2 border-[#D4A574] shadow-lg">
              <!-- Table & Amount (Horizontal) -->
              <div class="flex items-center justify-around mb-3 pb-3 border-b-2 border-dashed border-[#D4A574]">
                <div class="flex items-center gap-2">
                  <div class="text-2xl">☕</div>
                  <div class="text-left">
                    <p class="text-[#8B6F47] text-[10px] font-medium">Bàn số</p>
                    <p class="text-2xl font-bold bg-gradient-to-br from-[#6F4E37] to-[#8B6F47] bg-clip-text text-transparent">${data.tableNumber}</p>
                  </div>
                </div>
                
                <div class="h-10 w-px bg-[#D4A574]"></div>
                
                <div class="flex items-center gap-2">
                  <div class="text-2xl">💰</div>
                  <div class="text-left">
                    <p class="text-[#8B6F47] text-[10px] font-medium">Tổng tiền</p>
                    <p class="text-xl font-bold text-[#6F4E37]">${data.amount?.toLocaleString()}₫</p>
                  </div>
                </div>
              </div>
              
              <!-- Transaction Details (Horizontal Grid) -->
              <div class="grid grid-cols-3 gap-2 text-xs">
                <div class="bg-white/80 rounded-lg p-2 text-center shadow-sm">
                  <div class="text-lg mb-1">💳</div>
                  <p class="text-[10px] text-gray-500 mb-0.5">Phương thức</p>
                  <p class="font-bold text-[#6F4E37] text-[11px]">${data.paymentMethod}</p>
                </div>
                
                <div class="bg-white/80 rounded-lg p-2 text-center shadow-sm">
                  <div class="text-lg mb-1">📋</div>
                  <p class="text-[10px] text-gray-500 mb-0.5">Đơn hàng</p>
                  <p class="font-bold text-[#6F4E37] text-[11px]">#${data.orderId}</p>
                </div>
                
                <div class="bg-white/80 rounded-lg p-2 text-center shadow-sm">
                  <div class="text-lg mb-1">🔐</div>
                  <p class="text-[10px] text-gray-500 mb-0.5">Mã GD</p>
                  <p class="font-mono font-bold text-[#6F4E37] text-[10px]">${data.transactionNo}</p>
                </div>
              </div>
              
              <!-- Time (Compact) -->
              <div class="flex items-center justify-center gap-1 text-[10px] text-gray-500 mt-2">
                <span>🕐</span>
                <span>${new Date(data.timestamp).toLocaleString('vi-VN')}</span>
              </div>
            </div>
            
            <!-- Note (Compact) -->
            <div class="bg-gradient-to-r from-amber-50 to-orange-50 border-l-3 border-amber-400 rounded-r-lg p-2.5 text-left">
              <p class="text-xs text-amber-800">
                <strong>✓</strong> Bàn ${data.tableNumber} đã thanh toán - Sẵn sàng phục vụ khách mới
              </p>
            </div>
            
            <!-- Coffee Beans Decoration (Smaller) -->
            <div class="flex justify-center gap-2 text-lg opacity-30">
              ☕ ☕ ☕
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "📋 Xem chi tiết",
        cancelButtonText: "✓ Đóng",
        confirmButtonColor: "#6F4E37",
        cancelButtonColor: "#8B7355",
        customClass: {
          popup: 'animate__animated animate__zoomIn swal2-show',
          confirmButton: 'shadow-lg hover:shadow-xl transform hover:scale-105 transition-all font-semibold text-sm',
          cancelButton: 'shadow-md hover:shadow-lg transform hover:scale-105 transition-all font-semibold text-sm'
        },
        backdrop: `
          rgba(111, 78, 55, 0.4)
          left top
          no-repeat
        `,
        allowOutsideClick: true,
        width: '480px',
      });

      // 4️⃣ XỬ LÝ KẾT QUẢ
      if (result.isConfirmed) {
        socket.emit("staff-acknowledge-payment", {
          orderId: data.orderId,
          tableNumber: data.tableNumber,
          staffName: "Nhân viên",
          acknowledgedAt: new Date().toISOString()
        });
        
        const order = orders.find(o => o.id === parseInt(data.orderId));
        if (order) {
          handleShowOrder(order);
        }
        
        showToast("success", `✅ Đã xác nhận thanh toán bàn ${data.tableNumber}`);
      } else if (result.isDismissed) {
        socket.emit("staff-acknowledge-payment", {
          orderId: data.orderId,
          tableNumber: data.tableNumber,
          staffName: "Nhân viên",
          acknowledgedAt: new Date().toISOString()
        });
      }
    });

    // Cleanup - QUAN TRỌNG: Phải thêm payment-notification vào cleanup
    return () => {
      socket.off("connect");
      socket.off("new-order");
      socket.off("order-warning");
      socket.off("order-cancel-request");
      socket.off("staff-notification");
      socket.off("staff-call-notification");
      socket.off("items-added-to-order");
      socket.off("order-status-update-success");
      socket.off("order-status-update-error");
      socket.off("payment-notification"); // ✅ QUAN TRỌNG: Cleanup để tránh âm thanh lặp lại
      console.log("🔌 Đã ngắt kết nối Socket listeners trong Orders");
    };
  }, [orders]);

  // === Fetch functions ===
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await OrderAPI.getAll();
      const sorted = Array.isArray(res.data) ? [...res.data].sort((a, b) => b.id - a.id) : [];
      setOrders(sorted);
      console.log("✅ Fetched orders:", sorted.length);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách orders:", error);
      showToast("error", "❌ Không thể tải danh sách đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async () => {
    try {
      const res = await TableAPI.getAll();
      setTables(res.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bàn:", error);
      showToast("error", "❌ Không thể tải danh sách bàn!");
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await EmployeeAPI.getAll();
      setEmployees(res.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
      showToast("error", "❌ Không thể tải danh sách nhân viên!");
    }
  };

  const fetchPromotions = async () => {
    try {
      const res = await PromotionAPI.getAll();
      setPromotions(res.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khuyến mãi:", error);
      showToast("error", "❌ Không thể tải danh sách khuyến mãi!");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setPageLoading(true);
        await Promise.all([fetchOrders(), fetchTables(), fetchEmployees(), fetchPromotions()]);
      } finally {
        setTimeout(() => setPageLoading(false), 1200);
      }
    };
    load();
  }, []);

  // === Handlers cho dialog ===
  const handleCreateOrder = () => {
    setOpenCreateDialog(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setOpenEditDialog(true);
  };

  const handleShowOrder = (order) => {
    setSelectedOrder(order);
    setOpenShowDialog(true);
  };

  const handleCloseCreate = () => {
    setOpenCreateDialog(false);
  };
  
  const handleCloseEdit = () => {
    setOpenEditDialog(false);
    setSelectedOrder(null);
  };
  
  const handleCloseShow = () => {
    setOpenShowDialog(false);
    setSelectedOrder(null);
  };

  const handleCreateSubmit = async (orderPayload) => {
    try {
      setLoading(true);
      await OrderAPI.create(orderPayload);
      showToast("success", "🎉 Thêm đơn hàng mới thành công!");
      await fetchOrders();
      handleCloseCreate();
    } catch (error) {
      console.error("Lỗi khi thêm đơn hàng:", error);
      showToast("error", error?.response?.data?.message || "❌ Không thể thêm đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (orderId, orderPayload) => {
    try {
      setLoading(true);
      await OrderAPI.update(orderId, orderPayload);
      showToast("success", "✅ Cập nhật đơn hàng thành công!");
      await fetchOrders();
      handleCloseEdit();
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
      showToast("error", error?.response?.data?.message || "❌ Không thể cập nhật đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  // === ✅ Handler cập nhật trạng thái với Socket.IO + CẬP NHẬT TRẠNG THÁI BÀN ===
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      
      const currentOrder = orders.find(order => order.id === orderId);
      
      if (!currentOrder) {
        showToast("error", "❌ Không tìm thấy đơn hàng!");
        return;
      }
      
      const updateData = {
        tableId: currentOrder.table?.id || currentOrder.tableId,
        employeeId: currentOrder.employee?.id || currentOrder.employeeId,
        promotionId: currentOrder.promotion?.id || currentOrder.promotionId,
        status: newStatus,
        notes: currentOrder.notes,
        totalAmount: currentOrder.totalAmount,
      };
      
      // 1️⃣ CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
      await OrderAPI.update(orderId, updateData);
      
      console.log("📡 Đang gửi cập nhật trạng thái qua Socket:", {
        orderId: orderId.toString(),
        newStatus
      });
      
      // 2️⃣ GỬI EVENT CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
      socket.emit("staff-update-status", {
        orderId: orderId.toString(),
        newStatus: newStatus,
        timestamp: new Date().toISOString(),
        staffId: socket.id
      });
      
      // 3️⃣ ✅ CẬP NHẬT TRẠNG THÁI BÀN KHI ĐƠN HÀNG = "SERVED" (Đã phục vụ)
      if (newStatus === "SERVED" && currentOrder.table) {
        const tableId = currentOrder.table.id;
        const tableNumber = currentOrder.table.tableNumber;
        
        console.log("\n🪑 ==========================================");
        console.log("🪑 ĐƠN HÀNG ĐÃ PHỤC VỤ - CẬP NHẬT TRẠNG THÁI BÀN");
        console.log("🪑 ==========================================");
        console.log(`   - Order ID: ${orderId}`);
        console.log(`   - Table ID: ${tableId}`);
        console.log(`   - Table Number: ${tableNumber}`);
        console.log(`   - New Table Status: OCCUPIED (Đang dùng)`);
        console.log("==========================================\n");
        
        try {
          // Gọi API cập nhật trạng thái bàn sang OCCUPIED
          await TableAPI.update(tableId, {
            tableNumber: tableNumber,
            capacity: currentOrder.table.capacity,
            status: "OCCUPIED" // Đang dùng
          });
          
          console.log(`✅ Đã cập nhật trạng thái bàn ${tableNumber} sang OCCUPIED qua API`);
          
          // 4️⃣ ✅ GỬI SOCKET EVENT ĐỂ CẬP NHẬT REALTIME CHO TẤT CẢ CLIENTS
          socket.emit("table-status-changed", {
            tableId: tableId,
            tableNumber: tableNumber,
            newStatus: "OCCUPIED",
            orderId: orderId.toString(),
            timestamp: new Date().toISOString(),
            updatedBy: socket.id
          });
          
          console.log(`✅ Đã gửi socket event table-status-changed cho bàn ${tableNumber}`);
          
        } catch (tableError) {
          console.error("❌ Lỗi khi cập nhật trạng thái bàn:", tableError);
          // Không throw error để không ảnh hưởng đến việc cập nhật trạng thái đơn hàng
        }
      }
      
      // 5️⃣ ✅ CẬP NHẬT TRẠNG THÁI BÀN KHI ĐƠN HÀNG = "PAID" (Đã thanh toán) hoặc "CANCELLED" (Đã hủy)
      if ((newStatus === "PAID" || newStatus === "CANCELLED") && currentOrder.table) {
        const tableId = currentOrder.table.id;
        const tableNumber = currentOrder.table.tableNumber;
        
        console.log("\n🪑 ==========================================");
        console.log(`🪑 ĐƠN HÀNG ${newStatus === "PAID" ? "ĐÃ THANH TOÁN" : "ĐÃ HỦY"} - CẬP NHẬT TRẠNG THÁI BÀN`);
        console.log("🪑 ==========================================");
        console.log(`   - Order ID: ${orderId}`);
        console.log(`   - Table ID: ${tableId}`);
        console.log(`   - Table Number: ${tableNumber}`);
        console.log(`   - New Table Status: FREE (Trống)`);
        console.log("==========================================\n");
        
        try {
          // Gọi API cập nhật trạng thái bàn sang FREE
          await TableAPI.update(tableId, {
            tableNumber: tableNumber,
            capacity: currentOrder.table.capacity,
            status: "FREE" // Trống
          });
          
          console.log(`✅ Đã cập nhật trạng thái bàn ${tableNumber} sang FREE qua API`);
          
          // GỬI SOCKET EVENT ĐỂ CẬP NHẬT REALTIME CHO TẤT CẢ CLIENTS
          socket.emit("table-status-changed", {
            tableId: tableId,
            tableNumber: tableNumber,
            newStatus: "FREE",
            orderId: orderId.toString(),
            timestamp: new Date().toISOString(),
            updatedBy: socket.id
          });
          
          console.log(`✅ Đã gửi socket event table-status-changed cho bàn ${tableNumber}`);
          
        } catch (tableError) {
          console.error("❌ Lỗi khi cập nhật trạng thái bàn:", tableError);
          // Không throw error để không ảnh hưởng đến việc cập nhật trạng thái đơn hàng
        }
      }
      
      showToast("success", `✅ Đã cập nhật sang "${getStatusLabel(newStatus)}"`);
      await fetchOrders();
      
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      showToast("error", error?.response?.data?.message || "❌ Không thể cập nhật trạng thái!");
    } finally {
      setLoading(false);
    }
  };

  // === Render Loading Screen ===
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

  // === Main Render ===
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12 animate-fade-in">
      {/* Thông báo đơn hàng mới */}
      <AnimatePresence>
        {newOrderNotification && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
              onClick={() => setNewOrderNotification(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, x: 400, y: 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 400, y: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed top-6 right-6 z-[70] w-[90%] max-w-lg"
            >
              <div className="relative bg-gradient-to-br from-[#2c1810] via-[#3d2415] to-[#4a2c1a] rounded-3xl shadow-2xl border-2 border-amber-600/50 overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: '200% 200%' }}
                />
                
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 opacity-20">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute bottom-0 left-1/2 w-8 h-20 bg-gradient-to-t from-white/40 to-transparent rounded-full blur-xl"
                      style={{ left: `${40 + i * 20}%` }}
                      animate={{
                        y: [0, -60],
                        opacity: [0.4, 0],
                        scaleX: [1, 1.5, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </div>

                <div className="relative p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      animate={{ 
                        rotate: [0, -10, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                      className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg"
                    >
                      <span className="text-3xl">☕</span>
                    </motion.div>
                    
                    <div className="flex-1">
                      <motion.h3
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-bold text-amber-100 mb-1 flex items-center gap-2"
                      >
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                        >
                          🔔
                        </motion.span>
                        Đơn Hàng Mới!
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-amber-300/80 text-sm"
                      >
                        Vui lòng xử lý đơn hàng này
                      </motion.p>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-black/20 rounded-2xl p-4 mb-4 border border-amber-600/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🪑</span>
                        <div>
                          <p className="text-amber-200/70 text-xs">Số bàn</p>
                          <p className="text-amber-100 font-bold text-xl">
                            {newOrderNotification.tableNumber}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-amber-200/70 text-xs mb-1">Tổng tiền</p>
                        <motion.p
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="text-amber-400 font-bold text-2xl"
                        >
                          {newOrderNotification.totalPrice?.toLocaleString()}đ
                        </motion.p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-amber-200/60 text-xs">
                      <span>🕐</span>
                      <span>{new Date().toLocaleTimeString('vi-VN')}</span>
                    </div>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setNewOrderNotification(null)}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>✓</span>
                    <span>Đã Nhận - Bắt Đầu Xử Lý</span>
                  </motion.button>

                  <motion.div
                    className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Card - Danh sách đơn hàng */}
      <Card className="shadow-xl rounded-2xl border border-brown-200 bg-gradient-to-br from-[#f9f5f0] to-[#fffaf5]">
        <CardHeader
          variant="gradient"
          color="brown"
          className="mb-8 p-6 rounded-t-2xl bg-gradient-to-r from-[#8B5E3C] to-[#C89F77] shadow-md"
        >
          <div className="flex items-center justify-between">
            <Typography
              variant="h6"
              color="white"
              className="font-semibold tracking-wide drop-shadow-md"
            >
              ☕ Danh Sách Đơn Hàng
            </Typography>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                color="white"
                className="flex items-center gap-2 bg-[#8B5E3C] hover:bg-[#a4714b] transition-all duration-300 shadow-md rounded-lg"
                onClick={handleCreateOrder}
              >
                <PlusIcon className="h-4 w-4" />
                Thêm mới
              </Button>
              <Button
                size="sm"
                color="white"
                className="flex items-center gap-2 bg-[#8B5E3C] hover:bg-[#a4714b] transition-all duration-300 shadow-md rounded-lg"
                onClick={fetchOrders}
              >
                <ArrowPathIcon className="h-4 w-4" />
                Làm mới
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {loading ? (
            <div className="text-center py-8 animate-pulse">
              <Typography className="text-brown-600">Đang tải đơn hàng...</Typography>
            </div>
          ) : (
            <OrderTable
              orders={orders}
              onShow={handleShowOrder}
              onEdit={handleEditOrder}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
        </CardBody>
      </Card>

      {/* Dialogs: Create / Edit / Show */}
      <Create
        open={openCreateDialog}
        tables={tables}
        employees={employees}
        promotions={promotions}
        onClose={handleCloseCreate}
        onSuccess={fetchOrders} 
        onSubmit={handleCreateSubmit}
        submitting={loading}
      />

      <Edit
        open={openEditDialog}
        order={selectedOrder}
        tables={tables}
        employees={employees}
        promotions={promotions}
        onClose={handleCloseEdit}
        onSuccess={fetchOrders} 
        onSubmit={handleEditSubmit}
        submitting={loading}
      />

      <Show
        open={openShowDialog}
        order={selectedOrder}
        onClose={handleCloseShow}
        onSuccess={fetchOrders} 
      />
    </div>
  );
}

export default Orders;