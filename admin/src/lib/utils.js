export const capitalizeText = (text) => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getOrderStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'badge-success';
    case 'shipped':
      return 'badge-info';
    case 'pending':
      return 'badge-warning';
    case 'cancelled':
      return 'badge-error';
    default:
      return 'badge-ghost';
  }
};

export const getStockStatusBadge = (stock) => {
  if (stock === 0) return { text: 'Out of Stock', class: 'badge-error' };
  if (stock < 20) return { text: 'Low Stock', class: 'badge-warning' };
  return { text: 'In Stock', class: 'badge-success' };
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const PRODUCT_IMAGE_PLACEHOLDER =
  'https://via.placeholder.com/80x80?text=No+Image';

export const getProductImageUrl = (product) => {
  const images = Array.isArray(product?.images) ? product.images : [];

  if (images.length > 0) {
    const firstImage = images[0];

    // Handle both string URLs (old format) and object format (new format)
    if (typeof firstImage === 'string' && firstImage.trim()) {
      return firstImage;
    }

    if (typeof firstImage === 'object' && typeof firstImage.url === 'string') {
      return firstImage.url;
    }
  }

  // Fallback for legacy product formats.
  if (typeof product?.image === 'string' && product.image.trim()) {
    return product.image;
  }

  if (typeof product?.imageUrl === 'string' && product.imageUrl.trim()) {
    return product.imageUrl;
  }

  return PRODUCT_IMAGE_PLACEHOLDER;
};
