import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import blogService from '../../services/blogService';
import BlogCard from '../../components/common/Blog/BlogCard';
import BlogSidebar from '../../components/common/Blog/BlogSidebar';
import { getBlogImageUrl } from '../../components/Utils/ImageHelper';
import '../../components/common/Blog/Blog.css';
import SEO from '../../components/common/SEO/SEO';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [totalBlogs, setTotalBlogs] = useState(0);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      if (searchValue !== '') {
        setCurrentPage(1);
        fetchBlogs(searchValue);
      }
    }, 500),
    []
  );

  useEffect(() => {
    fetchBlogs();
    fetchSidebarData();
  }, [currentPage]);

  useEffect(() => {
    if (searchTerm === '') {
      setCurrentPage(1);
      fetchBlogs();
    } else {
      debouncedSearch(searchTerm);
    }
    
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const fetchBlogs = async (searchQuery = '') => {
    try {
      setLoading(true);
      let response;
      
      console.log('Fetching blogs, page:', currentPage, 'search:', searchQuery);
      
      if (searchQuery.trim()) {
        // Use dedicated search endpoint
        response = await blogService.searchBlogs(searchQuery, currentPage, 9);
      } else {
        // Use main endpoint with only published blogs
        response = await blogService.getAllBlogs({
          IsPublished: true,
          Page: currentPage,
          Limit: 9,
          Search: searchQuery,
          SortBy: 'CreatedAt',
          SortDescending: true,
          IncludeImages: true
        });
      }
      
      console.log('API Response received:', response);
      
      // Process response based on structure
      let blogData = [];
      let total = 0;
      let pages = 1;
      
      if (response && response.data && Array.isArray(response.data)) {
        // If response has { data: [], total: X, totalPages: X } structure
        blogData = response.data;
        total = response.total || blogData.length;
        pages = response.totalPages || 1;
      } else if (Array.isArray(response)) {
        // If response is direct array
        blogData = response;
        total = response.length;
        pages = 1;
      } else if (response && Array.isArray(response.blogs)) {
        // If response has { blogs: [] } structure
        blogData = response.blogs;
        total = response.total || blogData.length;
        pages = response.totalPages || 1;
      }
      
      // Process images for all blogs
      const processedBlogs = blogData.map(blog => {
        const processedBlog = { ...blog };
        
        // Get image URL using helper
        processedBlog.featuredImageUrl = getBlogImageUrl(blog);
        
        return processedBlog;
      });
      
      setBlogs(processedBlogs);
      setTotalBlogs(total);
      setTotalPages(pages);
      setError(null);
      
    } catch (err) {
      setError('Unable to load blog posts. Please try again.');
      console.error('Error fetching blogs:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

    const blogListSEO = {
    title: 'Blog - Latest Articles & Insights | Omer Tools',
    description: 'Read our latest articles about tools, equipment, DIY projects, and industry insights. Expert tips and product reviews.',
    keywords: 'tool blog, DIY articles, equipment reviews, construction tips, power tools blog',
    ogType: 'website',
    ogTitle: 'Blog - Omer Tools',
    ogDescription: 'Latest articles about tools, equipment, and DIY projects',
  };

  const fetchSidebarData = async () => {
    try {
      // Fetch featured and recent blogs in parallel
      const [featured, recent] = await Promise.allSettled([
        blogService.getFeaturedBlogs(3),
        blogService.getRecentBlogs(5)
      ]);
      
      // Process featured blogs
      if (featured.status === 'fulfilled' && featured.value) {
        const processedFeatured = Array.isArray(featured.value) 
          ? featured.value.map(blog => ({
              ...blog,
              featuredImageUrl: getBlogImageUrl(blog)
            }))
          : [];
        setFeaturedBlogs(processedFeatured);
      }
      
      // Process recent blogs
      if (recent.status === 'fulfilled' && recent.value) {
        const processedRecent = Array.isArray(recent.value)
          ? recent.value.map(blog => ({
              ...blog,
              featuredImageUrl: getBlogImageUrl(blog)
            }))
          : [];
        setRecentBlogs(processedRecent);
      }
      
    } catch (err) {
      console.error('Error loading sidebar data:', err.response?.data || err.message);
      // Don't show error for sidebar - keep main content visible
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setCurrentPage(1);
      fetchBlogs(searchTerm);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }
      
      pages.push(1);
      if (start > 2) pages.push('...');
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Render loading state
  if (loading && currentPage === 1 && blogs.length === 0) {
    return (
      <div className="blog-page">
        <div className="blog-hero">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div className="mb-4">
                  <span className="badge hero-badge rounded-pill px-4 py-2 mb-3 d-inline-block">
                    <i className="bi bi-newspaper me-2"></i>Latest Insights
                  </span>
                  <h1 className="hero-title display-4 fw-bold mb-3">
                    Our <span className="text-white">Blog</span>
                  </h1>
                  <p className="lead mb-0 opacity-75">
                    Discover expert insights, industry trends, and valuable tips from our team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="blog-loading">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading Blog Posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
        <SEO {...blogListSEO} />
      {/* Hero Section */}
      <div className="blog-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="mb-4">
                <span className="badge hero-badge rounded-pill px-4 py-2 mb-3 d-inline-block">
                  <i className="bi bi-newspaper me-2"></i>Latest Insights
                </span>
                <h1 className="hero-title display-4 fw-bold mb-3">
                  Our <span className="text-white">Blog</span>
                </h1>
                <p className="lead mb-0 opacity-75">
                  Discover expert insights, industry trends, and valuable tips from our team.
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="search-box p-4 rounded-3">
                <h5 className="mb-3 fw-semibold text-dark">
                  <i className="bi bi-search me-2"></i>Search Articles
                </h5>
                <form onSubmit={handleSearchSubmit}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control border-end-0 py-3"
                      placeholder="Search blog posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-primary px-4" type="submit">
                      Search
                    </button>
                  </div>
                </form>
                <div className="mt-3">
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Press Enter to search or type to filter
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container blog-grid-container">
        {/* Error Alert */}
        {error && (
          <div className="blog-error mb-5">
            <div className="error-icon">
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>
            <div>
              <h2 className="error-title">Error Loading Content</h2>
              <p className="error-message">{error}</p>
            </div>
            <div className="error-actions">
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setError(null);
                  fetchBlogs();
                }}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>Retry
              </button>
            </div>
          </div>
        )}

        <div className="row g-4">
          {/* Main Blog Content */}
          <div className="col-lg-9">
            {/* Search Results Header */}
            {searchTerm && (
              <div className="search-results-header">
                <h3 className="search-results-title">
                  <i className="bi bi-search"></i>
                  Search Results
                </h3>
                <div className="search-results-count">
                  <span>
                    Found <span className="search-query">{totalBlogs}</span> posts for "{searchTerm}"
                  </span>
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleClearSearch}
                  >
                    <i className="bi bi-x-circle me-1"></i>Clear Search
                  </button>
                </div>
              </div>
            )}

            {/* Blog Grid */}
            {blogs.length > 0 ? (
              <>
                <div className="blog-grid">
                  {blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="blog-pagination">
                    <div className="pagination-info">
                      Page {currentPage} of {totalPages} • {blogs.length} posts per page
                    </div>
                    <nav className="pagination-nav" aria-label="Blog pagination">
                      <button
                        className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <i className="bi bi-chevron-left"></i>
                        <span className="d-none d-sm-inline">Previous</span>
                      </button>
                      
                      {getPaginationNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                          {page === '...' ? (
                            <span className="pagination-ellipsis">...</span>
                          ) : (
                            <button
                              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                      
                      <button
                        className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <span className="d-none d-sm-inline">Next</span>
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="blog-empty-state">
                <div className="empty-state-icon">
                  <i className="bi bi-newspaper"></i>
                </div>
                <h3 className="empty-state-title">No Blog Posts Found</h3>
                <p className="empty-state-description">
                  {searchTerm 
                    ? 'No articles match your search. Try different keywords.'
                    : 'Check back soon for new content!'
                  }
                </p>
                <div className="empty-state-actions">
                  {searchTerm && (
                    <button 
                      className="btn btn-primary"
                      onClick={handleClearSearch}
                    >
                      <i className="bi bi-arrow-left me-2"></i>View All Posts
                    </button>
                  )}
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => fetchBlogs()}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>Refresh
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="sticky-sidebar">
              <BlogSidebar featuredBlogs={featuredBlogs} recentBlogs={recentBlogs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;