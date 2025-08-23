import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import productsReducer from './productsSlice';
import categoriesReducer from './categoriesSlice';
import authReducer, { verifyToken } from './authSlice'; // Import verifyToken directly
import brandsReducer from './brandsSlice';
import subcategoriesReducer from './subcategoriesSlice';
import { setupListeners } from '@reduxjs/toolkit/query';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    categories: categoriesReducer,
    auth: authReducer,
    brands: brandsReducer,
    subcategories: subcategoriesReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Check if user is already authenticated on app startup
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

if (token && user) {
  // Dispatch verifyToken to check if token is still valid
  store.dispatch(verifyToken()); // Use the imported verifyToken directly
}

setupListeners(store.dispatch);

export default store;