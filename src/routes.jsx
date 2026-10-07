import { useState, useEffect, useCallback } from "react";
import {
  HomeIcon,
  UserCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  GiftIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/24/solid";

import { Home, Profile } from "@/pages/dashboard";
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

// ==================== ORDER BADGE ====================
export function OrderBadge() {
  const [count, setCount] = useState(0);
  const [isNew, setIsNew] = useState(false);

  const fetchCount = useCallback(async () => {
    try {
      // ⭐ Thêm params để BE trả nhiều items hơn
      const res = await OrderAPI.getAll({ size: 1000 });
      const rawData = res.data;

      // ⭐ Handle cả 2 case: PageResponse hoặc Array
      const orders = Array.isArray(rawData?.content)
        ? rawData.content
        : Array.isArray(rawData)
        ? rawData
        : [];

      const pending = orders.filter(
        (o) =>
          o.status === "PENDING" ||
          o.status === "CONFIRMED" ||
          o.status === "PREPARING"
      ).length;

      setCount(pending);
    } catch (error) {
      console.error("❌ Lỗi khi lấy số đơn hàng:", error);
    }
  }, []);

  useEffect(() => {
    fetchCount();

    const handleNewOrder = (orderData) => {
      setCount((prevCount) => {
        const newCount = prevCount + 1;
        setIsNew(true);
        setTimeout(() => setIsNew(false), 2000);
        return newCount;
      });
    };

    const handleStatusUpdate = () => {
      fetchCount();
    };

    socket.on("new-order", handleNewOrder);
    socket.on("order-status-updated", handleStatusUpdate);
    socket.on("staff-update-status", handleStatusUpdate);

    return () => {
      socket.off("new-order", handleNewOrder);
      socket.off("order-status-updated", handleStatusUpdate);
      socket.off("staff-update-status", handleStatusUpdate);
    };
  }, [fetchCount]);

  // Ẩn badge khi count = 0
  if (count === 0) return null;

  return (
    <span
      className={`ml-auto flex items-center justify-center min-w-[22px] h-[22px] px-1.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-extrabold rounded-full shadow-md transition-all duration-300 ${
        isNew ? "animate-bounce ring-2 ring-red-300" : "animate-pulse"
      }`}
    >
      {count > 99 ? "99+" : count}
      {isNew && (
        <span className="absolute inset-0 rounded-full bg-red-400 animate-ping" />
      )}
    </span>
  );
}

// ==================== ROUTES ====================
export const routes = [
  // ============================================
  // ========== NGHIỆP VỤ (MAIN) ================
  // ============================================
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
        name: "Sơ đồ bàn",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <ClipboardDocumentListIcon {...icon} />,
        name: "Đơn hàng",
        path: "/orders",
        element: <Orders />,
        badge: <OrderBadge />,
      },
      {
        icon: <ReceiptPercentIcon {...icon} />,
        name: "Chi tiết đơn",
        path: "/orderitems",
        element: <OrderItems />,
      },
      {
        icon: <Cog6ToothIcon {...icon} />,
        name: "Hóa đơn",
        path: "/bills",
        element: <Bill />,
      },
    ],
  },

  // ============================================
  // ========== TÀI KHOẢN =======================
  // ============================================
  {
    title: "👤 Tài khoản",
    layout: "dashboard",
    pages: [
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Hồ sơ cá nhân",
        path: "/profile",
        element: <Profile />,
      },
    ],
  },

  // ============================================
  // ========== AUTH (chỉ cho routes) ===========
  // ============================================
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Đăng Nhập",
        path: "/sign-in",
        element: <SignIn />,
      },
    ],
  },
];

export default routes;