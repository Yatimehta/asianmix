/**
 * Image optimization utilities for Asianmix Ireland
 * Supports responsive Shopify CDN image transformations, Unsplash transformations,
 * and high-efficiency fallback handling.
 */

export const FALLBACK_PRODUCT_IMAGE =
  'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/Indiangatebasmati.jpg?v=1700756384';

export function normalizeImageUrl(src?: string | null): string {
  if (!src) return FALLBACK_PRODUCT_IMAGE;
  let url = src.trim();
  if (url.startsWith('//')) {
    url = `https:${url}`;
  }
  // Convert asianmix.ie/cdn/shop/ to direct active Shopify CDN
  url = url.replace(
    /^(https?:\/\/)?(www\.)?asianmix\.ie\/cdn\/shop\//i,
    'https://cdn.shopify.com/s/files/1/0582/8336/0440/'
  );
  url = url.replace(
    /^\/cdn\/shop\//i,
    'https://cdn.shopify.com/s/files/1/0582/8336/0440/'
  );
  return url;
}

/**
 * Optimizes an image URL by appending provider-specific resizing & formatting query params.
 * Shopify CDN natively supports `&width={px}&format={webp|pjpg}`.
 * Unsplash supports `&w={px}&auto=format&q=80`.
 */
export function getOptimizedImageUrl(
  src?: string | null,
  width: number = 400,
  format?: 'webp' | 'avif' | 'jpg'
): string {
  const normalized = normalizeImageUrl(src);
  if (!normalized) return FALLBACK_PRODUCT_IMAGE;

  // Handle Shopify CDN URLs
  if (normalized.includes('cdn.shopify.com')) {
    try {
      const url = new URL(normalized);
      url.searchParams.set('width', width.toString());
      if (format) {
        url.searchParams.set('format', format);
      }
      return url.toString();
    } catch {
      const sep = normalized.includes('?') ? '&' : '?';
      return `${normalized}${sep}width=${width}`;
    }
  }

  // Handle Unsplash URLs
  if (normalized.includes('images.unsplash.com')) {
    try {
      const url = new URL(normalized);
      url.searchParams.set('w', width.toString());
      url.searchParams.set('auto', 'format');
      url.searchParams.set('q', '80');
      return url.toString();
    } catch {
      const sep = normalized.includes('?') ? '&' : '?';
      return `${normalized}${sep}w=${width}&auto=format&q=80`;
    }
  }

  // Local / relative images or other CDNs
  return normalized;
}

/**
 * Generates a standard responsive srcset string for Shopify or Unsplash images
 */
export function getResponsiveSrcSet(
  src?: string | null,
  widths: number[] = [240, 360, 480, 640]
): string {
  const normalized = normalizeImageUrl(src);
  if (!normalized) return '';
  if (!normalized.includes('cdn.shopify.com') && !normalized.includes('images.unsplash.com')) {
    return '';
  }

  return widths
    .map((w) => `${getOptimizedImageUrl(normalized, w)} ${w}w`)
    .join(', ');
}

