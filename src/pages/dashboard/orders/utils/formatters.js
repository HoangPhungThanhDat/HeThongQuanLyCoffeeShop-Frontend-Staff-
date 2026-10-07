

export function formatPrice(value) {
    if (!value) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  }
  
  export function formatDate(date) {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  }
  
  export function formatCompactPrice(price) {
    if (!price) return "0";
    if (price >= 1_000_000_000) return `${(price / 1_000_000_000).toFixed(1)}B`;
    if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M`;
    if (price >= 1_000) return `${(price / 1_000).toFixed(0)}K`;
    return price.toString();
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
  
  /**
   * Format time ngắn gọn cho kanban card
   */
  export function formatCardTime(date) {
    if (!date) return "";
    try {
      const d = new Date(date);
      return `${d.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })} · ${d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      })}`;
    } catch {
      return "";
    }
  }