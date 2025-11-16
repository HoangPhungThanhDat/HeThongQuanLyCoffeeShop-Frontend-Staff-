import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
  Chip,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  BanknotesIcon,
  UsersIcon,
  UserPlusIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import BillAPI from "@/api/billApi";
import productApi from "@/api/productApi";
import { ordersOverviewData } from "@/data/orders-overview-data";
import { chartsConfig } from "@/configs/charts-config";

export function Home() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenueToday: 0,
    totalBills: 0,
    totalProducts: 0,
    totalRevenueAll: 0,
    avgOrderValue: 0,
    completedOrders: 0,
    pendingOrders: 0,
    topProduct: null,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [chartData, setChartData] = useState({
    weekly: [],
    monthly: [],
    hourly: [],
    categoryRevenue: [],
    paymentMethods: [],
  });

  // Particles animation
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      return Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 20 + 10,
      }));
    };
    setParticles(generateParticles());
  }, []);

  // --- Tính doanh thu theo ngày trong tuần HIỆN TẠI ---
  const getRevenuePerDayOfWeek = (bills) => {
    const result = Array(7).fill(0);
    const startOfWeek = dayjs().startOf('week').add(1, 'day');
    const endOfWeek = dayjs().endOf('week').add(1, 'day');
    
    bills.forEach((bill) => {
      if (bill.paymentStatus === "COMPLETED") {
        const billDate = dayjs(bill.createdAt);
        if (billDate.isAfter(startOfWeek.subtract(1, 'day')) && 
            billDate.isBefore(endOfWeek.add(1, 'day'))) {
          const day = billDate.day();
          const index = day === 0 ? 6 : day - 1;
          result[index] += bill.totalAmount || 0;
        }
      }
    });
    return result;
  };

  // --- Tính doanh thu theo tháng ---
  const getRevenuePerMonth = (bills) => {
    const result = Array(12).fill(0);
    const currentYear = dayjs().year();
    
    bills.forEach((bill) => {
      if (bill.paymentStatus === "COMPLETED" && dayjs(bill.createdAt).year() === currentYear) {
        const month = dayjs(bill.createdAt).month();
        result[month] += bill.totalAmount || 0;
      }
    });
    return result;
  };

  // --- Tính doanh thu theo giờ trong ngày ---
  const getRevenuePerHour = (bills) => {
    const result = Array(24).fill(0);
    const today = dayjs().format("YYYY-MM-DD");
    
    bills.forEach((bill) => {
      if (bill.paymentStatus === "COMPLETED" && 
          dayjs(bill.createdAt).format("YYYY-MM-DD") === today) {
        const hour = dayjs(bill.createdAt).hour();
        result[hour] += bill.totalAmount || 0;
      }
    });
    return result;
  };

  // --- Tính phân bổ theo phương thức thanh toán ---
  const getPaymentMethodDistribution = (bills) => {
    const methods = {
      'CASH': 0,
      'CREDIT_CARD': 0,
      'E_WALLET': 0,
      'BANK_TRANSFER': 0,
    };

    bills.forEach((bill) => {
      if (bill.paymentStatus === "COMPLETED" && bill.paymentMethod) {
        methods[bill.paymentMethod] = (methods[bill.paymentMethod] || 0) + 1;
      }
    });

    const total = Object.values(methods).reduce((a, b) => a + b, 0);
    return Object.entries(methods).map(([method, count]) => ({
      label: method === 'CASH' ? 'Tiền mặt' : 
             method === 'CREDIT_CARD' ? 'Thẻ' :
             method === 'E_WALLET' ? 'Ví điện tử' : 'Chuyển khoản',
      value: total > 0 ? ((count / total) * 100).toFixed(1) : 0,
      count: count,
    }));
  };

  // --- Tính top sản phẩm bán chạy ---
  const getTopSellingProducts = (bills, products) => {
    const productSales = {};
    
    bills.forEach((bill) => {
      if (bill.paymentStatus === "COMPLETED" && bill.billDetails) {
        bill.billDetails.forEach((detail) => {
          const productId = detail.productId;
          if (!productSales[productId]) {
            productSales[productId] = {
              quantity: 0,
              revenue: 0,
            };
          }
          productSales[productId].quantity += detail.quantity || 0;
          productSales[productId].revenue += (detail.quantity * detail.price) || 0;
        });
      }
    });

    const topProducts = Object.entries(productSales)
      .map(([productId, data]) => {
        const product = products.find(p => p.id === parseInt(productId));
        return {
          ...product,
          soldQuantity: data.quantity,
          revenue: data.revenue,
        };
      })
      .sort((a, b) => b.soldQuantity - a.soldQuantity)
      .slice(0, 5);

    return topProducts;
  };

  // --- Gọi API lấy dữ liệu ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [billsRes, productsRes, newestRes] = await Promise.all([
          BillAPI.getAll(),
          productApi.getAll(),
          productApi.getNewest(),
        ]);

        const bills = billsRes.data || [];
        const products = productsRes.data || [];
        const newestProducts = newestRes.data || [];

        const completedBills = bills.filter((b) => b.paymentStatus === "COMPLETED");
        const pendingBills = bills.filter((b) => b.paymentStatus === "PENDING");
        
        const totalRevenueAll = completedBills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
        const avgOrderValue = completedBills.length > 0 ? totalRevenueAll / completedBills.length : 0;

        const today = dayjs().format("YYYY-MM-DD");
        const revenueToday = completedBills
          .filter((bill) => dayjs(bill.createdAt).format("YYYY-MM-DD") === today)
          .reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);

        const topProducts = getTopSellingProducts(bills, products);
        const paymentDist = getPaymentMethodDistribution(bills);

        setStats({
          totalRevenueToday: revenueToday,
          totalBills: bills.length,
          totalProducts: products.length,
          totalRevenueAll,
          avgOrderValue,
          completedOrders: completedBills.length,
          pendingOrders: pendingBills.length,
          topProduct: topProducts[0] || null,
        });

        setRecentProducts(newestProducts.slice(0, 6));
        setTopSellingProducts(topProducts);

        setChartData({
          weekly: getRevenuePerDayOfWeek(bills),
          monthly: getRevenuePerMonth(bills),
          hourly: getRevenuePerHour(bills),
          paymentMethods: paymentDist,
        });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu thống kê:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- Dữ liệu thẻ thống kê ---
  const statisticsCardsData = [
    {
      color: "gray",
      icon: BanknotesIcon,
      title: "Doanh thu hôm nay",
      value: `${stats.totalRevenueToday.toLocaleString()}₫`,
      footer: {
        color: "text-green-500",
        value: "+12%",
        label: "so với hôm qua",
      },
    },
    {
      color: "gray",
      icon: ShoppingCartIcon,
      title: "Đơn hàng hoàn thành",
      value: stats.completedOrders,
      footer: {
        color: "text-green-500",
        value: `${stats.pendingOrders} đang chờ`,
        label: "đơn đang xử lý",
      },
    },
    {
      color: "gray",
      icon: CurrencyDollarIcon,
      title: "Giá trị TB/Đơn",
      value: `${stats.avgOrderValue.toLocaleString('vi-VN', {maximumFractionDigits: 0})}₫`,
      footer: {
        color: "text-green-500",
        value: "+8%",
        label: "so với tuần trước",
      },
    },
    {
      color: "gray",
      icon: ChartBarIcon,
      title: "Tổng doanh thu",
      value: `${stats.totalRevenueAll.toLocaleString()}₫`,
      footer: {
        color: "text-green-500",
        value: "+15%",
        label: "so với tháng trước",
      },
    },
  ];

  // --- Dữ liệu biểu đồ ---
  const statisticsChartsData = [
    {
      color: "white",
      title: "Doanh thu theo ngày",
      description: "Hiệu suất tuần này",
      footer: "Cập nhật hôm nay",
      chart: {
        type: "bar",
        height: 240,
        series: [
          {
            name: "Doanh thu",
            data: chartData.weekly.length ? chartData.weekly : [0, 0, 0, 0, 0, 0, 0],
          },
        ],
        options: {
          ...chartsConfig,
          colors: ["#6d4c41"],
          plotOptions: {
            bar: {
              columnWidth: "40%",
              borderRadius: 8,
            },
          },
          xaxis: {
            ...chartsConfig.xaxis,
            categories: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
          },
        },
      },
    },
    {
      color: "white",
      title: "Doanh thu theo tháng",
      description: "Năm " + dayjs().year(),
      footer: "Cập nhật theo năm",
      chart: {
        type: "line",
        height: 240,
        series: [
          {
            name: "Doanh thu",
            data: chartData.monthly.length ? chartData.monthly : Array(12).fill(0),
          },
        ],
        options: {
          ...chartsConfig,
          colors: ["#8d6e63"],
          stroke: { lineCap: "round", curve: "smooth", width: 3 },
          markers: { size: 6 },
          xaxis: {
            ...chartsConfig.xaxis,
            categories: ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"],
          },
        },
      },
    },
    {
      color: "white",
      title: "Doanh thu theo giờ",
      description: "Hôm nay",
      footer: "Cập nhật realtime",
      chart: {
        type: "area",
        height: 240,
        series: [
          {
            name: "Doanh thu",
            data: chartData.hourly.length ? chartData.hourly : Array(24).fill(0),
          },
        ],
        options: {
          ...chartsConfig,
          colors: ["#5d4037"],
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.2,
            }
          },
          stroke: { lineCap: "round", curve: "smooth", width: 2 },
          xaxis: {
            ...chartsConfig.xaxis,
            categories: Array.from({length: 24}, (_, i) => `${i}h`),
          },
        },
      },
    },
    {
      color: "white",
      title: "Phương thức thanh toán",
      description: "Phân bổ theo loại",
      footer: "Tất cả đơn hàng",
      chart: {
        type: "donut",
        height: 240,
        series: chartData.paymentMethods.map(m => parseFloat(m.value)) || [25, 25, 25, 25],
        options: {
          ...chartsConfig,
          colors: ["#8d6e63", "#6d4c41", "#5d4037", "#4e342e"],
          labels: chartData.paymentMethods.map(m => m.label) || ["Tiền mặt", "Thẻ", "Ví điện tử", "Chuyển khoản"],
          legend: {
            show: true,
            position: 'bottom',
          },
          plotOptions: {
            pie: {
              donut: {
                size: '65%',
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: 'Tổng',
                    formatter: () => {
                      const total = chartData.paymentMethods.reduce((sum, m) => sum + m.count, 0);
                      return total + ' đơn';
                    }
                  }
                }
              }
            }
          },
          dataLabels: {
            enabled: true,
            formatter: (val) => val.toFixed(1) + '%',
          },
        },
      },
    },
  ];

// Giả lập thời gian tải dữ liệu
useEffect(() => {
  const timer = setTimeout(() => setLoading(false), 2500);
  return () => clearTimeout(timer);
}, []);

if (loading) {
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
    <div className="relative min-h-screen bg-gradient-to-br from-[#3e2723] via-[#4e342e] to-[#3e2723] px-4 py-8 overflow-hidden">
      {/* Floating particles background */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-amber-400/10"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Header Section with coffee steam effect */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 z-10"
      >
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <SparklesIcon className="w-12 h-12 text-amber-400" />
          </motion.div>
          <div>
            <Typography variant="h3" className="text-amber-100 font-bold mb-2">
              ☕ Dashboard Coffee Shop
            </Typography>
            <Typography variant="small" className="text-amber-200/70">
              Tổng quan doanh thu và hoạt động kinh doanh
            </Typography>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards with smooth animation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4 z-10"
      >
        {statisticsCardsData.map(({ icon, title, footer, ...rest }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.5,
              ease: "easeOut"
            }}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.2 }
            }}
          >
            <StatisticsCard
              {...rest}
              title={title}
              icon={React.createElement(icon, { className: "w-6 h-6 text-white" })}
              footer={
                <Typography className="font-normal text-blue-gray-600">
                  <strong className={footer.color}>{footer.value}</strong>
                  &nbsp;{footer.label}
                </Typography>
              }
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid with fade-in animation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6 z-10"
      >
        {statisticsChartsData.map((props, index) => (
          <motion.div
            key={props.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.5 + index * 0.1,
              duration: 0.5,
              ease: "easeOut"
            }}
            whileHover={{ 
              y: -5,
              boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.4)",
              transition: { duration: 0.3 }
            }}
            className="bg-white shadow-xl rounded-2xl p-6 border border-brown-200"
          >
            <StatisticsChart
              {...props}
              footer={
                <Typography variant="small" className="flex items-center font-normal text-blue-gray-600 mt-4">
                  <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                  &nbsp;{props.footer}
                </Typography>
              }
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Section with slide animation */}
      <div className="relative grid grid-cols-1 xl:grid-cols-3 gap-6 z-10">
        {/* Recent Products */}
        <motion.div
          className="xl:col-span-2"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
        >
          <Card className="border-2 border-amber-900/30 bg-gradient-to-br from-[#5d4037] to-[#4e342e] text-white shadow-2xl backdrop-blur-sm">
            <CardHeader floated={false} shadow={false} color="transparent" className="m-0 flex items-center justify-between p-6 border-b border-amber-900/20">
              <div>
                <Typography variant="h5" className="text-amber-100 mb-1 flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircleIcon className="h-6 w-6 text-green-400" />
                  </motion.div>
                  Menu Sản Phẩm Mới
                </Typography>
                <Typography variant="small" className="text-amber-200/70">
                  6 sản phẩm mới nhất trong hệ thống
                </Typography>
              </div>
            </CardHeader>
            <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-amber-900/20">
                    {["Sản Phẩm", "Tồn kho", "Giá bán", "Trạng thái"].map((el) => (
                      <th key={el} className="py-4 px-6 text-left">
                        <Typography variant="small" className="text-xs font-bold uppercase text-amber-200/80">
                          {el}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {recentProducts.map((product, index) => (
                      <motion.tr 
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        whileHover={{ 
                          backgroundColor: "rgba(255, 193, 7, 0.1)",
                          transition: { duration: 0.2 }
                        }}
                        className="border-b border-amber-900/10"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                          <motion.div
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Avatar 
                                src={product.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='300' height='200' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E"}
                                alt={product.name}
                                size="md"
                                className="border-2 border-amber-400/50"
                              />
                            </motion.div>
                            <Typography variant="small" className="font-bold text-amber-50">
                              {product.name}
                            </Typography>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Chip
                            value={product.stockQuantity !== undefined ? `${product.stockQuantity} sp` : "N/A"}
                            className="bg-amber-800/50 text-amber-100"
                            size="sm"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <Typography variant="small" className="font-bold text-green-400">
                            {product.price?.toLocaleString()}₫
                          </Typography>
                        </td>
                        <td className="py-4 px-6">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                          >
                            <Chip
                              value={product.isActive ? "Đang bán" : "Ngưng bán"}
                              className={product.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}
                              size="sm"
                            />
                          </motion.div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </CardBody>
          </Card>
        </motion.div>

        {/* Top Selling Products */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.5, ease: "easeOut" }}
        >
          <Card className="border-2 border-amber-900/30 bg-gradient-to-br from-[#5d4037] to-[#4e342e] text-white shadow-2xl h-full backdrop-blur-sm">
            <CardHeader floated={false} shadow={false} color="transparent" className="m-0 p-6 border-b border-amber-900/20">
              <Typography variant="h5" className="text-amber-100 mb-1 flex items-center gap-2">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowTrendingUpIcon className="h-6 w-6 text-yellow-400" />
                </motion.div>
                Top Sản Phẩm Bán Chạy
              </Typography>
              <Typography variant="small" className="text-amber-200/70">
                5 sản phẩm có doanh số cao nhất
              </Typography>
            </CardHeader>
            <CardBody className="pt-4">
              {topSellingProducts.length > 0 ? (
                topSellingProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: "rgba(255, 193, 7, 0.1)",
                      transition: { duration: 0.2 }
                    }}
                    className="flex items-center gap-4 py-4 border-b border-amber-900/10 last:border-0 rounded-lg px-2"
                  >
                    <motion.div 
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-900/30 text-amber-200 font-bold"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      #{index + 1}
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Avatar 
                          src={product.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='300' height='200' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E"}
                          alt={product.name}
                          size="md"
                          className="border-2 border-amber-400/50"
                        />
                      </motion.div>
                    <div className="flex-1">
                      <Typography variant="small" className="font-bold text-amber-50">
                        {product.name}
                      </Typography>
                      <Typography variant="small" className="text-amber-200/60">
                        Đã bán: {product.soldQuantity} ly
                      </Typography>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                    >
                      <Typography variant="small" className="font-bold text-green-400">
                        {product.revenue?.toLocaleString()}₫
                      </Typography>
                    </motion.div>
                  </motion.div>
                ))
              ) : (
                <Typography className="text-center text-amber-200/50 py-8">
                  Chưa có dữ liệu bán hàng
                </Typography>
              )}
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;