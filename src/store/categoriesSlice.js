import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import useApi from '../api/useApi';

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Async thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'categories/fetchProductsByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/products?categoryId=${categoryId}`);
      if (!response.ok) throw new Error('Failed to fetch category products');
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchBrandsByCategory = createAsyncThunk(
  'categories/fetchBrandsByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/brands?categoryId=${categoryId}&includeImages=true`);
      if (!response.ok) throw new Error('Failed to fetch brands');
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  brands: [],
  brandsStatus: 'idle',
  brandsError: null,
  categories: [],
  products: [],
  status: 'idle',
  error: null,
  currentCategory: null,
  productsStatus: 'idle',
  productsError: null
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategoriesLoading(state) {
      state.status = 'loading';
      state.error = null;
    },
    setCategoriesSuccess(state, action) {
      state.status = 'succeeded';
      state.categories = action.payload;
    },
    setCategoriesFailed(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    setCurrentCategory(state, action) {
      state.currentCategory = action.payload;
      state.products = [];
      state.productsStatus = 'idle';
      state.productsError = null;
    },
    resetCategories(state) {
      Object.assign(state, initialState);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchBrandsByCategory.pending, (state) => {
        state.brandsStatus = 'loading';
      })
      .addCase(fetchBrandsByCategory.fulfilled, (state, action) => {
        state.brandsStatus = 'succeeded';
        state.brands = action.payload;
      })
      .addCase(fetchBrandsByCategory.rejected, (state, action) => {
        state.brandsStatus = 'failed';
        state.brandsError = action.payload;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.productsStatus = 'loading';
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.productsStatus = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.productsStatus = 'failed';
        state.productsError = action.payload;
      });
  }
});

// Action creators
export const { 
  setCategoriesLoading,
  setCategoriesSuccess,
  setCategoriesFailed,
  setCurrentCategory,
  resetCategories
} = categoriesSlice.actions;

// Selectors
export const selectAllCategories = (state) => state.categories.categories;
export const selectCategoriesStatus = (state) => state.categories.status;
export const selectCategoriesError = (state) => state.categories.error;
export const selectCurrentCategory = (state) => state.categories.currentCategory;
export const selectCategoryProducts = (state) => state.categories.products;
export const selectCategoryProductsStatus = (state) => state.categories.productsStatus;
export const selectCategoryBrands = (state) => state.categories.brands;
export const selectBrandsStatus = (state) => state.categories.brandsStatus;

export default categoriesSlice.reducer;