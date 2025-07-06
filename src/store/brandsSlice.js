// src/store/brandsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { dummyProducts } from '../data/dummyProducts';

const initialState = {
  brands: dummyProducts
};

const brandsSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {}
});

export default brandsSlice.reducer;