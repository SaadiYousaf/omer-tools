import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setBrandsLoading,
  setBrandsSuccess,
  setBrandsFailed,
} from "../../store/brandsSlice";
import useApi from "../../api/useApi";
import BrandCard from "../../components/common/BrandSlider/BrandCard/BrandCard";
import ProductGrid from "../../components/common/ProductGrid/ProductGrid";
import BrandFilter from "../../components/common/BrandSlider/BrandFilter/BrandFilter";
import Loading from "../../components/common/Loading/Loading";
import "./ShopByBrand.css";

const BASE_IMG_URL = process.env.REACT_APP_BASE_IMG_URL;

const ShopByBrand = () => {
  const dispatch = useDispatch();
  const { get } = useApi();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  // Get brands from Redux store
  const { brands, status, error } = useSelector((state) => state.brands);

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);

  // Desired brand UUID order
  const customOrder = [
    "fe9ca5ed-6447-419a-a812-7805091b5341",
    "8401991c-6e62-4605-a488-8948adc120b7",
    "d303d79b-e3f3-443f-a052-1bc9bfc4a660",
    "2f35bdc1-481c-448f-abff-d3449a7431ef",
    "38ac4eb0-4b95-49ed-80db-2bed180bb4b1",
    "ef97e746-0a93-4bfb-a1b1-db9aa5caaada",
    "77ba46cd-5921-4bd9-b858-35cd2b6b11dc",
    "b15b2e62-c24f-489a-a215-b7bff7b5a646",
    "2bc76e96-4934-4c1b-8adf-8956b96b2491",
  ];

  // Get brand image
  const getBrandImage = (brand) => {
    if (brand.images && brand.images.length > 0) {
      const primaryImage =
        brand.images.find((img) => img.isPrimary) || brand.images[0];
      return BASE_IMG_URL + primaryImage.imageUrl;
    }

    if (brand.imageUrl) return brand.imageUrl;
    return "/images/categories/default.png";
  };

  // Fetch brands
  const fetchBrands = useCallback(async () => {
    dispatch(setBrandsLoading());
    try {
      const data = await get(`${BASE_URL}/brands?includeImages=true`);
      dispatch(setBrandsSuccess(data));
    } catch (err) {
      dispatch(setBrandsFailed(err.message));
    }
  }, [dispatch, get, BASE_URL]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      setProductsError(null);

      const response = await fetch(
        `${BASE_URL}/products?featured=true&limit=12`
      );

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setProductsError("Failed to load products. Please try again later.");
      console.error("Error fetching products:", err);
    } finally {
      setProductsLoading(false);
    }
  }, [BASE_URL]);

  // Load data on mount
  useEffect(() => {
    if (status === "idle") {
      fetchBrands();
    }
    fetchProducts();
  }, [status, fetchBrands, fetchProducts]);

  // Display brands in custom order
  const displayedBrands = useMemo(() => {
    const brandMap = new Map();
    brands.forEach((b) => {
      brandMap.set(b.id, b);
    });

    return customOrder
      .map((id) => brandMap.get(id))
      .filter(Boolean)
      .slice(0, 6);
  }, [brands, customOrder]);

  const isLoading = status === "loading" || productsLoading;
  const hasError = error || productsError;

  if (hasError) {
    return (
      <div className="shop-by-brand-container">
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <h2>{hasError}</h2>
          <button
            className="retry-button"
            onClick={() => {
              if (error) fetchBrands();
              if (productsError) fetchProducts();
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-by-brand-container">
      <div className="brands-header">
        <div className="header-gradient">
          <h1>Shop by Brand</h1>
          <p>
            Discover premium products from our curated collection of trusted
            brands
          </p>
        </div>
      </div>

      <div className="content-wrapper">
        {/* Top Brands Section */}
        <section className="top-brands-section">
          <div className="section-header">
            <h2>Top Brands</h2>
            <div className="header-divider"></div>
          </div>
          {isLoading ? (
            <div className="loading-container">
              <Loading size="medium" variant="spinner" color="primary" />
            </div>
          ) : (
            <div className="brands-grid">
              {displayedBrands.map((brand) => {
                const imageUrl = getBrandImage(brand);
                console.log("Brand:", brand.name, "Image URL:", imageUrl); // For debugging

                return (
                  <BrandCard
                    key={brand.id}
                    brand={{
                      ...brand,
                      imageUrl: imageUrl,
                    }}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Brand Filter */}
        <section className="brand-filter-section">
          <div className="section-header">
            <h2>All Brands</h2>
            <div className="header-divider"></div>
          </div>
          <BrandFilter
            brands={brands.map((brand) => ({
              ...brand,
              imageUrl: getBrandImage(brand),
            }))}
          />
        </section>

        {/* Products Section */}
        <section className="products-section">
          <div className="section-header">
            <h2>Featured Products</h2>
            <div className="header-divider"></div>
          </div>

          {isLoading ? (
            <div className="loading-container">
              <Loading size="medium" variant="spinner" color="primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="no-products">
              <div className="empty-state-icon">📦</div>
              <h3>No products available</h3>
              <p>We couldn't find any featured products at the moment.</p>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </section>
      </div>
    </div>
  );
};

export default ShopByBrand;
