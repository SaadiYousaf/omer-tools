import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BASE_URL || 'https://your-api-domain.com/api';

const blogService = {
  // Get blogs with query parameters - EXACTLY matching your controller
  getAllBlogs: async (parameters = {}) => {
    try {
      // Default parameters for frontend
      const defaultParams = {
        IsPublished: true,  // Show only published by default
        Page: 1,
        Limit: 9,
        Search: '',
        SortBy: 'CreatedAt',
        SortDescending: true,
        IncludeImages: true
      };

      // Merge default with provided parameters
      const queryParams = {
        ...defaultParams,
        ...parameters
      };

      console.log('Fetching blogs with params:', queryParams);
      
      const response = await axios.get(`${API_BASE_URL}/blogs`, {
        params: queryParams
      });
      
      console.log('Blogs API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get blog by slug - CORRECT
  getBlogBySlug: async (slug) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs/slug/${encodeURIComponent(slug)}`);
      console.log('Blog by slug response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog by slug:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get blog by ID - CORRECT
  getBlogById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog by ID:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get full blog details - Use this if you need categories/tags
  getBlogFullDetails: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs/full/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching full blog details:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get featured blogs - CORRECT
  getFeaturedBlogs: async (count = 3) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs/featured`, {
        params: { count }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured blogs:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get recent blogs - CORRECT
  getRecentBlogs: async (count = 5) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs/recent`, {
        params: { count }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent blogs:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get popular blogs - CORRECT
  getPopularBlogs: async (count = 3) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs/popular`, {
        params: { count }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular blogs:', error.response?.data || error.message);
      throw error;
    }
  },

  // Search blogs - Use the dedicated search endpoint
  searchBlogs: async (query, page = 1, limit = 9) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs/search`, {
        params: {
          query: query,
          page: page,
          pageSize: limit
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching blogs:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get blogs by category - CORRECT
  getBlogsByCategory: async (categoryId, page = 1, pageSize = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs/category/${categoryId}`, {
        params: { page, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs by category:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get blogs by tag - CORRECT
  getBlogsByTag: async (tagId, page = 1, pageSize = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs/tag/${tagId}`, {
        params: { page, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs by tag:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get blogs by archive
  getBlogsByArchive: async (year, month = null, page = 1, pageSize = 10) => {
    try {
      const url = month 
        ? `${API_BASE_URL}/blogs/archive/${year}/${month}`
        : `${API_BASE_URL}/blogs/archive/${year}`;
      
      const response = await axios.get(url, {
        params: { page, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs for archive:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get blogs by author
  getBlogsByAuthor: async (authorName, page = 1, pageSize = 10) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs/author/${encodeURIComponent(authorName)}`, {
        params: { page, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs by author:', error.response?.data || error.message);
      throw error;
    }
  },

  // Increment view count
  incrementViewCount: async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/blogs/${id}/view`);
    } catch (error) {
      console.error('Error incrementing view count:', error.response?.data || error.message);
      // Don't throw error as this shouldn't block page load
    }
  },

  // Get SEO details
  getBlogSEODetails: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs/seo/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching SEO details:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get sitemap data
  getBlogsSitemapData: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs/sitemap`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sitemap data:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default blogService;