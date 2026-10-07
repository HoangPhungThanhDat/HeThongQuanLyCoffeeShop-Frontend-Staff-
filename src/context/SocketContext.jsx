// src/context/SocketContext.jsx
import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useRef,
  } from 'react';
  import Swal from 'sweetalert2';
  import 'animate.css';
  
  import socket from '@/socket';
  import OrderAPI from '@/api/orderApi';
  import TableAPI from '@/api/tableApi';
  
  const SocketContext = createContext(null);
  
  /* =========================================================
     🔊 SOUND ENGINE — Âm thanh đa dạng theo ngữ cảnh
     ========================================================= */
  const SoundEngine = {
    _ctx: null,
    _unlocked: false,
    _enabled: true,
  
    // Khởi tạo AudioContext (cần thiết cho autoplay policy)
    init() {
      if (this._ctx) return this._ctx;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this._ctx = new AudioCtx();
      } catch (err) {
        console.warn('Không tạo được AudioContext:', err);
      }
      return this._ctx;
    },
  
    // Unlock audio khi user tương tác lần đầu
    unlock() {
      if (this._unlocked) return;
      const ctx = this.init();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          this._unlocked = true;
        });
      } else {
        this._unlocked = true;
      }
    },
  
    setEnabled(val) {
      this._enabled = !!val;
      if (val) this.unlock();
    },
  
    isEnabled() {
      return this._enabled;
    },
  
    // Phát một nốt
    _playTone(freq, startTime, duration, type = 'sine', volume = 0.3) {
      const ctx = this.init();
      if (!ctx) return;
  
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
  
      osc.connect(gain);
      gain.connect(ctx.destination);
  
      osc.type = type;
      osc.frequency.value = freq;
  
      const t0 = ctx.currentTime + startTime;
  
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(volume, t0 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
  
      osc.start(t0);
      osc.stop(t0 + duration + 0.02);
    },
  
    // Phát chuỗi nốt
    play(notes, { type = 'sine', volume = 0.3 } = {}) {
      if (!this._enabled) return;
      const ctx = this.init();
      if (!ctx) return;
  
      // Auto-resume nếu bị suspend
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
  
      notes.forEach((n) => {
        const [freq, start, dur] = Array.isArray(n) ? n : [n, 0, 0.15];
        this._playTone(freq, start, dur, type, volume);
      });
    },
  
    // ---------- PRESET SOUNDS ----------
    // 🆕 Đơn hàng mới: vui tươi, 3 nốt tăng dần
    newOrder() {
      this.play(
        [
          [660, 0, 0.12],
          [880, 0.13, 0.12],
          [1100, 0.26, 0.18],
        ],
        { type: 'sine', volume: 0.35 }
      );
    },
  
    // 🔔 Gọi nhân viên: khẩn cấp, lặp 3 lần
    callStaff() {
      this.play(
        [
          [1200, 0, 0.1],
          [1400, 0.12, 0.1],
          [1200, 0.35, 0.1],
          [1400, 0.47, 0.1],
          [1200, 0.7, 0.1],
          [1400, 0.82, 0.1],
        ],
        { type: 'triangle', volume: 0.4 }
      );
    },
  
    // ⚠️ Cảnh báo: trầm, 2 nốt
    warning() {
      this.play(
        [
          [500, 0, 0.2],
          [400, 0.22, 0.25],
        ],
        { type: 'sawtooth', volume: 0.25 }
      );
    },
  
    // 🚫 Hủy đơn: nặng, 2 nốt giảm
    cancel() {
      this.play(
        [
          [600, 0, 0.15],
          [400, 0.18, 0.25],
        ],
        { type: 'square', volume: 0.2 }
      );
    },
  
    // 🍽️ Thêm món: nhẹ nhàng
    itemsAdded() {
      this.play(
        [
          [880, 0, 0.1],
          [1100, 0.12, 0.12],
        ],
        { type: 'sine', volume: 0.3 }
      );
    },
  
    // 💳 Thanh toán: success chime
    paymentSuccess() {
      this.play(
        [
          [800, 0, 0.1],
          [1000, 0.12, 0.1],
          [1200, 0.24, 0.1],
          [1600, 0.36, 0.2],
        ],
        { type: 'sine', volume: 0.35 }
      );
    },
  };
  
  /* =========================================================
     📳 VIBRATE — Rung trên mobile
     ========================================================= */
  const vibrate = (pattern) => {
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch (err) {
      // ignore
    }
  };
  
  /* =========================================================
     🔔 BROWSER NOTIFICATION API
     ========================================================= */
  const requestNotificationPermission = async () => {
    try {
      if (!('Notification' in window)) return false;
      if (Notification.permission === 'granted') return true;
      if (Notification.permission === 'denied') return false;
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  };
  
  const showBrowserNotification = (title, body, options = {}) => {
    try {
      if (!('Notification' in window)) return;
      if (Notification.permission !== 'granted') return;
      const notification = new Notification(title, {
        body,
        icon: '/img/favicon.png',
        badge: '/img/favicon.png',
        tag: options.tag || 'coffee-staff',
        requireInteraction: options.requireInteraction || false,
        silent: true, // Tắt sound mặc định của browser (dùng sound engine)
        ...options,
      });
  
      if (options.autoClose !== false) {
        setTimeout(() => notification.close(), options.duration || 8000);
      }
  
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
  
      return notification;
    } catch (err) {
      console.warn('Browser notification failed:', err);
    }
  };
  
  /* =========================================================
     📌 BADGE — Số đếm trên tab title
     ========================================================= */
  const ORIGINAL_TITLE = document.title || 'Coffee Staff';
  let badgeCount = 0;
  
  const updateBadge = (count) => {
    badgeCount = Math.max(0, count);
    document.title = badgeCount > 0 ? `(${badgeCount}) ${ORIGINAL_TITLE}` : ORIGINAL_TITLE;
  };
  
  /* =========================================================
     🍞 TOAST — SweetAlert2 toast đẹp hơn
     ========================================================= */
  const showToast = (icon, title, message = '') => {
    const palette = {
      success: { bg: '#ecfdf5', border: '#10b981', text: '#065f46', icon: '✅' },
      error: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b', icon: '❌' },
      warning: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e', icon: '⚠️' },
      info: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af', icon: 'ℹ️' },
    };
    const c = palette[icon] || palette.info;
  
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title,
      text: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      customClass: { popup: 'staff-toast' },
      showClass: { popup: 'animate__animated animate__fadeInDown animate__faster' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp animate__faster' },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
        toast.style.backgroundColor = c.bg;
        toast.style.color = c.text;
        toast.style.borderLeft = `5px solid ${c.border}`;
        toast.style.boxShadow = `0 10px 30px ${c.border}30`;
        toast.style.fontWeight = '600';
        toast.style.padding = '14px 18px';
        toast.style.borderRadius = '12px';
      },
    });
  };
  
  /* =========================================================
     🏷️ HTML HELPERS — Tạo nội dung thông báo
     ========================================================= */
  const iconBox = (emoji, color1, color2) => `
    <div style="
      width: 72px; height: 72px;
      background: linear-gradient(135deg, ${color1}, ${color2});
      border-radius: 20px;
      display: flex; align-items: center; justify-content: center;
      font-size: 38px; margin: 0 auto 16px;
      box-shadow: 0 10px 30px ${color1}55;
      animation: pulse 1.5s ease-in-out infinite;
    ">${emoji}</div>
  `;
  
  const badgeChip = (text, bg, color) => `
    <span style="
      display: inline-block;
      background: ${bg}; color: ${color};
      padding: 4px 12px; border-radius: 50px;
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.5px; text-transform: uppercase;
      margin: 0 4px 4px 0;
    ">${text}</span>
  `;
  
  /* =========================================================
     PROVIDER
     ========================================================= */
  export function SocketProvider({ children }) {
    const [newOrderNotification, setNewOrderNotification] = useState(null);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [soundEnabled, setSoundEnabledState] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
  
    const isTabFocusedRef = useRef(document.hasFocus());
  
    /* ---------- Sound enable/disable ---------- */
    const setSoundEnabled = useCallback((val) => {
      setSoundEnabledState(val);
      SoundEngine.setEnabled(val);
      try {
        localStorage.setItem('staff_sound_enabled', val ? '1' : '0');
      } catch {}
    }, []);
  
    /* ---------- Badge helpers ---------- */
    const incBadge = useCallback((n = 1) => {
      setUnreadCount((prev) => {
        const next = prev + n;
        updateBadge(next);
        return next;
      });
    }, []);
  
    const clearBadge = useCallback(() => {
      setUnreadCount(0);
      updateBadge(0);
    }, []);
  
    /* ---------- Init: Sound unlock + Browser notif ---------- */
    useEffect(() => {
      // Load preference
      try {
        const saved = localStorage.getItem('staff_sound_enabled');
        if (saved === '0') {
          setSoundEnabledState(false);
          SoundEngine.setEnabled(false);
        }
      } catch {}
  
      // Unlock audio khi user tương tác lần đầu
      const unlock = () => {
        SoundEngine.unlock();
        document.removeEventListener('click', unlock);
        document.removeEventListener('keydown', unlock);
        document.removeEventListener('touchstart', unlock);
      };
      document.addEventListener('click', unlock, { once: true });
      document.addEventListener('keydown', unlock, { once: true });
      document.addEventListener('touchstart', unlock, { once: true });
  
      // Request notification permission
      requestNotificationPermission();
  
      // Focus tracking — reset badge khi tab được focus
      const onFocus = () => {
        isTabFocusedRef.current = true;
        clearBadge();
      };
      const onBlur = () => {
        isTabFocusedRef.current = false;
      };
      window.addEventListener('focus', onFocus);
      window.addEventListener('blur', onBlur);
  
      return () => {
        document.removeEventListener('click', unlock);
        document.removeEventListener('keydown', unlock);
        document.removeEventListener('touchstart', unlock);
        window.removeEventListener('focus', onFocus);
        window.removeEventListener('blur', onBlur);
      };
    }, [clearBadge]);
  
    /* =========================================================
       🔔 Hàm fetch order detail dùng chung
       ========================================================= */
    const fetchOrderById = useCallback(async (orderId) => {
      try {
        const res = await OrderAPI.getAll();
        const orders = Array.isArray(res.data) ? res.data : [];
        return orders.find((o) => o.id === parseInt(orderId)) || null;
      } catch (err) {
        console.error('Lỗi fetch order:', err);
        return null;
      }
    }, []);
  
    /* =========================================================
       SOCKET LISTENERS
       ========================================================= */
    useEffect(() => {
      console.log('🔌 [SocketProvider] Đăng ký listeners');
  
      // ---------- Connect ----------
      const handleConnect = () => {
        console.log('✅ Socket connected (global):', socket.id);
      };
  
      // ============================================
      // 🆕 ĐƠN HÀNG MỚI
      // ============================================
      const handleNewOrder = async (orderData) => {
        console.log('📦 [GLOBAL] Đơn mới:', orderData);
  
        SoundEngine.newOrder();
        vibrate([200, 100, 200]);
        setNewOrderNotification(orderData);
        setRefreshTrigger((prev) => prev + 1);
        incBadge(1);
  
        // Browser notification
        showBrowserNotification(
          `☕ Đơn hàng mới #${orderData.id || orderData.orderId}`,
          `Bàn ${orderData.tableNumber || '?'} • ${(orderData.totalAmount || 0).toLocaleString()}₫`,
          { tag: `new-order-${orderData.id}`, duration: 10000 }
        );
  
        Swal.fire({
          title: '',
          html: `
            <div style="text-align: center; padding: 8px;">
              ${iconBox('🎉', '#fbbf24', '#f59e0b')}
              <h2 style="
                font-size: 24px; font-weight: 800; color: #1f2937;
                margin: 0 0 6px; letter-spacing: -0.5px;
              ">Đơn Hàng Mới!</h2>
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 20px;">
                Vừa có đơn hàng mới được đặt
              </p>
  
              <div style="
                background: linear-gradient(135deg, #fffbeb, #fef3c7);
                border-radius: 16px; padding: 20px;
                border: 2px solid #fcd34d;
                text-align: left;
              ">
                <div style="
                  display: grid; grid-template-columns: 1fr 1fr;
                  gap: 14px; margin-bottom: 16px;
                ">
                  <div style="background: white; padding: 12px; border-radius: 12px;">
                    <p style="font-size: 11px; color: #9ca3af; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">Mã đơn</p>
                    <p style="font-size: 20px; font-weight: 800; color: #d97706; margin: 0;">
                      #${orderData.id || orderData.orderId}
                    </p>
                  </div>
                  <div style="background: white; padding: 12px; border-radius: 12px;">
                    <p style="font-size: 11px; color: #9ca3af; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">Bàn số</p>
                    <p style="font-size: 20px; font-weight: 800; color: #d97706; margin: 0;">
                      🪑 ${orderData.tableNumber || '?'}
                    </p>
                  </div>
                </div>
  
                <div style="
                  background: white; padding: 14px;
                  border-radius: 12px; text-align: center;
                ">
                  <p style="font-size: 11px; color: #9ca3af; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700;">Tổng tiền</p>
                  <p style="font-size: 28px; font-weight: 900; color: #16a34a; margin: 0; letter-spacing: -1px;">
                    ${(orderData.totalAmount || 0).toLocaleString()}₫
                  </p>
                </div>
              </div>
  
              <div style="margin-top: 16px;">
                ${badgeChip('⚡ Ưu tiên cao', '#fee2e2', '#dc2626')}
                ${badgeChip('🕐 Cần xử lý ngay', '#dbeafe', '#2563eb')}
              </div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: '👀 Xem đơn ngay',
          cancelButtonText: 'Đóng',
          confirmButtonColor: '#d97706',
          cancelButtonColor: '#9ca3af',
          customClass: { popup: 'animate__animated animate__bounceIn' },
          width: '520px',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            setNewOrderNotification(orderData);
            setRefreshTrigger((prev) => prev + 1);
          }
        });
      };
  
      // ============================================
      // ⚠️ CẢNH BÁO ĐƠN
      // ============================================
      const handleOrderWarning = async (data) => {
        console.log('⚠️ [GLOBAL] Cảnh báo:', data);
  
        SoundEngine.warning();
        vibrate([100, 50, 100]);
        incBadge(1);
  
        showBrowserNotification(
          `⚠️ Cảnh báo đơn #${data.orderId}`,
          data.message || 'Cần kiểm tra đơn hàng',
          { tag: `warning-${data.orderId}`, requireInteraction: true }
        );
  
        await Swal.fire({
          html: `
            <div style="text-align: center; padding: 8px;">
              ${iconBox('⚠️', '#f59e0b', '#d97706')}
              <h2 style="font-size: 22px; font-weight: 800; color: #1f2937; margin: 0 0 6px;">
                Cảnh Báo Đơn Hàng
              </h2>
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 20px;">
                Đơn <strong style="color: #d97706;">#${data.orderId}</strong> cần bạn chú ý
              </p>
              <div style="
                background: #fffbeb; border-left: 5px solid #f59e0b;
                padding: 16px; border-radius: 12px; text-align: left;
              ">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  ${data.message || 'Không có mô tả'}
                </p>
              </div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: 'Đã hiểu',
          cancelButtonText: 'Đóng',
          confirmButtonColor: '#f59e0b',
          cancelButtonColor: '#9ca3af',
          width: '480px',
        });
      };
  
      // ============================================
      // 🚫 YÊU CẦU HỦY ĐƠN
      // ============================================
      const handleCancelRequest = async (data) => {
        console.log('🚫 [GLOBAL] Yêu cầu hủy:', data);
  
        SoundEngine.cancel();
        vibrate([300, 100, 300, 100, 300]);
        incBadge(1);
  
        showBrowserNotification(
          `🚫 Yêu cầu hủy đơn #${data.orderId}`,
          'Khách hàng muốn hủy đơn — cần xác nhận',
          { tag: `cancel-${data.orderId}`, requireInteraction: true }
        );
  
        const result = await Swal.fire({
          html: `
            <div style="text-align: center; padding: 8px;">
              ${iconBox('🚫', '#ef4444', '#dc2626')}
              <h2 style="font-size: 22px; font-weight: 800; color: #1f2937; margin: 0 0 6px;">
                Yêu Cầu Hủy Đơn
              </h2>
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 20px;">
                Khách hàng yêu cầu hủy đơn hàng
              </p>
  
              <div style="
                background: linear-gradient(135deg, #fef2f2, #fee2e2);
                border: 2px solid #fca5a5;
                border-radius: 16px; padding: 20px; text-align: left;
              ">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                  <div style="background: white; padding: 12px; border-radius: 10px;">
                    <p style="font-size: 11px; color: #9ca3af; margin: 0 0 4px; text-transform: uppercase; font-weight: 700;">Mã đơn</p>
                    <p style="font-size: 18px; font-weight: 800; color: #dc2626; margin: 0;">#${data.orderId}</p>
                  </div>
                  <div style="background: white; padding: 12px; border-radius: 10px;">
                    <p style="font-size: 11px; color: #9ca3af; margin: 0 0 4px; text-transform: uppercase; font-weight: 700;">Thời gian</p>
                    <p style="font-size: 13px; font-weight: 700; color: #374151; margin: 0;">
                      ${new Date(data.requestedAt || Date.now()).toLocaleTimeString('vi-VN')}
                    </p>
                  </div>
                </div>
                ${data.reason ? `
                  <div style="margin-top: 12px; background: white; padding: 12px; border-radius: 10px;">
                    <p style="font-size: 11px; color: #9ca3af; margin: 0 0 4px; text-transform: uppercase; font-weight: 700;">Lý do</p>
                    <p style="margin: 0; color: #374151; font-size: 14px;">${data.reason}</p>
                  </div>
                ` : ''}
              </div>
  
              <p style="color: #dc2626; font-size: 13px; font-weight: 700; margin-top: 16px;">
                ⚠️ Hành động này không thể hoàn tác!
              </p>
            </div>
          `,
          icon: undefined,
          showCancelButton: true,
          confirmButtonText: '✅ Đồng ý hủy',
          cancelButtonText: '❌ Từ chối',
          confirmButtonColor: '#ef4444',
          cancelButtonColor: '#6b7280',
          customClass: { popup: 'animate__animated animate__shakeX' },
          width: '500px',
          allowOutsideClick: false,
        });
  
        if (result.isConfirmed) {
          try {
            const order = await fetchOrderById(data.orderId);
            if (order) {
              await OrderAPI.update(data.orderId, {
                tableId: order.table?.id,
                employeeId: order.employee?.id,
                promotionId: order.promotion?.id,
                status: 'CANCELLED',
                notes: order.notes,
                totalAmount: order.totalAmount,
              });
  
              socket.emit('staff-update-status', {
                orderId: data.orderId.toString(),
                newStatus: 'CANCELLED',
                timestamp: new Date().toISOString(),
                staffId: socket.id,
              });
  
              if (order.table?.id) {
                await TableAPI.update(order.table.id, {
                  tableNumber: order.table.tableNumber,
                  capacity: order.table.capacity,
                  status: 'FREE',
                });
  
                socket.emit('table-status-changed', {
                  tableId: order.table.id,
                  tableNumber: order.table.tableNumber,
                  newStatus: 'FREE',
                  orderId: data.orderId.toString(),
                  timestamp: new Date().toISOString(),
                  updatedBy: socket.id,
                });
              }
  
              showToast('success', '✅ Đã hủy đơn theo yêu cầu');
              setRefreshTrigger((prev) => prev + 1);
            }
          } catch (err) {
            console.error('Lỗi hủy đơn:', err);
            showToast('error', '❌ Không thể hủy đơn');
          }
        } else {
          showToast('info', 'ℹ️ Đã từ chối yêu cầu hủy');
        }
      };
  
      // ============================================
      // 🍽️ KHÁCH THÊM MÓN
      // ============================================
      const handleStaffNotification = async (data) => {
        console.log('📢 [GLOBAL] Staff notification:', data);
  
        if (data.type === 'items-added') {
          SoundEngine.itemsAdded();
          vibrate([150, 80, 150]);
          setRefreshTrigger((prev) => prev + 1);
          incBadge(1);
  
          showBrowserNotification(
            `🍽️ Khách thêm món — Đơn #${data.orderId}`,
            `${data.items?.length || 0} món mới • Tổng: ${(data.newTotal || 0).toLocaleString()}₫`,
            { tag: `items-${data.orderId}` }
          );
  
          const itemsHtml = (data.items || [])
            .map(
              (item) => `
                <div style="
                  display: flex; justify-content: space-between; align-items: center;
                  padding: 10px 12px; background: white; border-radius: 10px;
                  margin-bottom: 6px; border: 1px solid #f3f4f6;
                ">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="
                      width: 32px; height: 32px; background: #fef3c7; border-radius: 8px;
                      display: flex; align-items: center; justify-content: center;
                      font-size: 16px;
                    ">☕</div>
                    <div>
                      <p style="margin: 0; font-weight: 700; color: #1f2937; font-size: 13px;">
                        ${item.name || 'N/A'}
                      </p>
                      <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                        ${((item.price || 0)).toLocaleString()}₫ × ${item.quantity}
                      </p>
                    </div>
                  </div>
                  <p style="
                    margin: 0; font-weight: 800; color: #d97706;
                    font-size: 14px; white-space: nowrap;
                  ">
                    ${((item.price || 0) * item.quantity).toLocaleString()}₫
                  </p>
                </div>
              `
            )
            .join('');
  
          const result = await Swal.fire({
            html: `
              <div style="text-align: center; padding: 8px;">
                ${iconBox('🍽️', '#22c55e', '#16a34a')}
                <h2 style="font-size: 22px; font-weight: 800; color: #1f2937; margin: 0 0 6px;">
                  Khách Thêm Món!
                </h2>
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 18px;">
                  Đơn <strong style="color: #16a34a;">#${data.orderId}</strong> vừa được thêm món
                </p>
  
                <div style="
                  background: #f9fafb; border-radius: 14px; padding: 14px;
                  margin-bottom: 14px; max-height: 240px; overflow-y: auto;
                  text-align: left;
                ">
                  ${itemsHtml}
                </div>
  
                <div style="
                  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
                  border: 2px solid #6ee7b7;
                  border-radius: 14px; padding: 16px;
                  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
                ">
                  <div>
                    <p style="font-size: 11px; color: #047857; margin: 0 0 4px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">➕ Thêm</p>
                    <p style="font-size: 18px; font-weight: 800; color: #059669; margin: 0;">
                      +${(data.additionalAmount || 0).toLocaleString()}₫
                    </p>
                  </div>
                  <div>
                    <p style="font-size: 11px; color: #047857; margin: 0 0 4px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">💰 Tổng mới</p>
                    <p style="font-size: 20px; font-weight: 900; color: #047857; margin: 0; letter-spacing: -0.5px;">
                      ${(data.newTotal || 0).toLocaleString()}₫
                    </p>
                  </div>
                </div>
              </div>
            `,
            showCancelButton: true,
            confirmButtonText: '👀 Xem đơn hàng',
            cancelButtonText: 'Đóng',
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#9ca3af',
            customClass: { popup: 'animate__animated animate__bounceIn' },
            width: '520px',
          });
  
          if (result.isConfirmed) {
            const order = await fetchOrderById(data.orderId);
            if (order) {
              setCurrentOrder(order);
            } else {
              showToast('warning', '⚠️ Không tìm thấy đơn. Vui lòng refresh!');
            }
          }
        }
      };
  
      // ============================================
      // 🔔 KHÁCH GỌI NHÂN VIÊN — URGENT
      // ============================================
      const handleCallStaff = async (data) => {
        console.log('🔔 [GLOBAL] Khách gọi NV:', data);
  
        SoundEngine.callStaff();
        vibrate([400, 150, 400, 150, 400, 150, 400]);
        incBadge(1);
  
        showBrowserNotification(
          `🔔 KHẨN: Bàn ${data.tableNumber} gọi nhân viên!`,
          `${data.customerName || 'Khách'} • ${data.message || 'Yêu cầu hỗ trợ'}`,
          { tag: `call-${data.tableNumber}`, requireInteraction: true, duration: 30000 }
        );
  
        const result = await Swal.fire({
          html: `
            <div style="text-align: center; padding: 8px;">
              <div style="
                width: 88px; height: 88px;
                background: linear-gradient(135deg, #ef4444, #dc2626);
                border-radius: 50%; margin: 0 auto 18px;
                display: flex; align-items: center; justify-content: center;
                font-size: 44px;
                box-shadow: 0 0 0 0 rgba(239,68,68,0.6);
                animation: pulseRing 1.6s ease-out infinite;
              ">🔔</div>
  
              <h2 style="
                font-size: 26px; font-weight: 900; color: #dc2626;
                margin: 0 0 6px; letter-spacing: -0.5px;
                animation: pulse 1.2s ease-in-out infinite;
              ">KHÁCH GỌI NHÂN VIÊN!</h2>
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 20px;">
                Yêu cầu hỗ trợ khẩn cấp
              </p>
  
              <div style="
                background: linear-gradient(135deg, #fff8e1, #ffecb3);
                border: 3px solid #ffb300;
                border-radius: 18px; padding: 22px;
                margin-bottom: 16px;
              ">
                <div style="
                  display: grid; grid-template-columns: 1fr 1fr;
                  gap: 14px; margin-bottom: 14px;
                ">
                  <div style="background: white; padding: 14px; border-radius: 12px;">
                    <p style="font-size: 11px; color: #9ca3af; margin: 0 0 4px; text-transform: uppercase; font-weight: 700;">Bàn số</p>
                    <p style="font-size: 36px; font-weight: 900; color: #d97706; margin: 0; line-height: 1;">
                      ${data.tableNumber}
                    </p>
                  </div>
                  <div style="background: white; padding: 14px; border-radius: 12px;">
                    <p style="font-size: 11px; color: #9ca3af; margin: 0 0 4px; text-transform: uppercase; font-weight: 700;">Đơn hàng</p>
                    <p style="font-size: 22px; font-weight: 900; color: #2563eb; margin: 0; line-height: 1.2;">
                      #${data.orderId}
                    </p>
                  </div>
                </div>
  
                <div style="background: white; padding: 12px; border-radius: 12px; text-align: left; margin-bottom: 10px;">
                  <p style="font-size: 11px; color: #9ca3af; margin: 0 0 4px; text-transform: uppercase; font-weight: 700;">👤 Khách hàng</p>
                  <p style="font-weight: 700; color: #1f2937; margin: 0; font-size: 14px;">
                    ${data.customerName || 'Khách'}
                  </p>
                </div>
  
                <div style="background: white; padding: 12px; border-radius: 12px; text-align: left;">
                  <p style="font-size: 11px; color: #9ca3af; margin: 0 0 4px; text-transform: uppercase; font-weight: 700;">💬 Yêu cầu</p>
                  <p style="font-weight: 600; color: #1f2937; margin: 0; font-size: 14px;">
                    ${data.message || 'Yêu cầu hỗ trợ'}
                  </p>
                </div>
              </div>
  
              <div style="
                background: #fee2e2; border-left: 5px solid #dc2626;
                padding: 14px; border-radius: 12px; text-align: left;
              ">
                <p style="font-size: 13px; color: #991b1b; margin: 0; font-weight: 700; line-height: 1.5;">
                  ⚡ <strong>HÀNH ĐỘNG NGAY:</strong> Vui lòng đến bàn <strong>${data.tableNumber}</strong> để hỗ trợ khách!
                </p>
              </div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: '✅ Đã nhận - Đang đến',
          cancelButtonText: 'Đóng',
          confirmButtonColor: '#22c55e',
          cancelButtonColor: '#6b7280',
          customClass: { popup: 'animate__animated animate__bounceIn' },
          allowOutsideClick: false,
          allowEscapeKey: false,
          width: '580px',
        });
  
        if (result.isConfirmed) {
          socket.emit('staff-acknowledge-call', {
            tableNumber: data.tableNumber,
            orderId: data.orderId,
            staffName: 'Nhân viên',
            acknowledgedAt: new Date().toISOString(),
          });
          showToast('success', `✅ Đã nhận - Đang đến bàn ${data.tableNumber}`);
        }
      };
  
      // ============================================
      // 💳 THANH TOÁN THÀNH CÔNG
      // ============================================
      const handlePayment = async (data) => {
        console.log('💳 [GLOBAL] Payment:', data);
  
        SoundEngine.paymentSuccess();
        vibrate([100, 60, 100, 60, 200]);
        setRefreshTrigger((prev) => prev + 1);
        incBadge(1);
  
        socket.emit('staff-update-status', {
          orderId: data.orderId.toString(),
          newStatus: 'PAID',
          timestamp: new Date().toISOString(),
          staffId: socket.id,
          source: 'payment-system',
        });
  
        const order = await fetchOrderById(data.orderId);
        const tableId = data.tableId || order?.table?.id;
        const tableNumber = data.tableNumber || order?.table?.tableNumber;
        const tableCapacity = data.tableCapacity || order?.table?.capacity;
  
        showBrowserNotification(
          `💳 Thanh toán thành công — Bàn ${tableNumber}`,
          `${(data.amount || 0).toLocaleString()}₫ • ${data.paymentMethod || ''}`,
          { tag: `payment-${data.orderId}` }
        );
  
        if (tableId && tableNumber) {
          try {
            await TableAPI.update(tableId, {
              tableNumber,
              capacity: tableCapacity || 4,
              status: 'FREE',
            });
  
            socket.emit('table-status-changed', {
              tableId,
              tableNumber,
              newStatus: 'FREE',
              orderId: data.orderId.toString(),
              timestamp: new Date().toISOString(),
              updatedBy: socket.id,
              reason: 'PAYMENT_COMPLETED',
            });
          } catch (err) {
            console.error('❌ Lỗi cập nhật bàn:', err);
          }
        }
  
        const result = await Swal.fire({
          html: `
            <div style="text-align: center; padding: 8px;">
              ${iconBox('💳', '#22c55e', '#16a34a')}
              <h2 style="font-size: 24px; font-weight: 900; color: #16a34a; margin: 0 0 6px;">
                Thanh Toán Thành Công!
              </h2>
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 20px;">
                Cảm ơn quý khách đã sử dụng dịch vụ
              </p>
  
              <div style="
                background: linear-gradient(135deg, #ecfdf5, #d1fae5);
                border: 2px solid #6ee7b7;
                border-radius: 18px; padding: 22px;
              ">
                <div style="
                  display: grid; grid-template-columns: 1fr 1fr;
                  gap: 14px; padding-bottom: 16px;
                  border-bottom: 2px dashed #a7f3d0;
                  margin-bottom: 16px;
                ">
                  <div style="background: white; padding: 14px; border-radius: 12px;">
                    <p style="font-size: 11px; color: #9ca3af; margin: 0 0 4px; text-transform: uppercase; font-weight: 700;">Bàn số</p>
                    <p style="font-size: 32px; font-weight: 900; color: #059669; margin: 0; line-height: 1;">
                      ${data.tableNumber}
                    </p>
                  </div>
                  <div style="background: white; padding: 14px; border-radius: 12px;">
                    <p style="font-size: 11px; color: #9ca3af; margin: 0 0 4px; text-transform: uppercase; font-weight: 700;">Tổng tiền</p>
                    <p style="font-size: 22px; font-weight: 900; color: #059669; margin: 0; line-height: 1.2; letter-spacing: -0.5px;">
                      ${(data.amount || 0).toLocaleString()}₫
                    </p>
                  </div>
                </div>
  
                <div style="
                  display: grid; grid-template-columns: 1fr 1fr 1fr;
                  gap: 10px; font-size: 12px;
                ">
                  <div style="background: white; padding: 10px; border-radius: 10px;">
                    <p style="font-size: 10px; color: #9ca3af; margin: 0 0 3px; text-transform: uppercase; font-weight: 700;">Phương thức</p>
                    <p style="font-weight: 800; color: #059669; margin: 0; font-size: 13px;">
                      ${data.paymentMethod || '—'}
                    </p>
                  </div>
                  <div style="background: white; padding: 10px; border-radius: 10px;">
                    <p style="font-size: 10px; color: #9ca3af; margin: 0 0 3px; text-transform: uppercase; font-weight: 700;">Đơn hàng</p>
                    <p style="font-weight: 800; color: #059669; margin: 0; font-size: 13px;">
                      #${data.orderId}
                    </p>
                  </div>
                  <div style="background: white; padding: 10px; border-radius: 10px;">
                    <p style="font-size: 10px; color: #9ca3af; margin: 0 0 3px; text-transform: uppercase; font-weight: 700;">Mã GD</p>
                    <p style="font-family: monospace; font-weight: 800; color: #059669; margin: 0; font-size: 11px; word-break: break-all;">
                      ${data.transactionNo || '—'}
                    </p>
                  </div>
                </div>
              </div>
  
              <div style="
                background: #dbeafe; border-left: 5px solid #3b82f6;
                padding: 12px; border-radius: 12px; margin-top: 16px;
                text-align: left;
              ">
                <p style="font-size: 13px; color: #1e40af; margin: 0; font-weight: 700;">
                  ✓ Bàn ${data.tableNumber} đã được giải phóng và sẵn sàng đón khách mới
                </p>
              </div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: '📋 Xem chi tiết',
          cancelButtonText: '✓ Đóng',
          confirmButtonColor: '#16a34a',
          cancelButtonColor: '#6b7280',
          customClass: { popup: 'animate__animated animate__zoomIn' },
          width: '520px',
        });
  
        socket.emit('staff-acknowledge-payment', {
          orderId: data.orderId,
          tableNumber: data.tableNumber,
          staffName: 'Nhân viên',
          acknowledgedAt: new Date().toISOString(),
        });
  
        if (result.isConfirmed && order) {
          setCurrentOrder(order);
        }
      };
  
      /* ---------- Đăng ký ---------- */
      socket.on('connect', handleConnect);
      socket.on('new-order', handleNewOrder);
      socket.on('order-warning', handleOrderWarning);
      socket.on('order-cancel-request', handleCancelRequest);
      socket.on('staff-notification', handleStaffNotification);
      socket.on('staff-call-notification', handleCallStaff);
      socket.on('payment-notification', handlePayment);
  
      return () => {
        socket.off('connect', handleConnect);
        socket.off('new-order', handleNewOrder);
        socket.off('order-warning', handleOrderWarning);
        socket.off('order-cancel-request', handleCancelRequest);
        socket.off('staff-notification', handleStaffNotification);
        socket.off('staff-call-notification', handleCallStaff);
        socket.off('payment-notification', handlePayment);
        console.log('🔌 [SocketProvider] Đã gỡ listeners');
      };
    }, [fetchOrderById, incBadge]);
  
    /* =========================================================
       VALUE
       ========================================================= */
    const value = {
      newOrderNotification,
      setNewOrderNotification,
      currentOrder,
      setCurrentOrder,
      refreshTrigger,
      // Sound control
      soundEnabled,
      setSoundEnabled,
      // Badge
      unreadCount,
      clearBadge,
    };
  
    return (
      <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
    );
  }
  
  /* =========================================================
     HOOK
     ========================================================= */
  export function useSocketNotifications() {
    const ctx = useContext(SocketContext);
    if (!ctx) {
      throw new Error('useSocketNotifications phải dùng trong SocketProvider');
    }
    return ctx;
  }