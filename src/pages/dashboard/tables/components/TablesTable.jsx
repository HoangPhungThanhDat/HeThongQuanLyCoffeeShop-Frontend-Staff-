import { Typography, IconButton, Tooltip, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { PencilIcon, EyeIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export function TablesTable({ tables, onShow, onEdit, onStatusChange }) {
  const getStatusDisplay = (status) => {
    switch (status) {
      case "FREE":
        return "Trống";
      case "OCCUPIED":
        return "Đang dùng";
      case "RESERVED":
        return "Đã đặt";
      default:
        return "Trống";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "FREE":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "OCCUPIED":
        return "bg-rose-100 text-rose-700 border border-rose-200";
      case "RESERVED":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      default:
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "FREE":
        return "🟢";
      case "OCCUPIED":
        return "🔴";
      case "RESERVED":
        return "🟡";
      default:
        return "🟢";
    }
  };

  const statusOptions = [
    { value: "FREE", label: "Trống", icon: "🟢", color: "text-emerald-600" },
    { value: "OCCUPIED", label: "Đang dùng", icon: "🔴", color: "text-rose-600" },
    { value: "RESERVED", label: "Đã đặt", icon: "🟡", color: "text-amber-600" },
  ];

  return (
    <div className="flex justify-center mt-6">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-3xl overflow-hidden border border-gray-100">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gradient-to-r from-amber-50 to-orange-50">
              {["STT","#ID", "Tên Bàn", "Số Ghế", "Trạng Thái", "Hành Động"].map((el) => (
                <th
                  key={el}
                  className={`py-4 px-6 ${
                    el === "Hành Động" ? "text-center" : "text-left"
                  }`}
                >
                  <Typography variant="small" className="text-xs font-bold uppercase text-gray-700 tracking-wider">
                    {el}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tables.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-12">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-6xl mb-4 opacity-20">🪑</div>
                    <Typography className="text-sm text-gray-400 font-medium">
                      Chưa có bàn nào
                    </Typography>
                  </div>
                </td>
              </tr>
            ) : (
              tables.map((table, index) => {
                const className = `py-4 px-6 ${
                  index === tables.length - 1 ? "" : "border-b border-gray-100"
                }`;

                return (
                  <tr 
                    key={table.id} 
                    className="hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-orange-50/50 transition-all duration-200"
                  >
                    <td className={className}>
                      <Typography className="text-sm font-bold text-gray-600">
                        {index + 1}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        <Typography className="text-sm font-bold text-gray-800">
                          #{table.id}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🪑</span>
                        <Typography className="text-sm font-bold text-gray-800">
                          {table.number}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-2">
                        <span className="text-base">👥</span>
                        <Typography className="text-sm font-semibold text-gray-700">
                          {table.capacity} người
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      {/* DROPDOWN TRẠNG THÁI - CLICK ĐỂ ĐỔI NHANH */}
                      <Menu placement="bottom-start">
                        <MenuHandler>
                          <button className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${getStatusColor(table.status)}`}>
                            <span className="text-base">{getStatusIcon(table.status)}</span>
                            <span>{getStatusDisplay(table.status)}</span>
                            <ChevronDownIcon className="w-4 h-4 ml-1" />
                          </button>
                        </MenuHandler>
                        <MenuList className="p-2 shadow-xl border-gray-200 rounded-xl">
                          {statusOptions.map((option) => (
                            <MenuItem
                              key={option.value}
                              onClick={() => onStatusChange(table.id, option.value)}
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                                table.status === option.value 
                                  ? "bg-gray-100" 
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <span className="text-lg">{option.icon}</span>
                              <span className={`text-sm font-semibold ${option.color}`}>
                                {option.label}
                              </span>
                              {table.status === option.value && (
                                <CheckCircleIcon className="w-5 h-5 text-blue-500 ml-auto" />
                              )}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </Menu>
                    </td>
                    <td className={`${className} text-center`}>
                      <div className="flex justify-center gap-2">
                        {/* NÚT XEM */}
                        <Tooltip content="Xem chi tiết" placement="top">
                          <button
                            onClick={() => onShow(table)}
                          className="group relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#5d3a2f] shadow-md hover:shadow-xl hover:shadow-[#8B5E3C]/30 transition-all duration-300 hover:scale-110 active:scale-95"
                          >
                            <EyeIcon className="w-5 h-5 text-white" />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TablesTable;