import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Async Thunk
export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/brands?includeImages=true`);
      if (!response.ok) throw new Error('Failed to fetch brands');
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  brands: [],
  status: 'idle',
  error: null
};

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    setBrandsLoading(state) {
      state.status = 'loading';
      state.error = null;
    },
    setBrandsSuccess(state, action) {
      state.status = 'succeeded';
      state.brands = action.payload;
    },
    setBrandsFailed(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },
    resetBrands(state) {
      state.brands = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// Action creators
export const { 
  setBrandsLoading, 
  setBrandsSuccess, 
  setBrandsFailed, 
  resetBrands 
} = brandsSlice.actions;

// Selectors
export const selectAllBrands = (state) => state.brands.brands;
export const selectBrandsStatus = (state) => state.brands.status;
export const selectBrandsError = (state) => state.brands.error;

export default brandsSlice.reducer;