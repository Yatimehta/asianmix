/**
 * Image optimization utilities for Asianmix Ireland
 * Supports responsive Shopify CDN image transformations, Unsplash transformations,
 * and high-efficiency fallback handling.
 */

export const FALLBACK_PRODUCT_IMAGE =
  'https://cdn.shopify.com/s/files/1/0582/8336/0440/files/Indiangatebasmati.jpg?v=1700756384&width=400';

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
  if (!src) return FALLBACK_PRODUCT_IMAGE;

  // Handle Shopify CDN URLs
  if (src.includes('cdn.shopify.com')) {
    try {
      const url = new URL(src);
      url.searchParams.set('width', width.toString());
      if (format) {
        url.searchParams.set('format', format);
      }
      return url.toString();
    } catch {
      // Fallback string manipulation if URL parsing fails
      const sep = src.includes('?') ? '&' : '?';
      return `${src}${sep}width=${width}`;
    }
  }

  // Handle Unsplash URLs
  if (src.includes('images.unsplash.com')) {
    try {
      const url = new URL(src);
      url.searchParams.set('w', width.toString());
      url.searchParams.set('auto', 'format');
      url.searchParams.set('q', '80');
      return url.toString();
    } catch {
      const sep = src.includes('?') ? '&' : '?';
      return `${src}${sep}w=${width}&auto=format&q=80`;
    }
  }

  // Local / relative images or other CDNs
  return src;
}

/**
 * Generates a standard responsive srcset string for Shopify or Unsplash images
 */
export function getResponsiveSrcSet(
  src?: string | null,
  widths: number[] = [240, 360, 480, 640]
): string {
  if (!src) return '';
  if (!src.includes('cdn.shopify.com') && !src.includes('images.unsplash.com')) {
    return '';
  }

  return widths
    .map((w) => `${getOptimizedImageUrl(src, w)} ${w}w`)
    .join(', ');
}
