import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = "http://localhost:5117";

// Async Thunks
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/products`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/products/${productId}`);
      if (!response.ok) throw new Error("Product not found");
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/products/featured`);
      if (!response.ok) throw new Error('Failed to fetch featured products');
      const data = await response.json();
      console.log('Featured products data:', data); // Debug log
      return data;
    } catch (err) {
      console.error('Error fetching featured products:', err); // Debug log
      return rejectWithValue(err.message);
    }
  }
);

export const fetchProductsBySubcategory = createAsyncThunk(
  "products/fetchProductsBySubcategory",
  async (subcategoryId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/products?subcategoryId=${subcategoryId}`
      );
      if (!response.ok) throw new Error("Failed to fetch subcategory products");
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  items: [],
  filteredItems: [],
  currentProduct: null,
  status: "idle",
  error: null,
  productsBySubcategory: [],
  subcategoryProductsStatus: "idle",
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    filterByBrand: (state, action) => {
      const brandId = Number(action.payload);
      if (!isNaN(brandId)) {
        state.filteredItems = state.items.filter(
          (product) => Number(product.brandId) === brandId
        );
      }
    },
    filterByCategory: (state, action) => {
      const categoryId = action.payload;
      state.filteredItems = state.items.filter(
        (product) => product.categoryId === categoryId
      );
    },
    filterBySubcategory: (state, action) => {
      const subcategoryId = action.payload;
      state.filteredItems = state.items.filter(
        (product) => product.subcategoryId === subcategoryId
      );
    },
    resetFilteredItems: (state) => {
      state.filteredItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllProducts
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // fetchFeaturedProducts
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // fetchProductsBySubcategory
      .addCase(fetchProductsBySubcategory.pending, (state) => {
        state.subcategoryProductsStatus = "loading";
      })
      .addCase(fetchProductsBySubcategory.fulfilled, (state, action) => {
        state.subcategoryProductsStatus = "succeeded";
        state.productsBySubcategory = action.payload;
        state.filteredItems = action.payload; // This is the key fix!
      })
      .addCase(fetchProductsBySubcategory.rejected, (state, action) => {
        state.subcategoryProductsStatus = "failed";
        state.error = action.payload;
      });
  },
});

// Action creators
export const {
  setCurrentProduct,
  filterByBrand,
  filterByCategory,
  filterBySubcategory,
  resetFilteredItems,
} = productsSlice.actions;

// Selectors
export const selectAllProducts = (state) => state.products.items;
export const selectFilteredProducts = (state) => state.products.filteredItems;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectProductsBySubcategory = (state) =>
  state.products.productsBySubcategory;
export const selectSubcategoryProductsStatus = (state) =>
  state.products.subcategoryProductsStatus;

export default productsSlice.reducer;
