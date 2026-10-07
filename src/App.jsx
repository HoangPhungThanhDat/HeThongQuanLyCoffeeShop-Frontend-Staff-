import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { SocketProvider } from "@/context/SocketContext";
import AuthAPI from "@/api/AuthAPI";
import { getAccessToken } from "@/api/axiosClient";
import CoffeeLoader from "@/widgets/loaders/CoffeeLoader";

// ==================== PROTECTED ROUTE ====================
function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }
  return children;
}

// ==================== APP ====================
function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // F5: thử refresh để lấy Access Token mới từ httpOnly cookie
        await AuthAPI.refresh();
      } catch {
        // Không có refresh token → chưa đăng nhập
      } finally {
        setIsReady(true);
      }
    };
    bootstrap();
  }, []);

  // Đợi refresh xong mới render routes
  if (!isReady) {
    return <CoffeeLoader />;
  }

  return (
    <SocketProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />

        {/* Dashboard — yêu cầu đăng nhập */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/auth/*" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
      </Routes>
    </SocketProvider>
  );
}

export default App;