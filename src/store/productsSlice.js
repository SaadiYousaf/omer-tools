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
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
      state.status = 'succeeded';
    },
    setProducts: (state, action) => {
      state.items = action.payload;
      state.status = 'succeeded'; // Add this to clear loading state
    },
    filterByCategory: (state, action) => { 
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
    resetFilteredItems: (state) => { 
      state.filteredItems = [];
    }
  }
});

export const { 
  setProducts, 
  filterByCategory, 
  filterByBrand, 
  setLoading, 
  setError,
  setCurrentProduct,
  resetFilteredItems
} = productsSlice.actions;

export default productsSlice.reducer;