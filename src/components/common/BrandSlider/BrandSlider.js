import React, { useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  setBrandsLoading,
  setBrandsSuccess,
  setBrandsFailed,
} from "../../../store/brandsSlice";
import useApi from "../../../api/useApi";
import "./BrandSlider.css";
import defaultImg from "../../../assets/images/default.jpg";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const BASE_IMG_URL = process.env.REACT_APP_BASE_IMG_URL;

const BrandSlider = () => {
  const dispatch = useDispatch();
  const { brands, status, error } = useSelector((state) => state.brands);
  const { get } = useApi();

  // Get brand image URL with fallback
  const getBrandImage = useCallback((brand) => {
    if (brand.images && brand.images.length > 0) {
      const primaryImage =
        brand.images.find((img) => img.isPrimary) || brand.images[0];
      return BASE_IMG_URL + primaryImage.imageUrl;
    }
    if (brand.imageUrl) return brand.imageUrl;
    return defaultImg;
  }, []);

  // Fetch brands only if not loaded yet
  useEffect(() => {
    if (brands.length === 0) {
      const fetchBrands = async () => {
        dispatch(setBrandsLoading());
        try {
          const data = await get(`${BASE_URL}/brands?includeImages=true`);
          dispatch(setBrandsSuccess(data));
        } catch (err) {
          dispatch(setBrandsFailed(err.message));
        }
      };
      fetchBrands();
    }
  }, [dispatch, get, brands.length]);

  // Put your desired brand UUID order here (replace with your actual brand IDs)
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

  // Map brands by ID for fast lookup
  const brandMap = useMemo(() => {
    const map = new Map();
    brands.forEach((b) => {
      map.set(b.id, b);
    });
    return map;
  }, [brands]);

  // Build ordered displayed brands based on customOrder and filter missing
  const displayedBrands = useMemo(() => {
    return customOrder
      .map((id) => brandMap.get(id))
      .filter(Boolean)
      .slice(0, 6);
  }, [brandMap, customOrder]);

  // Skeleton loader while loading
  const skeletonLoader = useMemo(
    () => (
      <section className="brand-slider-section">
        <div className="container">
          <h2 className="brands-heading">Our Brands</h2>
          <div className="brand-container">
            {[...Array(8)].map((_, index) => (
              <div key={`skeleton-${index}`} className="brand-card skeleton" />
            ))}
          </div>
        </div>
      </section>
    ),
    []
  );

  // Error state UI
  const errorState = useMemo(
    () => (
      <section className="brand-slider-section">
        <div className="container">
          <div style={{ textAlign: "center", padding: "2rem" }}>
            Error loading brands: {error}
          </div>
        </div>
      </section>
    ),
    [error]
  );

  // Brand cards UI
  const brandCards = useMemo(
    () =>
      displayedBrands.map((brand) => (
        <Link to={`/brand/${brand.id}`} key={brand.id} className="brand-link">
          <div className="brand-card">
            <img
              src={getBrandImage(brand)}
              alt={brand.name}
              className="brand-image"
              loading="lazy"
              onError={(e) => {
                e.target.src = defaultImg;
              }}
            />
          </div>
        </Link>
      )),
    [displayedBrands, getBrandImage]
  );

  if (status === "loading") return skeletonLoader;
  if (status === "failed") return errorState;

  return (
    <section className="brand-slider-section">
      <div className="container">
        <h2 className="brands-heading">Shop By Brand</h2>
        <div className="brand-container">{brandCards}</div>
      </div>
    </section>
  );
};

export default React.memo(BrandSlider);
