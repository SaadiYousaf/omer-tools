import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const BASE_URL = process.env.REACT_APP_BASE_URL;

// Async Thunks

export const fetchSubcategories = createAsyncThunk(
  'subcategories/fetchSubcategories',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/subcategories?categoryId=${categoryId}&includeImages=true`);
      if (!response.ok) throw new Error('Failed to fetch subcategories');
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchSubcategoriesByCategory = fetchSubcategories; // Alias for consistency

export const fetchSubcategory = createAsyncThunk(
  'subcategories/fetchSubcategory',
  async (subcategoryId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/subcategories/${subcategoryId}`);
      if (!response.ok) throw new Error('Subcategory not found');
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchSubcategoryProducts = createAsyncThunk(
  'subcategories/fetchSubcategoryProducts',
  async (subcategoryId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/products?subcategoryId=${subcategoryId}`);
      if (!response.ok) throw new Error('Failed to fetch subcategory products');
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  subcategories: [],
  currentSubcategory: null,
  products: [],
  status: 'idle',
  error: null,
  productsStatus: 'idle',
  productsError: null,
  singleSubcategoryStatus: 'idle',
  singleSubcategoryError: null
};

const subcategoriesSlice = createSlice({
  name: 'subcategories',
  initialState,
  reducers: {
    setCurrentSubcategory: (state, action) => {
      state.currentSubcategory = action.payload;
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
      .addCase(fetchSubcategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.subcategories = action.payload;
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchSubcategory.pending, (state) => {
        state.singleSubcategoryStatus = 'loading';
        state.singleSubcategoryError = null;
      })
      .addCase(fetchSubcategory.fulfilled, (state, action) => {
        state.singleSubcategoryStatus = 'succeeded';
        state.currentSubcategory = action.payload;
      })
      .addCase(fetchSubcategory.rejected, (state, action) => {
        state.singleSubcategoryStatus = 'failed';
        state.singleSubcategoryError = action.payload;
      })
      .addCase(fetchSubcategoryProducts.pending, (state) => {
        state.productsStatus = 'loading';
        state.productsError = null;
      })
      .addCase(fetchSubcategoryProducts.fulfilled, (state, action) => {
        state.productsStatus = 'succeeded';
          if (action.payload.data && Array.isArray(action.payload.data)) {
    // New paginated response - extract the data array
    state.products = action.payload.data;
  } else if (Array.isArray(action.payload)) {
    // Old non-paginated response - use directly
    state.products = action.payload;
  } else {
    // Fallback - ensure it's always an array
    state.products = [];
    console.warn('Unexpected subcategory products response format:', action.payload);
  }
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
export const selectSubcategoriesByCategory = (state, categoryId) => 
  state.subcategories.subcategories.filter(s => s.categoryId === categoryId);
export const selectSubcategoriesStatus = (state) => state.subcategories.status;
export const selectSubcategoriesError = (state) => state.subcategories.error;
export const selectCurrentSubcategory = (state) => state.subcategories.currentSubcategory;
export const selectSubcategoryProducts = (state) => state.subcategories.products;
export const selectSubcategoryProductsStatus = (state) => state.subcategories.productsStatus;

export default subcategoriesSlice.reducer;