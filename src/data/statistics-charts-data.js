import { chartsConfig } from "@/configs";

const websiteViewsChart = {
  type: "bar",
  height: 220,
  series: [
    {
      name: "Lượt xem",
      data: [50, 20, 10, 22, 50, 10, 40],
    },
  ],
  options: {
    ...chartsConfig,
    colors: "#388e3c",
    plotOptions: {
      bar: {
        columnWidth: "16%",
        borderRadius: 5,
      },
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    },
  },
};

const dailySalesChart = {
  type: "line",
  height: 220,
  series: [
    {
      name: "Doanh số",
      data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
    },
  ],
  options: {
    ...chartsConfig,
    colors: ["#0288d1"],
    stroke: {
      lineCap: "round",
    },
    markers: {
      size: 5,
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: [
        "Th4",
        "Th5",
        "Th6",
        "Th7",
        "Th8",
        "Th9",
        "Th10",
        "Th11",
        "Th12",
      ],
    },
  },
};

const completedTaskChart = {
  type: "line",
  height: 220,
  series: [
    {
      name: "Doanh số",
      data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
    },
  ],
  options: {
    ...chartsConfig,
    colors: ["#388e3c"],
    stroke: {
      lineCap: "round",
    },
    markers: {
      size: 5,
    },
    xaxis: {
      ...chartsConfig.xaxis,
      categories: [
        "Th4",
        "Th5",
        "Th6",
        "Th7",
        "Th8",
        "Th9",
        "Th10",
        "Th11",
        "Th12",
      ],
    },
  },
};

const completedTasksChart = {
  ...completedTaskChart,
  series: [
    {
      name: "Nhiệm vụ",
      data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
    },
  ],
};

export const statisticsChartsData = [
  {
    color: "white",
    title: "Doanh thu theo ngày",
    description: "Hiệu suất chiến dịch gần nhất",
    footer: "Chiến dịch được gửi cách đây 2 ngày",
    chart: websiteViewsChart,
  },
  {
    color: "white",
    title: "Doanh số theo tháng",
    description: "Tăng 15% so với tháng trước",
    footer: "Cập nhật cách đây 4 phút",
    chart: dailySalesChart,
  },
  {
    color: "white",
    title: "Số đơn hàng / ly cà phê bán ra",
    description: "Hiệu suất chiến dịch gần nhất",
    footer: "Vừa được cập nhật",
    chart: completedTasksChart,
  },
];

export default statisticsChartsData;
