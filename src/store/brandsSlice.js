// src/store/brandsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brands: [],         // List of all brands
  status: 'idle',     // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null         // Error message if any
};

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    /**
     * Sets loading status while fetching brands
     */
    setBrandsLoading(state) {
      state.status = 'loading';
      state.error = null;
    },

    /**
     * Stores the fetched brands on success
     * @param {Object} state 
     * @param {Object} action - action.payload: array of brands
     */
    setBrandsSuccess(state, action) {
      state.status = 'succeeded';
      state.brands = action.payload;
    },

    /**
     * Stores error if fetching fails
     * @param {Object} state 
     * @param {Object} action - action.payload: error message
     */
    setBrandsFailed(state, action) {
      state.status = 'failed';
      state.error = action.payload;
    },

    /**
     * Optional: Clears all brand-related state (e.g., on logout)
     */
    resetBrands(state) {
      state.brands = [];
      state.status = 'idle';
      state.error = null;
    }
  }
});

export const { 
  setBrandsLoading, 
  setBrandsSuccess, 
  setBrandsFailed, 
  resetBrands 
} = brandsSlice.actions;

export default brandsSlice.reducer;
