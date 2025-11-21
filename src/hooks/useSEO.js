// src/hooks/useSEO.js (same as before)
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useSEO = (pageType, specificData = {}) => {
  const [seoData, setSeoData] = useState({});
  const location = useLocation();

  useEffect(() => {
    const baseUrl = process.env.REACT_APP_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const currentUrl = `${baseUrl}${location.pathname}`;

    switch (pageType) {
      case 'home':
        setSeoData({
          title: 'Omer Tools - Premium Tools & Equipment',
          description: 'Discover premium power tools, hand tools, and equipment from top brands. Best prices, free shipping, and expert service.',
          keywords: 'power tools, hand tools, equipment, construction tools, professional tools, shop online',
          canonical: baseUrl,
          ogTitle: 'OmerTools - Premium Tools & Equipment',
          ogDescription: 'Discover premium power tools, hand tools, and equipment from top brands.',
          ogImage: `${baseUrl}/images/og-home.jpg`,
          ogUrl: baseUrl,
          structuredData: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "OmerTools",
            "url": baseUrl,
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${baseUrl}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })
        });
        break;

      case 'product':
        const { product, brand, category, images } = specificData;
        if (product) {
          const primaryImage = images?.find(img => img.isPrimary) || images?.[0];
          const imageUrl = primaryImage?.imageUrl || '/images/default-product.jpg';
          const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;
          
          const productStructuredData = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.metaDescription || product.description,
            "image": fullImageUrl,
            "sku": product.sku,
            "brand": {
              "@type": "Brand",
              "name": brand?.name || "Unknown Brand"
            },
            "offers": {
              "@type": "Offer",
              "url": currentUrl,
              "priceCurrency": "Aud",
              "price": product.discountPrice || product.price,
              "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              "availability": product.stockQuantity > 0 ? 
                "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "itemCondition": "https://schema.org/NewCondition"
            }
          };

          setSeoData({
            title: product.metaTitle || `${product.name} - ${brand?.name} | Omer tools`,
            description: product.metaDescription || 
              `${product.name}. ${product.tagLine || product.description.substring(0, 150)}...`,
            keywords: product.metaKeywords || 
              `${product.name}, ${brand?.name}, ${category?.name}, buy, shop, price`,
            canonical: product.canonicalUrl || currentUrl,
            ogTitle: product.ogTitle || product.metaTitle || product.name,
            ogDescription: product.ogDescription || product.metaDescription || product.description,
            ogImage: product.ogImage || fullImageUrl,
            ogUrl: currentUrl,
            structuredData: JSON.stringify(productStructuredData)
          });
        }
        break;

      default:
        setSeoData({
          title: 'Omertools- Premium Tools & Equipment',
          description: 'Discover premium power tools, hand tools, and equipment from top brands.',
          canonical: currentUrl
        });
    }
  }, [pageType, specificData, location.pathname]);

  return seoData;
};

export const useProductSEO = (productId) => {
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSEOData = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/products/full/${productId}/seo`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch SEO data');
        }
        
        const data = await response.json();
        setSeoData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching SEO data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSEOData();
  }, [productId]);

  return { seoData, loading, error };
};