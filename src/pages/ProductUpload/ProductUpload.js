import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllBrands,
  selectBrandsStatus,
  fetchBrands,
} from "../../store/brandsSlice";
import {
  selectAllCategories,
  selectCategoriesStatus,
  fetchCategories,
} from "../../store/categoriesSlice";
import {
  selectSubcategories,
  selectSubcategoriesStatus,
  fetchSubcategories,
} from "../../store/subcategoriesSlice";
import useApi from "../../api/useApi";

const ProductUpload = () => {
  const dispatch = useDispatch();
  const { post, get } = useApi(); // Add get here

  // Form state
  const [product, setProduct] = useState({
    categoryId: "",
    subcategoryId: "",
    brandId: "",
    sku: "",
    name: "",
    description: "",
    specifications: "{}",
    price: 0,
    discountPrice: null,
    stockQuantity: 0,
    weight: null,
    dimensions: "",
    isFeatured: false,
    warrantyPeriod: "",
    images: [],
    variants: [],
  });

  // Redux state
  const brands = useSelector(selectAllBrands);
  const brandsStatus = useSelector(selectBrandsStatus);
  const categories = useSelector(selectAllCategories);
  const categoriesStatus = useSelector(selectCategoriesStatus);
  const subcategories = useSelector(selectSubcategories);
  const subcategoriesStatus = useSelector(selectSubcategoriesStatus);

  // Filter subcategories by selected category
  const filteredSubcategories = subcategories.filter(
    (subcat) => subcat.categoryId === product.categoryId
  );

  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Load initial data
  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchCategories());
    // Load all subcategories initially
    dispatch(fetchSubcategories());
  }, [dispatch]);

  // Handle category change
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setProduct((prev) => ({
      ...prev,
      categoryId: value,
      subcategoryId: "", // Reset subcategory when category changes
    }));

    // Fetch subcategories for the selected category
    if (value) {
      dispatch(fetchSubcategories(value));
    }
  };

  // Modified handleChange to use separate category handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "categoryId") {
      handleCategoryChange(e);
      return;
    }

    setProduct((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleImageChange = (e) => {
    setSelectedImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Create product
      const productResponse = await post("/api/products", {
        ...product,
        images: [],
      });

      // 2. Upload images
      if (selectedImages.length > 0) {
        const uploadPromises = selectedImages.map(async (image, index) => {
          const formData = new FormData();
          formData.append("file", image);
          formData.append("productId", productResponse.id.toString());
          formData.append("altText", product.name || "Product Image");
          formData.append("isPrimary", index === 0 ? "true" : "false");

          // Add authorization headers if needed
          const headers = {
            // 'Authorization': `Bearer ${yourAuthToken}`,
            // 'Content-Type': 'multipart/form-data' // Let browser set this
          };

          const response = await fetch("/api/products/images", {
            method: "POST",
            body: formData,
            headers: headers,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Image upload failed");
          }
          return await response.json();
        });

        await Promise.all(uploadPromises);
      }

      // 3. Get updated product

      const updatedProduct = await get(`/api/products/${productResponse.id}`);
      console.log("Product with images:", updatedProduct);

      setSuccess(true);
      // Reset form...
    } catch (err) {
      setError(err.message || "Failed to create product");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Product created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU *
              </label>
              <input
                type="text"
                name="sku"
                value={product.sku}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Categories</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand *
              </label>
              <select
                name="brandId"
                value={product.brandId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={brandsStatus === "loading"}
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {brandsStatus === "loading" && (
                <p className="text-xs text-gray-500 mt-1">Loading brands...</p>
              )}
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="categoryId"
                value={product.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={categoriesStatus === "loading"}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categoriesStatus === "loading" && (
                <p className="text-xs text-gray-500 mt-1">
                  Loading categories...
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory *
              </label>
              <select
                name="subcategoryId"
                value={product.subcategoryId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={
                  !product.categoryId || subcategoriesStatus === "loading"
                }
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
              {subcategoriesStatus === "loading" && (
                <p className="text-xs text-gray-500 mt-1">
                  Loading subcategories...
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Specifications (JSON)
          </label>
          <textarea
            name="specifications"
            value={product.specifications}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder='{"key": "value"}'
          />
        </div>
        {/* Pricing & Inventory */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Pricing & Inventory</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Price
              </label>
              <input
                type="number"
                name="discountPrice"
                value={product.discountPrice || ""}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={product.stockQuantity}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isFeatured"
              checked={product.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Featured Product
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={product.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Active Product
            </label>
          </div>
        </div>

        {/* Shipping & Warranty */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Shipping & Warranty</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={product.weight || ""}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dimensions (LxWxH)
              </label>
              <input
                type="text"
                name="dimensions"
                value={product.dimensions}
                onChange={handleChange}
                placeholder="e.g., 18x15x8"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Warranty Period
              </label>
              <input
                type="text"
                name="warrantyPeriod"
                value={product.warrantyPeriod}
                onChange={handleChange}
                placeholder="e.g., 2 years"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Images</h2>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Product Images
            </label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              accept="image/*"
            />
          </div>

          {selectedImages.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Selected Images ({selectedImages.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(selectedImages).map((image, index) => (
                  <div
                    key={index}
                    className="w-24 h-24 border rounded overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Product Variants</h2>
          <div className="space-y-4">
            {product.variants.map((variant, index) => (
              <div key={index} className="border p-4 rounded">
                <h3 className="font-medium">Variant #{index + 1}</h3>
                {/* Variant form fields would go here */}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setProduct((prev) => ({
                  ...prev,
                  variants: [
                    ...prev.variants,
                    {
                      /* default variant object */
                    },
                  ],
                }))
              }
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              + Add Variant
            </button>
          </div>
        </div>
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Product..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductUpload;
