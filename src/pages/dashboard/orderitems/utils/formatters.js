

export function formatPrice(value) {
    if (!value) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  }
  
  export function formatCompactPrice(price) {
    if (!price) return "0";
    if (price >= 1_000_000_000) return `${(price / 1_000_000_000).toFixed(1)}B`;
    if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M`;
    if (price >= 1_000) return `${(price / 1_000).toFixed(0)}K`;
    return price.toString();
  }
  
  /**
   * Loại bỏ dấu tiếng Việt để search
   */
  export function removeVietnameseTones(str) {
    if (!str) return "";
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  }
  
  /**
   * Normalize string cho search — không dấu, lowercase, gộp spaces
   */
  export function normalizeSearchText(str) {
    return removeVietnameseTones(String(str || ""))
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  }
  
  /**
   * Search match có hỗ trợ tiếng Việt không dấu
   */
  export function matchesSearchSafe(term, ...fields) {
    if (!term || !term.trim()) return true;
    const normalizedTerm = normalizeSearchText(term);
  
    return fields.some((field) => {
      const normalizedField = normalizeSearchText(field);
      return normalizedField.includes(normalizedTerm);
    });
  }