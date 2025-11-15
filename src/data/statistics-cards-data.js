import React, { useEffect, useState } from "react";
import { BanknotesIcon, UserPlusIcon, UsersIcon, ChartBarIcon } from "@heroicons/react/24/solid";
import BillAPI from "@/api/billApi";
import productApi from "@/api/productApi";

const StatisticsCardsData = () => {
  const [stats, setStats] = useState({
    totalRevenueToday: 0,
    totalBills: 0,
    totalProducts: 0,
    totalRevenueAll: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const billsRes = await BillAPI.getAll();
        const productsRes = await productApi.getAll();
        const bills = billsRes.data || [];
        const products = productsRes.data || [];

        const totalRevenueAll = bills.reduce((sum, bill) => sum + (bill.total || 0), 0);

        const today = new Date().toISOString().slice(0, 10);
        const revenueToday = bills
          .filter((bill) => bill.createdAt?.startsWith(today))
          .reduce((sum, bill) => sum + (bill.total || 0), 0);

        setStats({
          totalRevenueToday: revenueToday,
          totalBills: bills.length,
          totalProducts: products.length,
          totalRevenueAll,
        });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu thống kê:", error);
      }
    };

    fetchData();
  }, []);

  const data = [
    {
      color: "gray",
      icon: BanknotesIcon,
      title: "Doanh thu hôm nay",
      value: `$${stats.totalRevenueToday.toLocaleString()}`,
      footer: {
        color: "text-green-500",
        value: "+12%",
        label: "so với hôm qua",
      },
    },
    {
      color: "gray",
      icon: UsersIcon,
      title: "Tổng hóa đơn",
      value: stats.totalBills,
      footer: {
        color: "text-green-500",
        value: "+5%",
        label: "so với tuần trước",
      },
    },
    {
      color: "gray",
      icon: UserPlusIcon,
      title: "Sản phẩm đang bán",
      value: stats.totalProducts,
      footer: {
        color: "text-red-500",
        value: "-1%",
        label: "so với tháng trước",
      },
    },
    {
      color: "gray",
      icon: ChartBarIcon,
      title: "Tổng doanh thu",
      value: `$${stats.totalRevenueAll.toLocaleString()}`,
      footer: {
        color: "text-green-500",
        value: "+8%",
        label: "so với tháng trước",
      },
    },
  ];

  return data;
};

export default StatisticsCardsData;