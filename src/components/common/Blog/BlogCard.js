// src/components/common/Blog/BlogCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { getBlogImageUrl } from '../../Utils/ImageHelper';
import './Blog.css'
import defaultimg from '../../../assets/images/default.jpg';

const BlogCard = ({ blog }) => {
  if (!blog) return null;
  
  // Get image URL using helper
  const imageUrl = getBlogImageUrl(blog);
  const title = blog.title || 'Untitled Blog';
  const shortDescription = blog.shortDescription || '';
  const readTime = blog.readTime ? `${blog.readTime} min read` : '';
  const blogSlug = blog.slug || blog.id;
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      return '';
    }
  };

  const blogDate = formatDate(blog.publishedAt || blog.createdAt);

  return (
    <Link to={`/blog/${blogSlug}`} className="blog-card-link">
      <article className="blog-card">
        {/* Image Container */}
        <div className="blog-card-image">
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            onError={(e) => {
              console.warn('Image failed to load:', imageUrl);
              e.target.src = defaultimg;
              e.target.onerror = null;
            }}
          />
          <div className="image-overlay"></div>
          
          {/* Featured Badge */}
          {blog.isFeatured && (
            <div className="blog-badge featured-badge">
              <i className="bi bi-star-fill me-1"></i>Featured
            </div>
          )}
          
          {/* View Count Badge */}
          {blog.viewCount > 0 && (
            <div className="blog-badge views-badge">
              <i className="bi bi-eye me-1"></i>
              {blog.viewCount}
            </div>
          )}
        </div>
        
        <div className="blog-card-content">
          {/* Title */}
          <h3 className="blog-card-title">
            {title}
          </h3>
          
          {/* Categories */}
          {blog.categories && blog.categories.length > 0 && (
            <div className="blog-card-categories" onClick={(e) => e.stopPropagation()}>
              {blog.categories.slice(0, 2).map((category) => (
                <Link 
                  key={category.id} 
                  to={`/blog/category/${category.id}`}
                  className="category-badge"
                  onClick={(e) => e.stopPropagation()}
                >
                  <i className="bi bi-folder me-1"></i>
                  {category.name}
                </Link>
              ))}
              {blog.categories.length > 2 && (
                <span className="category-badge">
                  +{blog.categories.length - 2}
                </span>
              )}
            </div>
          )}
          
          {/* Excerpt */}
          {shortDescription && (
            <p className="blog-card-excerpt">
              {shortDescription}
            </p>
          )}
          
          {/* Meta Info */}
          <div className="blog-card-meta">
            <div className="blog-card-date">
              <i className="bi bi-calendar meta-icon"></i>
              <span>{blogDate}</span>
            </div>
            
            {blog.author && (
              <div className="blog-card-author">
                <i className="bi bi-person meta-icon"></i>
                <span>{blog.author}</span>
              </div>
            )}
          </div>
          
          {/* Read Time */}
          {readTime && (
            <div className="read-time">
              <i className="bi bi-clock"></i>
              <span>{readTime}</span>
            </div>
          )}
          
          {/* Read More Button (now decorative only) */}
          <div className="read-more-btn">
            Read Article
            <i className="bi bi-arrow-right"></i>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;