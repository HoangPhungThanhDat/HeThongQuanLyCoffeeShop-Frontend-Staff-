# 👨‍💼 HỆ THỐNG QUẢN LÝ QUÁN CÀ PHÊ - GIAO DIỆN NHÂN VIÊN

![version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![license](https://img.shields.io/badge/license-MIT-blue.svg)

![Coffee Shop Staff Dashboard](https://s3.amazonaws.com/creativetim_bucket/products/488/original/material-tailwind-dashboard-react.jpg)

**Hệ thống quản lý quán cà phê - Giao diện nhân viên** là ứng dụng web được thiết kế đặc biệt cho nhân viên phục vụ, giúp họ quản lý đơn hàng, bàn và thanh toán một cách nhanh chóng và hiệu quả. Được xây dựng trên **Material Tailwind Dashboard React** với **WebSocket** để cập nhật đơn hàng realtime từ khách hàng.

## ✨ Tính năng chính

### 🏠 **Dashboard - Tổng quan ca làm việc**
- 📊 Thống kê ca làm việc (số đơn đã xử lý, doanh thu)
- 📋 Danh sách đơn hàng đang chờ xử lý
- 🔔 Thông báo đơn hàng mới realtime
- 🪑 Sơ đồ bàn và trạng thái

### 📋 **Quản lý Đơn hàng**
- ✅ Xem danh sách đơn hàng realtime qua WebSocket
- ✅ Nhận thông báo tức thì khi có đơn hàng mới từ khách
- ✅ Tạo đơn hàng mới cho khách tại quầy
- ✅ Cập nhật trạng thái đơn hàng:
  - ⏳ Chờ xác nhận
  - 👨‍🍳 Đang chuẩn bị
  - ✅ Hoàn thành
  - ❌ Hủy
- ✅ Xem chi tiết đơn hàng và sản phẩm
- ✅ Chỉnh sửa đơn hàng trước khi xác nhận

### 🧾 **Chi tiết đơn hàng (Order Items)**
- ✅ Xem danh sách sản phẩm trong đơn
- ✅ Thêm/sửa/xóa sản phẩm trong đơn
- ✅ Cập nhật số lượng sản phẩm
- ✅ Áp dụng ghi chú đặc biệt cho món

### 🪑 **Quản lý Bàn**
- ✅ Xem trạng thái tất cả các bàn
  - 🟢 Trống
  - 🔴 Có khách
  - 🟡 Đã đặt
- ✅ Chọn bàn khi tạo đơn hàng
- ✅ Xem đơn hàng theo bàn
- ✅ Cập nhật trạng thái bàn
- ✅ Sơ đồ bàn trực quan

### 💰 **Quản lý Thanh toán & Hóa đơn**
- ✅ Tạo hóa đơn từ đơn hàng
- ✅ Xử lý thanh toán:
  - 💵 Tiền mặt
  - 💳 Chuyển khoản
  - 💳 Thẻ tín dụng
- ✅ Tính toán tổng tiền, thuế, giảm giá
- ✅ In hóa đơn cho khách
- ✅ Xem lịch sử hóa đơn
- ✅ Lưu thông tin thanh toán

### 🔔 **Thông báo Realtime**
- ✅ Nhận đơn hàng mới từ khách qua WebSocket
- ✅ Cập nhật trạng thái đơn tức thì
- ✅ Thông báo âm thanh khi có đơn mới
- ✅ Đồng bộ dữ liệu giữa nhiều thiết bị

### 👤 **Quản lý Hồ sơ cá nhân**
- ✅ Xem thông tin cá nhân
- ✅ Cập nhật avatar
- ✅ Đổi mật khẩu
- ✅ Xem lịch sử làm việc

## 🎯 Phân biệt với Admin Dashboard

| Tính năng | Admin | Staff |
|-----------|-------|-------|
| Quản lý sản phẩm | ✅ Toàn quyền | ❌ Chỉ xem |
| Quản lý danh mục | ✅ Toàn quyền | ❌ Không có |
| Quản lý người dùng | ✅ Toàn quyền | ❌ Không có |
| Quản lý khuyến mãi | ✅ Toàn quyền | ❌ Chỉ xem |
| Tạo đơn hàng | ✅ Có | ✅ Có |
| Xử lý đơn hàng | ✅ Có | ✅ Có (chính) |
| Quản lý bàn | ✅ CRUD | ✅ Xem & Cập nhật |
| Thanh toán | ✅ Có | ✅ Có (chính) |
| WebSocket realtime | ✅ Có | ✅ Có (chính) |
| Báo cáo tổng quan | ✅ Toàn bộ | ✅ Ca làm việc |

## 🚀 Quick Start

### Yêu cầu hệ thống

- **Node.js**: 16+ hoặc 18+ ([Download here](https://nodejs.org/en/download/))
- **npm**: 8+ hoặc yarn 1.22+
- **Backend API**: Đang chạy tại `http://localhost:8080`
- **WebSocket Server**: Đang chạy tại `ws://localhost:8080/ws`

### Cài đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd Frontend(Staff)
```

2. **Cài đặt dependencies**
```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

3. **Cấu hình API & WebSocket**

Mở `src/api/axiosClient.js`:
```javascript
const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

Mở `src/socket.js`:
```javascript
const socket = new SockJS('http://localhost:3001');
const stompClient = Stomp.over(socket);
```

4. **Chạy development server**
```bash
npm run dev
# hoặc
yarn dev
```

5. **Mở trình duyệt**
```
http://localhost:3003
```

### Đăng nhập

Sử dụng tài khoản nhân viên:
```
Username: NhanVien
Password: 123456
```

## 📦 What's Included

```
Frontend(Staff)/
├── public/
│   ├── css/
│   │   └── tailwind.css          # Tailwind CSS
│   └── img/                      # Images & Assets
├── src/
│   ├── api/                      # API Integration
│   │   ├── axiosClient.js        # Axios config + JWT interceptors
│   │   ├── AuthAPI.js            # Authentication
│   │   ├── orderApi.js           # Order management (chính)
│   │   ├── orderitemApi.js       # Order items CRUD
│   │   ├── billApi.js            # Bills & Payments (chính)
│   │   ├── tableApi.js           # Table management (chính)
│   │   ├── productApi.js         # Product view only
│   │   ├── categoryApi.js        # Category view only
│   │   ├── promotionApi.js       # Promotion view only
│   │   └── userApi.js            # User profile
│   │
│   ├── configs/                  # Configurations
│   │   ├── charts-config.js      # Chart settings
│   │   └── index.js
│   │
│   ├── context/                  # React Context API
│   │   └── index.jsx             # Global state (auth, orders)
│   │
│   ├── data/                     # Static & Mock data
│   │   ├── statistics-cards-data.js
│   │   └── orders-overview-data.js
│   │
│   ├── layouts/                  # Layout templates
│   │   ├── auth.jsx              # Auth layout
│   │   └── dashboard.jsx         # Dashboard layout
│   │
│   ├── pages/                    # Page components
│   │   ├── auth/                 # Login, Register
│   │   │   ├── sign-in.jsx       # Staff login
│   │   │   └── sign-up.jsx       # Staff registration
│   │   │
│   │   └── dashboard/            # Dashboard pages
│   │       ├── home.jsx          # Staff dashboard home
│   │       ├── profile.jsx       # Staff profile
│   │       │
│   │       ├── orders/           # **Order management (MAIN)**
│   │       │   ├── components/
│   │       │   │   └── OrderTable.jsx
│   │       │   ├── index.jsx     # List orders (realtime)
│   │       │   ├── create.jsx    # Create order
│   │       │   ├── edit.jsx      # Edit order
│   │       │   └── show.jsx      # Order details
│   │       │
│   │       ├── orderitems/       # Order items management
│   │       │   ├── components/
│   │       │   │   └── OrderItemsTable.jsx
│   │       │   ├── index.jsx     # List items in order
│   │       │   ├── create.jsx    # Add item to order
│   │       │   ├── edit.jsx      # Edit item quantity
│   │       │   └── show.jsx      # Item details
│   │       │
│   │       ├── bill/             # **Bill & Payment (MAIN)**
│   │       │   ├── components/
│   │       │   │   └── BillTable.jsx
│   │       │   ├── index.jsx     # List bills
│   │       │   ├── create.jsx    # Create bill from order
│   │       │   ├── edit.jsx      # Edit payment info
│   │       │   └── show.jsx      # Bill details & print
│   │       │
│   │       └── tables/           # **Table management (MAIN)**
│   │           ├── components/
│   │           │   └── TablesTable.jsx
│   │           ├── index.jsx     # Table layout view
│   │           └── show.jsx      # Table details & orders
│   │
│   ├── widgets/                  # Reusable components
│   │   ├── cards/                # Card components
│   │   │   ├── statistics-card.jsx
│   │   │   ├── profile-info-card.jsx
│   │   │   └── message-card.jsx
│   │   ├── charts/               # Chart components
│   │   │   └── statistics-chart.jsx
│   │   └── layout/               # Layout widgets
│   │       ├── sidenav.jsx       # Side navigation (staff menu)
│   │       ├── dashboard-navbar.jsx
│   │       ├── navbar.jsx
│   │       ├── footer.jsx
│   │       └── configurator.jsx
│   │
│   ├── socket.js                 # **WebSocket configuration**
│   ├── App.jsx                   # Main App component
│   ├── main.jsx                  # Entry point
│   └── routes.jsx                # Route definitions (staff routes)
│
├── .gitignore
├── package.json                  # Dependencies
├── vite.config.js               # Vite configuration
├── tailwind.config.cjs          # Tailwind configuration
├── postcss.config.cjs           # PostCSS configuration
├── jsconfig.json                # JavaScript configuration
└── index.html                   # HTML template
```

## 🔌 WebSocket Integration

### Kết nối WebSocket

File `src/socket.js`:
```javascript
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// Kết nối WebSocket
const socket = new SockJS('http://localhost:3001');
const stompClient = Stomp.over(socket);

// Kết nối và subscribe
stompClient.connect({}, (frame) => {
  console.log('Connected: ' + frame);
  
  // Subscribe nhận đơn hàng mới
  stompClient.subscribe('/topic/orders', (message) => {
    const newOrder = JSON.parse(message.body);
    console.log('New order received:', newOrder);
    // Cập nhật UI
    handleNewOrder(newOrder);
  });
  
  // Subscribe cập nhật trạng thái đơn
  stompClient.subscribe('/topic/orders/{orderId}', (message) => {
    const updatedOrder = JSON.parse(message.body);
    console.log('Order updated:', updatedOrder);
    // Cập nhật UI
    handleOrderUpdate(updatedOrder);
  });
});

export default stompClient;
```

### Sử dụng trong Component

```javascript
import { useEffect, useState } from 'react';
import stompClient from '@/socket';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    // Listen for new orders
    const subscription = stompClient.subscribe('/topic/orders', (message) => {
      const newOrder = JSON.parse(message.body);
      setOrders(prev => [newOrder, ...prev]);
      
      // Phát âm thanh thông báo
      playNotificationSound();
      
      // Hiển thị notification
      showNotification('Đơn hàng mới!', newOrder);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return (
    <div>
      {/* Order list */}
    </div>
  );
}
```

### WebSocket Topics

- `/topic/orders` - Nhận đơn hàng mới từ khách hàng
- `/topic/orders/{orderId}` - Cập nhật trạng thái đơn hàng cụ thể
- `/topic/tables/{tableId}` - Cập nhật trạng thái bàn
- `/topic/bills` - Thông báo thanh toán mới

## 🎨 UI Components

### Material Tailwind Components

- `Card`, `CardHeader`, `CardBody`, `CardFooter`
- `Button`, `IconButton`
- `Input`, `Textarea`, `Select`
- `Typography`
- `Avatar`, `Chip`, `Badge`
- `Dialog`, `Menu`, `Popover`
- `Table`, `Pagination`
- `Alert`, `Toast`
- `Tabs`, `Accordion`

### Custom Components cho Staff

- **OrderCard**: Hiển thị đơn hàng với trạng thái
- **TableLayout**: Sơ đồ bàn tương tác
- **OrderItemsList**: Danh sách sản phẩm trong đơn
- **PaymentDialog**: Modal thanh toán
- **BillPrint**: Template in hóa đơn
- **NotificationBell**: Thông báo đơn hàng mới

## ⚙️ Configuration

### Environment Variables

Tạo file `.env`:
```env
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:3001
VITE_APP_NAME=Coffee Shop Staff
```

### Tailwind Config

```javascript
// tailwind.config.cjs
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
};
```

## 🔐 Authentication & Authorization

### JWT Token Flow

1. **Login**: Staff nhập username/password
2. **Token**: Nhận JWT access token và refresh token
3. **Storage**: Lưu token vào localStorage
4. **Auto Attach**: Axios tự động gắn token vào headers
5. **Protected Routes**: Kiểm tra token trước khi truy cập
6. **Auto Refresh**: Tự động làm mới token khi hết hạn
7. **Logout**: Xóa token và disconnect WebSocket

### Role-based Access

```javascript
// Middleware kiểm tra role
const StaffRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'STAFF') {
    return <Navigate to="/auth/sign-in" />;
  }
  
  return children;
};
```

## 📱 Responsive Design

- **Desktop**: Full layout với sidebar và table view
- **Tablet**: Collapsible sidebar, card view cho orders
- **Mobile**: Bottom navigation, list view, touch-friendly

## 🔔 Notification System

### Browser Notifications

```javascript
// Request permission
if (Notification.permission === 'default') {
  Notification.requestPermission();
}

// Show notification
function showOrderNotification(order) {
  if (Notification.permission === 'granted') {
    new Notification('Đơn hàng mới!', {
      body: `Bàn ${order.tableNumber} - ${order.items.length} món`,
      icon: '/img/favicon.png',
      badge: '/img/favicon.png',
    });
  }
}
```

### Sound Notifications

```javascript
// Play sound
function playNotificationSound() {
  const audio = new Audio('/sounds/notification.mp3');
  audio.play();
}
```

## 🐛 Troubleshooting

### WebSocket không kết nối được

**Kiểm tra**:
1. Backend WebSocket endpoint đang chạy
2. URL trong `socket.js` đúng
3. CORS được cấu hình cho WebSocket
4. Firewall không block WebSocket port

**Fix**:
```javascript
// socket.js
const socket = new SockJS('http://localhost:8080/ws', null, {
  transports: ['websocket', 'xhr-streaming', 'xhr-polling']
});
```

### Không nhận được đơn hàng realtime

**Kiểm tra**:
1. WebSocket đã kết nối thành công
2. Subscribe đúng topic
3. Backend gửi message đúng format
4. Token JWT hợp lệ

**Debug**:
```javascript
stompClient.debug = (str) => {
  console.log('STOMP: ' + str);
};
```

### Thanh toán không thành công

**Kiểm tra**:
1. Đơn hàng đã được xác nhận
2. Tổng tiền được tính đúng
3. Phương thức thanh toán hợp lệ
4. Kết nối API backend

## 📊 Performance Optimization

### Lazy Loading

```javascript
// routes.jsx
const Orders = lazy(() => import('@/pages/dashboard/orders'));
const Bills = lazy(() => import('@/pages/dashboard/bill'));
```

### Memoization

```javascript
const OrdersList = memo(({ orders }) => {
  return orders.map(order => <OrderCard key={order.id} order={order} />);
});
```

### Debounce Search

```javascript
const debouncedSearch = useMemo(
  () => debounce((value) => searchOrders(value), 300),
  []
);
```

## 🚀 Deployment

### Build Production

```bash
npm run build
```

### Deploy to Vercel

```bash
vercel --prod
```

### Deploy to Netlify

```bash
netlify deploy --prod --dir=dist
```

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

## 📚 Documentation

- [Material Tailwind Docs](https://www.material-tailwind.com/)
- [WebSocket Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [SockJS](https://github.com/sockjs/sockjs-client)
- [STOMP.js](http://jmesnil.net/stomp-websocket/doc/)

## 🤝 Contributing

1. Fork project
2. Tạo branch mới (`git checkout -b feature/StaffFeature`)
3. Commit changes (`git commit -m 'Add staff feature'`)
4. Push to branch (`git push origin feature/StaffFeature`)
5. Tạo Pull Request

## 📄 License

Dự án được phân phối dưới giấy phép MIT.

## 📞 Contact
---Hoàng Đạt---
Email: dat147714@gmail.com

## 🙏 Acknowledgments

- [Material Tailwind](https://www.material-tailwind.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [SockJS](https://github.com/sockjs/sockjs-client)
- [STOMP.js](http://jmesnil.net/stomp-websocket/doc/)

---

**Made with ☕ and ⚛️ React | Designed for Coffee Shop Staff**