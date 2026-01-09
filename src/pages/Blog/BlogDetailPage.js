// src/pages/Blog/BlogDetailPage.js - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import blogService from '../../services/blogService';
import BlogSidebar from '../../components/common/Blog/BlogSidebar';
import SEO from '../../components/common/SEO/SEO';
import { getBlogImageUrl,getAllBlogImages } from '../../components/Utils/ImageHelper';
import './BlogDetailPage.css';
import defaultimg from '../../assets/images/default.jpg'

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);

  useEffect(() => {
    if (slug) {
      fetchBlogBySlug();
    }
  }, [slug]);

  const fetchBlogBySlug = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch blog data by slug
      const blogData = await blogService.getBlogBySlug(slug);
      
      // Extract blog object from response
      let blogObject;
      if (blogData.blog) {
        blogObject = blogData.blog;
      } else if (blogData.data) {
        blogObject = blogData.data;
      } else {
        blogObject = blogData;
      }
      
      if (!blogObject) {
        throw new Error('Blog data not found in response');
      }
      
      // Get all images for gallery
      const images = getAllBlogImages(blogObject);
      
      // Get featured image URL
      blogObject.featuredImageUrl = getBlogImageUrl(blogObject);
      
      setBlog(blogObject);
      
      // Fetch sidebar data in parallel
      const [featured, recent, popular] = await Promise.all([
        blogService.getFeaturedBlogs(3),
        blogService.getRecentBlogs(5),
        blogService.getPopularBlogs(3)
      ]);
      
      // Process sidebar images
      const processBlogs = (blogs) => {
        if (!Array.isArray(blogs)) return [];
        return blogs.map(b => ({
          ...b,
          featuredImageUrl: getBlogImageUrl(b)
        }));
      };
      
      setFeaturedBlogs(processBlogs(featured) || []);
      setRecentBlogs(processBlogs(recent) || []);
      
      // Filter related blogs
      const filteredPopular = Array.isArray(popular) 
        ? processBlogs(popular).filter(b => b.id !== blogObject.id).slice(0, 3)
        : [];
      setRelatedBlogs(filteredPopular);
      
      // Increment view count
      if (blogObject.id) {
        try {
          await blogService.incrementViewCount(blogObject.id);
        } catch (viewError) {
          console.warn('Failed to increment view count:', viewError);
        }
      }
      
    } catch (err) {
      console.error('Error fetching blog:', err.response || err);
      
      if (err.response?.status === 404) {
        setError('Blog post not found or has been removed.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to load blog post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate structured data for SEO
  const generateStructuredData = (blogData) => {
    if (!blogData) return null;
    
    const baseUrl = process.env.REACT_APP_BASE_URL || window.location.origin;
    
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blogData.metaTitle || blogData.title,
      "description": blogData.metaDescription || blogData.shortDescription || blogData.description,
      "image": blogData.featuredImageUrl,
      "author": {
        "@type": "Person",
        "name": blogData.author || "Omer Tools"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Omer Tools",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`
        }
      },
      "datePublished": blogData.publishedAt || blogData.createdAt,
      "dateModified": blogData.updatedAt || blogData.publishedAt || blogData.createdAt,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${baseUrl}/blog/${blogData.slug}`
      },
      "articleSection": blogData.categories?.[0]?.name || "Tools & Equipment",
      "keywords": blogData.metaKeywords || blogData.tags?.map(t => t.name).join(', ') || ''
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Helper to render HTML content safely
  const renderHTML = (html) => {
    return { __html: html || '' };
  };

  if (loading) {
    return (
      <div className="blog-detail-loading">
        <div className="container">
          <div className="text-center py-5">
            <div className="loading-spinner"></div>
            <p className="loading-text mt-3">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="blog-error-container">
        <div className="container">
          <div className="text-center py-5">
            <div className="error-icon">
              <i className="bi bi-exclamation-triangle"></i>
            </div>
            <h2>Blog Post Not Found</h2>
            <p className="mb-4">{error || 'The blog post you are looking for does not exist.'}</p>
            <div className="error-actions">
              <button onClick={() => navigate(-1)} className="btn btn-outline-secondary">
                <i className="bi bi-arrow-left me-1"></i> Go Back
              </button>
              <Link to="/blog" className="btn btn-primary">
                <i className="bi bi-newspaper me-1"></i> Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generate structured data for current blog
  const structuredData = generateStructuredData(blog);
  const baseUrl = process.env.REACT_APP_BASE_URL || window.location.origin;

  return (
    <>
      {/* SEO Component */}
      <SEO
        // Basic Meta
        title={blog.metaTitle || blog.title}
        description={blog.metaDescription || blog.shortDescription || blog.description}
        keywords={blog.metaKeywords || blog.tags?.map(t => t.name).join(', ') || ''}
        canonical={blog.canonicalUrl || `${baseUrl}/blog/${blog.slug}`}
        
        // Open Graph
        ogTitle={blog.ogTitle || blog.metaTitle || blog.title}
        ogDescription={blog.ogDescription || blog.metaDescription || blog.shortDescription || blog.description}
        ogImage={blog.ogImage || blog.featuredImageUrl}
        ogUrl={`${baseUrl}/blog/${blog.slug}`}
        ogType="article"
        ogSiteName="Omer Tools"
        
        // Twitter
        twitterCard="summary_large_image"
        twitterTitle={blog.ogTitle || blog.metaTitle || blog.title}
        twitterDescription={blog.ogDescription || blog.metaDescription || blog.shortDescription || blog.description}
        twitterImage={blog.ogImage || blog.featuredImageUrl}
        twitterSite="@omertools"
        twitterCreator="@omertools"
        
        // Article Info
        author={blog.author}
        publishedTime={blog.publishedAt || blog.createdAt}
        modifiedTime={blog.updatedAt || blog.publishedAt || blog.createdAt}
        section={blog.categories?.[0]?.name || "Tools & Equipment"}
        tags={blog.tags?.map(t => t.name).join(', ')}
        
        // Structured Data
        structuredData={JSON.stringify(structuredData)}
        
        // Backward compatible parameters
        slug={`/blog/${blog.slug}`}
      />
      
      {/* Blog Content */}
      <div className="blog-detail-page">
        {/* Featured Image at the TOP */}
        {blog.featuredImageUrl && (
          <div className="blog-featured-image">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12">
                  <div className="featured-image-container">
                    <img
                      src={blog.featuredImageUrl}
                      alt={blog.title}
                      className="img-fluid rounded-3"
                      onError={(e) => {
                        e.target.src = defaultimg;
                        e.target.onerror = null;
                      }}
                    />
                    {blog.featuredImageCaption && (
                      <figcaption className="featured-image-caption text-center mt-3">
                        {blog.featuredImageCaption}
                      </figcaption>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="container">
          <div className="row">
            {/* Main Content */}
            <div className="col-lg-9">
              {/* Breadcrumb */}
              <nav aria-label="breadcrumb" className="breadcrumb-nav">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/blog">Blog</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {blog.title}
                  </li>
                </ol>
              </nav>

              {/* Blog Header - UNDER the image */}
              <article className="blog-detail-content">
                <header className="blog-header">
                  <h1 className="blog-title">{blog.title}</h1>
                  
                  {/* Short Description IMMEDIATELY after title */}
                  {blog.shortDescription && (
                    <div className="blog-short-description lead">
                      {blog.shortDescription}
                    </div>
                  )}
                  
                  {/* Meta Information */}
                  <div className="blog-meta">
                    {blog.author && (
                      <div className="author-info">
                        <i className="bi bi-person-circle"></i>
                        <span className="author-name">{blog.author}</span>
                      </div>
                    )}
                    
                    <div className="date-info">
                      <i className="bi bi-calendar"></i>
                      <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                    </div>
                    
                    {blog.viewCount !== undefined && (
                      <div className="views-info">
                        <i className="bi bi-eye"></i>
                        <span>{blog.viewCount || 0} views</span>
                      </div>
                    )}
                    
                    {blog.readTime && (
                      <div className="readtime-info">
                        <i className="bi bi-clock"></i>
                        <span>{blog.readTime} min read</span>
                      </div>
                    )}
                  </div>
                </header>

                {/* Main Content */}
                <div className="blog-main-content">
                  <div
                    className="content blog-content"
                    dangerouslySetInnerHTML={renderHTML(blog.content || blog.description)}
                  />
                </div>

                {/* Categories and Tags */}
                <div className="blog-taxonomies">
                  <div className="row">
                    {(blog.categories && blog.categories.length > 0) && (
                      <div className="col-md-6 mb-4">
                        <h5 className="taxonomy-title">
                          <i className="bi bi-folder me-2"></i> Categories
                        </h5>
                        <div className="taxonomy-items">
                          {blog.categories.map((category) => (
                            <Link 
                              key={category.id} 
                              to={`/blog/category/${category.id}`}
                              className="taxonomy-badge category-badge"
                            >
                              {category.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {(blog.tags && blog.tags.length > 0) && (
                      <div className="col-md-6 mb-4">
                        <h5 className="taxonomy-title">
                          <i className="bi bi-tags me-2"></i> Tags
                        </h5>
                        <div className="taxonomy-items">
                          {blog.tags.map((tag) => (
                            <Link 
                              key={tag.id} 
                              to={`/blog/tag/${tag.id}`}
                              className="taxonomy-badge tag-badge"
                            >
                              #{tag.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="share-section">
                  <h5 className="share-title">
                    <i className="bi bi-share me-2"></i> Share this post
                  </h5>
                  <div className="share-buttons">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn facebook"
                    >
                      <i className="bi bi-facebook"></i> Facebook
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn twitter"
                    >
                      <i className="bi bi-twitter"></i> Twitter
                    </a>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(blog.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn linkedin"
                    >
                      <i className="bi bi-linkedin"></i> LinkedIn
                    </a>
                    <a
                      href={`mailto:?subject=${encodeURIComponent(blog.title)}&body=${encodeURIComponent(`Check out this blog post: ${window.location.href}`)}`}
                      className="share-btn email"
                    >
                      <i className="bi bi-envelope"></i> Email
                    </a>
                  </div>
                </div>

                {/* Related Posts */}
                {relatedBlogs.length > 0 && (
                  <div className="related-posts">
                    <h3 className="related-title">
                      <i className="bi bi-newspaper me-2"></i> You Might Also Like
                    </h3>
                    <div className="related-grid">
                      {relatedBlogs.map((relatedBlog) => (
                        <div key={relatedBlog.id} className="related-post">
                          <div className="related-post-image">
                            <img
                              src={relatedBlog.featuredImageUrl}
                              alt={relatedBlog.title}
                              onError={(e) => {
                                e.target.src = defaultimg;
                                e.target.onerror = null;
                              }}
                            />
                          </div>
                          <div className="related-post-content">
                            <h5 className="related-post-title">
                              <Link to={`/blog/${relatedBlog.slug}`}>
                                {relatedBlog.title}
                              </Link>
                            </h5>
                            <div className="related-post-date">
                              {formatDate(relatedBlog.publishedAt || relatedBlog.createdAt)}
                            </div>
                            <Link 
                              to={`/blog/${relatedBlog.slug}`}
                              className="related-read-more"
                            >
                              Read More <i className="bi bi-arrow-right"></i>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="blog-navigation">
                  <button onClick={() => navigate(-1)} className="nav-btn back-btn">
                    <i className="bi bi-arrow-left me-2"></i> Go Back
                  </button>
                  <Link to="/blog" className="nav-btn all-posts-btn">
                    <i className="bi bi-newspaper me-2"></i> All Blog Posts
                  </Link>
                </div>
              </article>
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
    </>
  );
};

export default BlogDetailPage;