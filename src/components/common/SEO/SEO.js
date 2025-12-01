import React from 'react';

const SEO = ({
  title = '',
  description = '',
  keywords = '',
  slug = '',
  ogTitle = '',
  ogDescription = '',
  ogUrl = '',
  structuredData = '',
  noindex = false,
  nofollow = false
}) => {
  // Use fallbacks if specific values aren't provided
  const metaTitle = title || ogTitle || 'Omer tools';
  const metaDescription = description || ogDescription || 'Discover amazing products at great prices';
  const metaKeywords = keywords || 'shop, products, deals, online store';
  const metaOgTitle = ogTitle || metaTitle;
  const metaOgDescription = ogDescription || metaDescription;
  const metaslug = slug || ogUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const siteVerification = 'GpiiEykGsHnDUq0g11xRmXXK9rHVIANbQMUL77z7sGM';

  const robotsMeta = [];
  if (noindex) robotsMeta.push('noindex');
  if (nofollow) robotsMeta.push('nofollow');
  const robotsContent = robotsMeta.length > 0 ? robotsMeta.join(', ') : 'index, follow';

  React.useEffect(() => {
    // Use setTimeout to ensure this runs after React Router
    const timer = setTimeout(() => {
      // Update title
      document.title = metaTitle;

      // Find the first element in head (to insert before it)
      const firstElement = document.head.firstChild;

      // Helper to create and insert meta tags at top
      const createOrUpdateMetaTag = (name, content, property = null) => {
        let meta = document.querySelector(property ? `meta[property="${property}"]` : `meta[name="${name}"]`);
        
        if (!meta) {
          meta = document.createElement('meta');
          if (property) {
            meta.setAttribute('property', property);
          } else {
            meta.setAttribute('name', name);
          }
          // Insert at top (before first element)
          document.head.insertBefore(meta, firstElement);
        }
        
        meta.setAttribute('content', content);
        return meta;
      };

      // Update slug link at top
      let slugLink = document.querySelector('link[rel="slug"]');
      if (!slugLink) {
        slugLink = document.createElement('link');
        slugLink.setAttribute('rel', 'slug');
        document.head.insertBefore(slugLink, firstElement);
      }
      slugLink.setAttribute('href', metaslug);

      //all meta tags 
      const metaTags = [
        // Basic meta tags
        createOrUpdateMetaTag('description', metaDescription),
        createOrUpdateMetaTag('keywords', metaKeywords),
        createOrUpdateMetaTag('robots', robotsContent),
        createOrUpdateMetaTag('google-site-verification', siteVerification),

        // Open Graph tags
        createOrUpdateMetaTag('', metaOgTitle, 'title'),
        createOrUpdateMetaTag('schema', metaOgDescription),
        createOrUpdateMetaTag('', metaslug, 'url'),
        createOrUpdateMetaTag('', 'website', 'type'),
        createOrUpdateMetaTag('', 'Omer tools', 'site_name'),
      ];

      // Add structured data at top as well
      if (structuredData) {
        let script = document.querySelector('script[type="application/ld+json"]');
        if (script) {
          script.remove(); // Remove existing
        }
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.textContent = structuredData;
        document.head.insertBefore(script, firstElement);
      }

    }, 0);

    return () => clearTimeout(timer);
  }, [
    metaTitle, metaDescription, metaKeywords, robotsContent, metaslug,
    metaOgTitle, metaOgDescription, structuredData,siteVerification
  ]);

  return null;
};

export default SEO;