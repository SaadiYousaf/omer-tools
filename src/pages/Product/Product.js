// Product.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useParams,Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchProductById,
  fetchAllProducts,
  selectAllProducts,
  selectCurrentProduct,
  selectProductsStatus,
  selectProductsError,
} from '../../store/productsSlice';
import { addItemToCart } from '../../store/cartSlice';
import { FaStar, FaRegStar, FaRegStarHalfStroke } from 'react-icons/fa6';
import { FaTruck, FaShieldAlt, FaHeart, FaShareAlt, FaChevronRight } from 'react-icons/fa';
import './Product.css';

// IMPORTANT: must match your API base used in the slice
const API_BASE = 'http://localhost:5117';

const Product = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);
  const currentProduct = useSelector(selectCurrentProduct); // full payload (product, brand, subcategory, category, images, variants)
  const allProducts = useSelector(selectAllProducts); // used to compute "Frequently Bought Together"

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [localStock, setLocalStock] = useState(0);
  const [expandedSpecs, setExpandedSpecs] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(false);

  // Fetch current product (full details)
  useEffect(() => {
    window.scrollTo(0, 0);
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [productId, dispatch]);

  // After we have the current product, fetch all products (for related)
  useEffect(() => {
    if (currentProduct) {
      dispatch(fetchAllProducts());
    }
  }, [currentProduct, dispatch]);

  // Normalize the full payload for easy access without changing your UI structure
  const prod = useMemo(() => {
    if (!currentProduct) return null;

    // Your API (full) returns an object like:
    // { product: {...}, brand: {...}, subcategory: {...}, category: {...}, images: [...], variants: [...] }
    // Safely normalize it so UI code remains straightforward.
    const p = currentProduct.product ?? currentProduct;

    // Images can come from parent arrays OR inside product.images (your full payload includes both)
    const images =
      (currentProduct.images && Array.isArray(currentProduct.images) && currentProduct.images.length > 0
        ? currentProduct.images
        : p.images) || [];

    const variants =
      (currentProduct.variants && Array.isArray(currentProduct.variants) && currentProduct.variants.length > 0
        ? currentProduct.variants
        : p.variants) || [];

    const brand = currentProduct.brand ?? null;
    const subcategory = currentProduct.subcategory ?? null;
    const category = currentProduct.category ?? null;

    return {
      ...p,
      images,
      variants,
      brand,
      subcategory,
      category,
    };
  }, [currentProduct]);

  // Keep stock local (for button disable and qty stepper)
  useEffect(() => {
    if (prod) {
      setLocalStock(prod.stockQuantity ?? 0);
    }
  }, [prod]);

  // Add to cart
  const handleAddToCart = () => {
    if (prod && localStock >= quantity) {
      const mainImage =
        (prod.images?.[selectedImage]?.imageUrl && toAbsoluteImage(prod.images[selectedImage].imageUrl)) ||
        (prod.images?.[0]?.imageUrl && toAbsoluteImage(prod.images[0].imageUrl)) ||
        '/images/default-product.jpg';

      dispatch(
        addItemToCart({
          id: prod.id,
          name: prod.name,
          price: prod.discountPrice || prod.price,
          image: mainImage,
          quantity,
        })
      );
      setLocalStock((s) => s - quantity);
      setQuantity(1);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= localStock) {
      setQuantity(newQuantity);
    }
  };

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="star full" />);
    }

    if (hasHalfStar) {
      stars.push(<FaRegStarHalfStroke key="half" className="star half" />);
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="star empty" />);
    }

    return stars;
  };

  // Helper: image URL normalization (API returns /uploads/xxx.jpg)
  const toAbsoluteImage = (url) => {
    if (!url) return '';
    // If url already absolute
    if (/^https?:\/\//i.test(url)) return url;
    // Normalize backslashes if any
    const clean = url.replace(/\\/g, '/');
    return `${API_BASE}${clean.startsWith('/') ? '' : '/'}${clean}`;
    // e.g. http://localhost:5117/uploads/abc.jpg
  };

  // Price helpers
  const hasDiscount =
    !!prod?.price &&
    prod?.discountPrice != null &&
    Number(prod.discountPrice) < Number(prod.price);

  const currentPrice = prod ? Number(prod.discountPrice || prod.price || 0) : 0;

  // Specifications: try to parse JSON from product.specifications; fallback to your mock
  const parsedSpecifications = useMemo(() => {
    if (!prod) return null;

    const val = prod.specifications;
    if (!val || typeof val === 'undefined' || val === '{}' || val === 'null') {
      return null;
    }

    if (typeof val === 'object' && val !== null) {
      return val; // already parsed
    }

    // if it's a string, attempt to parse
    if (typeof val === 'string') {
      try {
        const obj = JSON.parse(val);
        if (obj && typeof obj === 'object') return obj;
      } catch {
        // ignore parse error; we'll fall back to mock
      }
    }
    return null;
  }, [prod]);

  // Fallback mock specifications (your original design sample)
  const fallbackSpecifications = {
    Brand: 'DEWALT',
    Model: 'DCGG581P1GXE',
    Voltage: '18V',
    'Battery Type': 'XR Li-Ion',
    'Battery Capacity': '5.0Ah',
    'Grease Output': 'Up to 15g per minute',
    'Speed Settings': '2-Speed',
    'Max Pressure': '10,000 psi',
    'Hose Length': '1.2m',
    Weight: '3.2kg',
    Included: 'Grease gun, 2 batteries, charger, case',
  };

  const specifications = parsedSpecifications && Object.keys(parsedSpecifications).length > 0
    ? parsedSpecifications
    : fallbackSpecifications;

  // Build "Frequently Bought Together" from all products with same subcategoryId OR brandId
  const relatedProducts = useMemo(() => {
    if (!prod || !Array.isArray(allProducts) || allProducts.length === 0) return [];

    // allProducts in your store is returned from /api/products (plain product list, not full)
    // those items should have id, brandId, subcategoryId, images, price, etc. (based on your services)
    const byBrandOrSub = allProducts.filter(
      (p) =>
        p &&
        p.id !== prod.id &&
        (Number(p.brandId) === Number(prod.brandId) ||
          Number(p.subcategoryId) === Number(prod.subcategoryId))
    );

    // Choose first 4
    return byBrandOrSub.slice(0, 4);
  }, [allProducts, prod]);

  // Render states
  if (status === 'loading') {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  if (status === 'failed') {
    return <div className="error-message">{error || 'Failed to load product'}</div>;
  }
  if (!prod) {
    return <div className="product-not-found">Product not found</div>;
  }

  // Extract brand name if present
  const brandName =
    prod.brand?.name ||
    // If not in payload, try guessing from specifications fallback you provided
    'DEWALT';

  const imagesForGallery = Array.isArray(prod.images) ? prod.images : [];
  const mainImageSrc =
    toAbsoluteImage(imagesForGallery?.[selectedImage]?.imageUrl) ||
    'https://via.placeholder.com/600x600?text=Product+Image';

  return (
    <div className="product-page">
    <div className="breadcrumb">
      <Link to="/">Home</Link>
      <FaChevronRight className="chevron" />
      <Link to={`/category/${prod.category?.id}`}>{prod.category?.name || 'Category'}</Link>
      <FaChevronRight className="chevron" />
      <Link to={`/subcategory/${prod.subcategory?.id}`}>{prod.subcategory?.name || 'Subcategory'}</Link>
      <FaChevronRight className="chevron" />
      <span className="current">{prod.name}</span>
    </div>

    <div className="product-container">
      {/* Gallery */}
      <div className="gallery-container">
        <div className="thumbnail-strip">
          {imagesForGallery.map((img, index) => (
            <div 
              className={`thumbnail ${index === selectedImage ? 'active' : ''}`} 
              key={img.id ?? index}
              onClick={() => setSelectedImage(index)}
            >
              <img 
                src={toAbsoluteImage(img.imageUrl)} 
                alt={`Thumbnail ${index + 1}`}
              />
            </div>
          ))}
        </div>
        
        <div className="main-image-container">
          <div className="main-image">
            <img 
              src={mainImageSrc} 
              alt={prod.name}
              className="products-image"
            />
          </div>
          <div className="image-actions">
            <button className="action-btn">
              <FaHeart className="action-icon" />
              <span>Save to Wishlist</span>
            </button>
            <button className="action-btn">
              <FaShareAlt className="action-icon" />
              <span>Share Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="details-container">
        <div className="product-header">
          <div className="brand-tag">{brandName}</div>
          <h1 className="product-title">{prod.name}</h1>
          <div className="product-meta">
            <div className="rating-container">
              {renderRating(4.5)}
              <span className="rating-value">4.5 (12 reviews)</span>
            </div>
            <div className="sku-container">SKU: {prod.sku || `PRD-${prod.id}`}</div>
          </div>
        </div>

        <div className={`stock-status ${localStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
          <div className="stock-indicator"></div>
          <span>
            {localStock > 0 
              ? `${localStock} in stock - Ready to ship` 
              : 'Out of stock - Available for backorder'}
          </span>
        </div>

        <div className="pricing-container">
          <div className="price-display">
            <div className="current-price">${currentPrice.toFixed(2)}</div>
            {hasDiscount && (
              <div className="original-price">
                <span className="was">Was </span>
                <span className="price-value">${Number(prod.price).toFixed(2)}</span>
              </div>
            )}
          </div>
          {hasDiscount && (
            <div className="savings-badge">
              Save ${(Number(prod.price) - Number(prod.discountPrice)).toFixed(2)}
            </div>
          )}
        </div>

        <div className="promo-banner">
          <div className="promo-card">
            <FaTruck className="promo-icon" />
            <div className="promo-content">
              <div className="promo-title">Free Shipping</div>
              <div className="promo-desc">On orders over $99</div>
            </div>
          </div>
          <div className="promo-card">
            <FaShieldAlt className="promo-icon" />
            <div className="promo-content">
              <div className="promo-title">3-Year Warranty</div>
              <div className="promo-desc">Quality guaranteed</div>
            </div>
          </div>
        </div>

        <div className="actions-container">
          <div className="quantity-control">
            <div className="quantity-label">Quantity:</div>
            <div className="quantity-selector">
              <button 
                className="quantity-btn" 
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input 
                type="text" 
                className="quantity-input" 
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  handleQuantityChange(Math.min(val, localStock));
                }}
              />
              <button 
                className="quantity-btn" 
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= localStock}
              >
                +
              </button>
            </div>
          </div>

          <div className="action-buttons">
            <button 
              className="cart-btn"
              onClick={handleAddToCart}
              disabled={localStock <= 0}
            >
              ADD TO CART
            </button>
            <button className="buy-btn">BUY NOW</button>
          </div>
        </div>

        <div className="payment-options">
          <div className="payment-card">
            <div className="payment-logo">Afterpay</div>
            <div className="payment-price">${(currentPrice / 4).toFixed(2)}</div>
            <div className="payment-desc">4 interest-free payments</div>
          </div>
          <div className="payment-card">
            <div className="payment-logo">Zip Pay</div>
            <div className="payment-price">${(currentPrice / 10).toFixed(2)}/wk</div>
            <div className="payment-desc">Flexible payments</div>
          </div>
        </div>
      </div>
    </div>

    <div className="info-tabs">
      <div className="tab active">Description</div>
      <div className="tab">Specifications</div>
      <div className="tab">Reviews (12)</div>
      <div className="tab">Shipping & Returns</div>
    </div>

    <div className="content-container">
      <div className="description-section">
        <h3>Product Overview</h3>
        <div className={`description-content ${expandedDescription ? 'expanded' : ''}`}>
          {prod.description ? (
            <>
              {String(prod.description)
                .split(/\n+/)
                .map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
            </>
          ) : (
            <>
              <p>
                The DEWALT DCGG581P1GXE 18V 5.0Ah XR Li-Ion Cordless 2-Speed Grease Gun Combo
                Kit delivers professional-grade performance for demanding lubrication tasks. 
                Engineered with a high-performance motor, this grease gun provides up to 15g 
                of grease per minute at 10,000 psi.
              </p>
              <p>
                The innovative 2-speed selector allows you to switch between high-speed 
                application for efficiency and high-pressure mode for stubborn fittings. 
                The ergonomic design features a comfortable grip and balanced weight 
                distribution to minimize user fatigue during extended operation.
              </p>
            </>
          )}
        </div>
        <button 
          className="expand-btn"
          onClick={() => setExpandedDescription(!expandedDescription)}
        >
          {expandedDescription ? 'Show Less' : 'Read More'}
        </button>
      </div>

      <div className="specifications-section">
        <h3>Technical Specifications</h3>
        <div className="specs-grid">
          {Object.entries(specifications).map(([key, value]) => (
            <div className="spec-row" key={key}>
              <div className="spec-name">{key}</div>
              <div className="spec-value">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {relatedProducts.length > 0 && (
      <div className="related-section">
        <h2>Frequently Purchased Together</h2>
        <div className="related-grid">
          {relatedProducts.map(rp => {
            const rpImage = toAbsoluteImage(rp.images?.[0]?.imageUrl) || 
                            'https://via.placeholder.com/300x300?text=Product+Image';
            
            return (
              <div className="related-card" key={rp.id}>
                <Link to={`/product/${rp.id}`}>
                  <img src={rpImage} alt={rp.name} className="related-image" />
                </Link>
                <div className="related-info">
                  <Link to={`/product/${rp.id}`} className="related-name">{rp.name}</Link>
                  <div className="related-price">${Number(rp.discountPrice || rp.price).toFixed(2)}</div>
                  <button 
                    className="add-btn"
                    onClick={() => dispatch(addItemToCart({
                      id: rp.id,
                      name: rp.name,
                      price: rp.discountPrice || rp.price,
                      image: rpImage,
                      quantity: 1
                    }))}
                  >
                    + ADD
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
  );
};

export default Product;
