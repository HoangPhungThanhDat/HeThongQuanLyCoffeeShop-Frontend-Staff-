

export function formatPrice(value) {
    if (!value) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  }
  
  export function formatDate(dateStr) {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  }
  
  export function formatCompactPrice(price) {
    if (!price) return "0";
    if (price >= 1_000_000_000) return `${(price / 1_000_000_000).toFixed(1)}B`;
    if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M`;
    if (price >= 1_000) return `${(price / 1_000).toFixed(0)}K`;
    return price.toString();
  }
  
  /**
   * Lấy datetime hiện tại theo timezone VN (định dạng cho input datetime-local)
   */
  export function getCurrentVNDateTime() {
    const now = new Date();
    const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    return vnTime.toISOString().slice(0, 16);
  }
  
  /**
   * Chuyển date string sang format cho input datetime-local
   */
  export function toInputDateTime(dateStr) {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toISOString().slice(0, 16);
    } catch {
      return "";
    }
  }
  
  export function toStringSafe(value) {
    if (value === null || value === undefined) return "";
    return String(value);
  }
  
  export function matchesSearch(term, ...fields) {
    if (!term || !term.trim()) return true;
    const lowerTerm = term.toLowerCase().trim();
    return fields.some((field) =>
      toStringSafe(field).toLowerCase().includes(lowerTerm)
    );
  }