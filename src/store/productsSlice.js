// src/store/productsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {dummyProducts} from "../data/dummyProducts.js";


const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: dummyProducts,
    filteredItems: [],
    status: 'idle',
    error: null
  },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
      state.status = 'succeeded'; // Add this to clear loading state
    },
    filterByCategory: (state, action) => { // Added this new reducer
      state.filteredItems = state.items.filter(
        product => product.categoryId === action.payload
      );
      state.status = 'succeeded';
    },
    filterByBrand: (state, action) => {
      state.filteredItems = state.items.filter(
        product => product.brand=== action.payload
      );
      state.status = 'succeeded';
    },
    setLoading: (state, action) => {
      state.status = action.payload ? 'loading' : 'idle';
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetFilteredItems: (state) => { // Added this new reducer
      state.filteredItems = [];
    }
  }
});

export const { 
  setProducts, 
  filterByCategory, // Export the new reducer
  filterByBrand, 
  setLoading, 
  setError,
  resetFilteredItems
} = productsSlice.actions;

export default productsSlice.reducer;