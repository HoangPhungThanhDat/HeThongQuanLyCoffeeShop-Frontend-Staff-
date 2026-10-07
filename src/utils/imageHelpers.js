

/**
 * SVG data URI — không cần internet, không bao giờ lỗi
 * Dùng làm fallback khi ảnh không có hoặc load lỗi
 */
export const DEFAULT_PRODUCT_IMG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='80' height='80' fill='%23f5ede3'/><text x='50%25' y='50%25' font-family='Arial' font-size='11' fill='%238B5E3C' text-anchor='middle' dominant-baseline='middle'>No Image</text></svg>";

/**
 * Chuẩn hóa URL ảnh:
 * - null/rỗng → SVG default
 * - full URL (http/https) → dùng luôn (Cloudinary)
 * - filename → prepend BE endpoint
 */
export const getImageUrl = (url) => {
  if (!url || url.trim() === "") return DEFAULT_PRODUCT_IMG;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `http://localhost:8080/api/products/image/${url}`;
};

/**
 * Handle onError — chỉ fallback 1 lần, tránh loop
 */
export const handleImageError = (e) => {
  if (e.target.src !== DEFAULT_PRODUCT_IMG) {
    e.target.src = DEFAULT_PRODUCT_IMG;
  }
};