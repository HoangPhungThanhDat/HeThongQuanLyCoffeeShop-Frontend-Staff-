

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