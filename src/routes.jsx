import { useState, useEffect, useCallback } from "react";
import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  Squares2X2Icon,
  ShoppingBagIcon,
  RectangleStackIcon,
  TicketIcon,
  GiftIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";

import {
  Home,
  Profile,
} from "@/pages/dashboard";

import { Orders } from "@/pages/dashboard/orders/index";
import { Tables } from "@/pages/dashboard/tables/index";
import { OrderItems } from "@/pages/dashboard/orderitems/index";
import { Bill } from "@/pages/dashboard/bill/index";
import { SignIn, SignUp } from "@/pages/auth";

import socket from "./socket";
import OrderAPI from "@/api/orderApi";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export function OrderBadge() {
  const [count, setCount] = useState(0);
  const [isNew, setIsNew] = useState(false);

  // Fetch initial count từ API
  const fetchCount = useCallback(async () => {
    try {
      const res = await OrderAPI.getAll();
      const orders = res.data || [];
      const pending = orders.filter((o) => o.status === "PENDING").length;
      
      console.log(`📊 Số đơn hàng đang chờ xử lý: ${pending}`);
      setCount(pending);
      
    } catch (error) {
      console.error("❌ Lỗi khi lấy số đơn hàng:", error);
    }
  }, []);

  useEffect(() => {
    console.log("🔌 OrderBadge mounted - Đang kết nối Socket.IO...");
    
    // Load số lượng ban đầu
    fetchCount();

    //Handler cho đơn hàng mới
    const handleNewOrder = (orderData) => {
      console.log("🔔 Nhận đơn hàng mới từ khách:", orderData);
      console.log("📦 Order data:", JSON.stringify(orderData, null, 2));
      
      // Tăng số lượng trực tiếp (giả định đơn mới luôn là PENDING)
      setCount((prevCount) => {
        const newCount = prevCount + 1;
        console.log(`Badge tăng từ ${prevCount} → ${newCount}`);
        
        // Kích hoạt animation
        setIsNew(true);
        setTimeout(() => setIsNew(false), 2000);
        
        return newCount;
      });
    };

    //Handler cho cập nhật trạng thái - FETCH LẠI
    const handleStatusUpdate = (data) => {
      console.log("🔄 Cập nhật trạng thái đơn hàng:", data);
      
      // Fetch lại để đảm bảo đúng số lượng
      fetchCount();
    };

    // Đăng ký socket listeners
    socket.on("new-order", handleNewOrder);
    socket.on("order-status-updated", handleStatusUpdate);

    console.log("✅ Socket listeners đã được đăng ký");

    // Cleanup khi unmount
    return () => {
      console.log("🔌 OrderBadge unmounting - Đang ngắt kết nối Socket...");
      socket.off("new-order", handleNewOrder);
      socket.off("order-status-updated", handleStatusUpdate);
    };
  }, [fetchCount]);

  //Không return null - chỉ ẩn badge bằng CSS để component vẫn mounted
  return (
    <span
className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center min-w-[24px] h-6 px-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full shadow-lg transition-all duration-300 ${
        isNew ? 'animate-bounce' : 'animate-pulse'
      } ${count === 0 ? 'opacity-0 scale-0 pointer-events-none' : 'opacity-100 scale-100'}`}
      style={{
        animation: isNew ? 'bounce 0.5s ease-in-out 3' : undefined
      }}
    >
      {count}
      {isNew && count > 0 && (
        <span className="absolute inset-0 rounded-full bg-red-400 animate-ping"></span>
      )}
    </span>
  );
}

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Trang chủ",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Quản lý bàn",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <ClipboardDocumentListIcon {...icon} />,
        name: "Quản lý đơn hàng",
        path: "/orders",
        element: <Orders />,
        badge: <OrderBadge />, // Component badge realtime
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Chi tiết đơn hàng",
        path: "/orderitems",
        element: <OrderItems />,
      },
      {
        icon: <Cog6ToothIcon {...icon} />,
        name: "Quản lý hóa đơn",
        path: "/bills",
        element: <Bill />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Sign In",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Profile",
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
];

export default routes;