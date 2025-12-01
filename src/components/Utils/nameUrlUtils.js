export const nameUrlUtils = {
  // Convert product name to URL-friendly format
  convertNameToUrl: (productName) => {
    return productName
      .toLowerCase()
      .replace(/\s+/g, '-')        // Replace spaces with hyphens
      .replace(/^-+/, '')          // Remove leading hyphens
  },

  // Convert URL back to product name
  convertUrlToName: (urlSegment) => {
    return urlSegment.replace(/-/g, ' ');
  },
  convertUrlfromSearch: (productName) => {
    return productName
      .toLowerCase()
      .replace(' ', '-')        // Replace spaces with hyphens
  },
};