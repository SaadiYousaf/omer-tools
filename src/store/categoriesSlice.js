import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import useApi from '../api/useApi';

// Async thunk to fetch products by category
export const fetchProductsByCategory = createAsyncThunk(
  'categories/fetchProductsByCategory',
  async (categoryId, { rejectWithValue }) => {
    const { get } = useApi();
    try {
      console.log('[fetchProductsByCategory] Fetching products for category ID:', categoryId);
      const url = `http://localhost:5117/api/Products?categoryId=${categoryId}`;
      console.log('[fetchProductsByCategory] Request URL:', url);
      
      const response = await get(url);
      console.log('[fetchProductsByCategory] Raw API response:', response);
      
      if (!Array.isArray(response)) {
        throw new Error('Invalid products data format - expected array');
      }
      
      console.log('[fetchProductsByCategory] Received', response.length, 'products');
      return response;
    } catch (err) {
      console.error('[fetchProductsByCategory] Error:', {
        message: err.message,
        stack: err.stack,
        response: err.response
      });
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  categories: [],
  products: [], // Added products array to store category products
  status: 'idle',
  error: null,
  currentCategory: null,
  productsStatus: 'idle', // Separate status for products
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
      // Reset products state when category changes
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
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.productsStatus = 'loading';
        state.productsError = null;
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

export const { 
  setCategoriesLoading,
  setCategoriesSuccess,
  setCategoriesFailed,
  setCurrentCategory,
  resetCategories
} = categoriesSlice.actions;

export default categoriesSlice.reducer;