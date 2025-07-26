import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'http://localhost:5117';

// API request helper
const apiRequest = async (endpoint) => {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

// Async Thunks
export const fetchSubcategories = createAsyncThunk(
  'subcategories/fetchSubcategories',
  async (categoryId, { rejectWithValue }) => {
    if (!categoryId) {
      return rejectWithValue('Category ID is required');
    }

    try {
      const data = await apiRequest(`/api/subcategories?categoryId=${categoryId}`);
      if (!Array.isArray(data)) {
        throw new Error('Expected array of subcategories');
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchSubcategory = createAsyncThunk(
  'subcategories/fetchSubcategory',
  async (subcategoryId, { rejectWithValue }) => {
    if (!subcategoryId) {
      return rejectWithValue('Subcategory ID is required');
    }

    try {
      const data = await apiRequest(`/api/subcategories/${subcategoryId}`);
      if (!data || typeof data !== 'object') {
        throw new Error('Expected subcategory object');
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchSubcategoryProducts = createAsyncThunk(
  'subcategories/fetchSubcategoryProducts',
  async (subcategoryId, { rejectWithValue }) => {
    if (!subcategoryId) {
      return rejectWithValue('Subcategory ID is required');
    }

    try {
      const data = await apiRequest(`/api/products?subcategoryId=${subcategoryId}`);
      if (!Array.isArray(data)) {
        throw new Error('Expected array of products');
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  subcategories: [],
  currentSubcategory: null,
  products: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  productsStatus: 'idle',
  singleSubcategoryStatus: 'idle', // For single subcategory fetch
  error: null,
  productsError: null,
  singleSubcategoryError: null
};

const subcategoriesSlice = createSlice({
  name: 'subcategories',
  initialState,
  reducers: {
    setCurrentSubcategory: (state, action) => {
      state.currentSubcategory = action.payload;
      // Reset products when changing subcategory
      state.products = [];
      state.productsStatus = 'idle';
      state.productsError = null;
    },
    clearCurrentSubcategory: (state) => {
      state.currentSubcategory = null;
    },
    resetSubcategories: (state) => {
      Object.assign(state, initialState);
    }
  },
  extraReducers: (builder) => {
    builder
      // Subcategories reducers
      .addCase(fetchSubcategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.subcategories = action.payload;
        state.error = null;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Single subcategory reducers
      .addCase(fetchSubcategory.pending, (state) => {
        state.singleSubcategoryStatus = 'loading';
        state.singleSubcategoryError = null;
      })
      .addCase(fetchSubcategory.fulfilled, (state, action) => {
        state.singleSubcategoryStatus = 'succeeded';
        state.currentSubcategory = action.payload;
        state.singleSubcategoryError = null;
      })
      .addCase(fetchSubcategory.rejected, (state, action) => {
        state.singleSubcategoryStatus = 'failed';
        state.singleSubcategoryError = action.payload;
      })

      // Products reducers
      .addCase(fetchSubcategoryProducts.pending, (state) => {
        state.productsStatus = 'loading';
        state.productsError = null;
      })
      .addCase(fetchSubcategoryProducts.fulfilled, (state, action) => {
        state.productsStatus = 'succeeded';
        state.products = action.payload;
        state.productsError = null;
      })
      .addCase(fetchSubcategoryProducts.rejected, (state, action) => {
        state.productsStatus = 'failed';
        state.productsError = action.payload;
      });
  }
});

// Action creators
export const { 
  setCurrentSubcategory,
  clearCurrentSubcategory,
  resetSubcategories
} = subcategoriesSlice.actions;

// Selectors
export const selectSubcategories = (state) => state.subcategories.subcategories;
export const selectCurrentSubcategory = (state) => state.subcategories.currentSubcategory;
export const selectSubcategoryProducts = (state) => state.subcategories.products;
export const selectSubcategoriesStatus = (state) => state.subcategories.status;
export const selectProductsStatus = (state) => state.subcategories.productsStatus;
export const selectSingleSubcategoryStatus = (state) => state.subcategories.singleSubcategoryStatus;
export const selectSubcategoriesError = (state) => state.subcategories.error;
export const selectProductsError = (state) => state.subcategories.productsError;
export const selectSingleSubcategoryError = (state) => state.subcategories.singleSubcategoryError;

export default subcategoriesSlice.reducer;