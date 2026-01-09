
export const getBlogImageUrl = (blog) => {
  if (!blog) return '/images/default-blog.jpg';
  
  const baseUrl = process.env.REACT_APP_BASE_IMG_URL || '';
  
  // 1. Check featuredImageUrl first
  if (blog.featuredImageUrl) {
    return blog.featuredImageUrl.startsWith('http') 
      ? blog.featuredImageUrl 
      : `${baseUrl}${blog.featuredImageUrl}`;
  }
  
  // 2. Check images array (your structure: blog.images[0].imageUrl)
  if (blog.images && Array.isArray(blog.images) && blog.images.length > 0) {
    const firstImage = blog.images[0];
    if (firstImage && firstImage.imageUrl) {
      return firstImage.imageUrl.startsWith('http')
        ? firstImage.imageUrl
        : `${baseUrl}${firstImage.imageUrl}`;
    }
  }
  
  // 3. Check single image object
  if (blog.image && blog.image.imageUrl) {
    return blog.image.imageUrl.startsWith('http')
      ? blog.image.imageUrl
      : `${baseUrl}${blog.image.imageUrl}`;
  }
  
  // 4. Default fallback (make sure this exists in public/images/)
  return '/images/default-blog.jpg';
};

/**
 * Get all images for a blog gallery
 */
export const getAllBlogImages = (blog) => {
  if (!blog || !blog.images || !Array.isArray(blog.images)) return [];
  
  const baseUrl = process.env.REACT_APP_BASE_IMG_URL || '';
  
  return blog.images.map(image => ({
    ...image,
    fullUrl: image.imageUrl?.startsWith('http')
      ? image.imageUrl
      : `${baseUrl}${image.imageUrl || ''}`
  }));
};

/**
 * Convert relative URL to absolute using base image URL
 */
export const toAbsoluteImageUrl = (relativeUrl) => {
  if (!relativeUrl) return '';
  
  if (relativeUrl.startsWith('http') || relativeUrl.startsWith('data:')) {
    return relativeUrl;
  }
  
  const baseUrl = process.env.REACT_APP_BASE_IMG_URL || '';
  
  if (relativeUrl.startsWith('/')) {
    return `${baseUrl}${relativeUrl}`;
  }
  
  return `${baseUrl}/${relativeUrl}`;
};