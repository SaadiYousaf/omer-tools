// src/components/common/Blog/BlogSidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';
import defaultimg from '../../../assets/images/default.jpg'

const BlogSidebar = ({ featuredBlogs = [], recentBlogs = [] }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const options = { month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      return '';
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    console.log('Subscribing email:', email);
    // Add your newsletter API call here
    e.target.reset();
  };

  return (
    <div className="blog-sidebar">
      {/* Featured Posts */}
      {featuredBlogs.length > 0 && (
        <div className="sidebar-widget">
          <h4 className="widget-title">
            <i className="bi bi-star-fill widget-icon"></i>
            Featured Posts
          </h4>
          <div className="featured-posts">
            {featuredBlogs.map((blog) => (
              <div key={blog.id} className="featured-post">
                <div className="featured-post-image">
                  <Link to={`/blog/${blog.slug}`}>
                    <img
                      src={blog.featuredImageUrl || defaultimg}
                      alt={blog.title}
                      onError={(e) => {
                        e.target.src = defaultimg;
                        e.target.onerror = null;
                      }}
                    />
                  </Link>
                </div>
                <div className="featured-post-content">
                  <h6 className="featured-post-title">
                    <Link to={`/blog/${blog.slug}`}>
                      {blog.title}
                    </Link>
                  </h6>
                  <div className="featured-post-date">
                    {formatDate(blog.publishedAt || blog.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Posts */}
      {recentBlogs.length > 0 && (
        <div className="sidebar-widget">
          <h4 className="widget-title">
            <i className="bi bi-clock widget-icon"></i>
            Recent Posts
          </h4>
          <div className="recent-posts">
            {recentBlogs.map((blog) => (
              <div key={blog.id} className="recent-post">
                <div className="recent-post-image">
                  <img
                    src={blog.featuredImageUrl || defaultimg}
                    alt={blog.title}
                    onError={(e) => {
                      e.target.src = defaultimg;
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <div className="recent-post-content">
                  <h6 className="recent-post-title">
                    <Link to={`/blog/${blog.slug}`}>
                      {blog.title}
                    </Link>
                  </h6>
                  <div className="recent-post-date">
                    {formatDate(blog.publishedAt || blog.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="sidebar-widget">
        <h4 className="widget-title">
          <i className="bi bi-envelope widget-icon"></i>
          Stay Updated
        </h4>
        <p className="small text-muted mb-3">
          Subscribe to our newsletter for the latest blog posts and updates.
        </p>
        <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
          <div className="newsletter-input-group d-flex">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Your email address"
              required
            />
            <button className="btn" type="submit">
              Subscribe
            </button>
          </div>
        </form>
      </div>

      {/* Categories */}
      <div className="sidebar-widget">
        <h4 className="widget-title">
          <i className="bi bi-folder widget-icon"></i>
          Blog Categories
        </h4>
        <div className="categories-list">
          <div className="category-item">
            <Link to="/blog?category=tools" className="category-link">
              <i className="bi bi-tools category-icon"></i>
              <span>Tools & Equipment</span>
            </Link>
            <span className="category-count">12</span>
          </div>
          <div className="category-item">
            <Link to="/blog?category=diy" className="category-link">
              <i className="bi bi-hammer category-icon"></i>
              <span>DIY Projects</span>
            </Link>
            <span className="category-count">8</span>
          </div>
          <div className="category-item">
            <Link to="/blog?category=tips" className="category-link">
              <i className="bi bi-lightbulb category-icon"></i>
              <span>Tips & Tricks</span>
            </Link>
            <span className="category-count">15</span>
          </div>
          <div className="category-item">
            <Link to="/blog?category=reviews" className="category-link">
              <i className="bi bi-star category-icon"></i>
              <span>Product Reviews</span>
            </Link>
            <span className="category-count">6</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;