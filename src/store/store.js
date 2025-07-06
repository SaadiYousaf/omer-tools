import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import productsReducer from './productsSlice';
import categoriesReducer from './categoriesSlice';
import authReducer from './authSlice';
import brandsReducer from './brandsSlice'

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    categories: categoriesReducer,
    auth: authReducer,
    brands: brandsReducer
  }
});

export default store;