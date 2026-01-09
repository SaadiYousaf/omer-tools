import React, { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({
  // Your existing parameters (backward compatible)
  title = '',
  description = '',
  keywords = '',
  slug = '', // Your existing parameter
  ogTitle = '',
  ogDescription = '',
  ogUrl = '',
  structuredData = '',
  noindex = false,
  nofollow = false,
  
  // New parameters (optional)
  ogImage = '',
  ogType = 'website',
  ogSiteName = 'Omer Tools',
  twitterCard = 'summary_large_image',
  twitterTitle = '',
  twitterDescription = '',
  twitterImage = '',
  twitterSite = '@omertools',
  twitterCreator = '@omertools',
  author = '',
  publishedTime = '',
  modifiedTime = '',
  section = '',
  tags = '',
  canonical = '' // New parameter
}) => {
  const location = useLocation();
  const baseUrl = process.env.REACT_APP_BASE_URL || 
    (typeof window !== 'undefined' ? window.location.origin : '');
  
  // Use useLayoutEffect for immediate execution
  useLayoutEffect(() => {
    // Determine final values (maintaining your existing logic)
    const metaTitle = title || ogTitle || 'Omer tools';
    const metaDescription = description || ogDescription || 'Discover amazing products at great prices';
    const metaKeywords = keywords || 'shop, products, deals, online store';
    const metaOgTitle = ogTitle || metaTitle;
    const metaOgDescription = ogDescription || metaDescription;
    const metaslug = slug || ogUrl || (typeof window !== 'undefined' ? window.location.href : '');
    const finalCanonical = canonical || metaslug;
    const siteVerification = 'GpiiEykGsHnDUq0g11xRmXXK9rHVIANbQMUL77z7sGM';

    // Robots meta
    const robotsMeta = [];
    if (noindex) robotsMeta.push('noindex');
    if (nofollow) robotsMeta.push('nofollow');
    const robotsContent = robotsMeta.length > 0 ? robotsMeta.join(', ') : 'index, follow';

    // Update document title
    document.title = metaTitle;

    // Helper function to safely update/create meta tags
    const updateMetaTag = (name, content, property = null) => {
      try {
        let selector = property ? `[property="${property}"]` : `[name="${name}"]`;
        let element = document.querySelector(`meta${selector}`);
        
        if (!element) {
          element = document.createElement('meta');
          if (property) {
            element.setAttribute('property', property);
          } else {
            element.setAttribute('name', name);
          }
          document.head.appendChild(element);
        }
        
        element.setAttribute('content', content || '');
        return element;
      } catch (error) {
        console.warn('Error updating meta tag:', error);
        return null;
      }
    };

    // 1. Update canonical link (maintaining your slug logic)
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', finalCanonical);
    
    // Also maintain your existing slug link for backward compatibility
    let slugLink = document.querySelector('link[rel="slug"]');
    if (!slugLink) {
      slugLink = document.createElement('link');
      slugLink.setAttribute('rel', 'slug');
      document.head.appendChild(slugLink);
    }
    slugLink.setAttribute('href', metaslug);


    
    // Basic meta tags
    updateMetaTag('description', metaDescription);
    updateMetaTag('keywords', metaKeywords);
    updateMetaTag('robots', robotsContent);
    updateMetaTag('google-site-verification', siteVerification);
    
    // Your existing Open Graph tags (will fix property names below)
    updateMetaTag(null, metaOgTitle, 'title'); // Will be duplicated with correct og:title
    updateMetaTag('schema', metaOgDescription); // Your custom schema tag
    updateMetaTag(null, metaslug, 'url'); // Will be duplicated with correct og:url
    updateMetaTag(null, 'website', 'type'); // Will be duplicated with correct og:type
    updateMetaTag(null, 'Omer tools', 'site_name'); // Will be duplicated with correct og:site_name
    
    // ======================
    // NEW: CORRECT OPEN GRAPH TAGS (for social media)
    // These will work alongside your existing ones
    // ======================
    
    // Determine image for Open Graph
    const finalOgImage = ogImage || `${baseUrl}/images/default-og.jpg`;
    
    // Correct Open Graph tags (these will actually work for Facebook/Twitter)
    updateMetaTag(null, metaOgTitle, 'og:title');
    updateMetaTag(null, metaOgDescription, 'og:description');
    updateMetaTag(null, finalOgImage, 'og:image');
    updateMetaTag(null, metaslug, 'og:url');
    updateMetaTag(null, ogType, 'og:type');
    updateMetaTag(null, ogSiteName, 'og:site_name');
    updateMetaTag(null, 'en_US', 'og:locale');
    
    // Article-specific OG tags
    if (ogType === 'article' || publishedTime) {
      if (author) updateMetaTag(null, author, 'article:author');
      if (publishedTime) updateMetaTag(null, new Date(publishedTime).toISOString(), 'article:published_time');
      if (modifiedTime) updateMetaTag(null, new Date(modifiedTime).toISOString(), 'article:modified_time');
      if (section) updateMetaTag(null, section, 'article:section');
      if (tags) updateMetaTag(null, tags, 'article:tag');
    }
    
    // ======================
    // TWITTER CARDS
    // ======================
    const finalTwitterTitle = twitterTitle || metaOgTitle;
    const finalTwitterDescription = twitterDescription || metaOgDescription;
    const finalTwitterImage = twitterImage || finalOgImage;
    
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:title', finalTwitterTitle);
    updateMetaTag('twitter:description', finalTwitterDescription);
    updateMetaTag('twitter:image', finalTwitterImage);
    updateMetaTag('twitter:site', twitterSite);
    updateMetaTag('twitter:creator', twitterCreator);
    
    // ======================
    // ADDITIONAL META TAGS
    // ======================
    if (author) updateMetaTag('author', author);
    if (publishedTime) updateMetaTag('publication_date', publishedTime);
    
    // ======================
    // STRUCTURED DATA
    // ======================
    let structuredScript = document.querySelector('script[type="application/ld+json"]');
    if (structuredScript) {
      structuredScript.remove();
    }
    
    if (structuredData) {
      try {
        structuredScript = document.createElement('script');
        structuredScript.setAttribute('type', 'application/ld+json');
        structuredScript.textContent = typeof structuredData === 'string' 
          ? structuredData 
          : JSON.stringify(structuredData);
        document.head.appendChild(structuredScript);
      } catch (error) {
        console.warn('Error adding structured data:', error);
      }
    }
    
    // ======================
    // VIEWPORT (good practice)
    // ======================
    let viewportTag = document.querySelector('meta[name="viewport"]');
    if (!viewportTag) {
      viewportTag = document.createElement('meta');
      viewportTag.setAttribute('name', 'viewport');
      viewportTag.setAttribute('content', 'width=device-width, initial-scale=1.0');
      document.head.appendChild(viewportTag);
    }
    
    // Cleanup is not needed as tags will be overwritten on next page
    
  }, [
    // Dependencies
    title, description, keywords, slug, ogTitle, ogDescription, ogUrl,
    structuredData, noindex, nofollow, canonical,
    ogImage, ogType, ogSiteName, twitterCard, twitterTitle, twitterDescription,
    twitterImage, twitterSite, twitterCreator, author, publishedTime,
    modifiedTime, section, tags, baseUrl, location.pathname
  ]);
  
  return null; // Component doesn't render anything
};

export default SEO;