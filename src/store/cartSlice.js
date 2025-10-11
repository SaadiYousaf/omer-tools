import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const calculateTotals = (items) => {
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce((total, item) => total + item.totalPrice, 0);
  return { totalQuantity, totalAmount };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      const maxQuantity = newItem.maxQuantity || Infinity;
      const quantityToAdd = newItem.quantity || 1
      // Prevent adding more than available stock
      if (existingItem) {
        if (existingItem.quantity + quantityToAdd > maxQuantity) return state;
      } else {
        if (quantityToAdd > maxQuantity) return state;
      }
      
      if (!existingItem) {
        state.items.push({
          ...newItem,
          quantity: quantityToAdd,
          totalPrice: newItem.price * quantityToAdd
        });
      } else {
        existingItem.quantity += quantityToAdd;
        existingItem.totalPrice = existingItem.quantity * existingItem.price; 
      }
      
       const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (!existingItem) return;
      if (existingItem.quantity === 1) {
        state.items = state.items.filter(item => item.id !== id);
      } else {
          existingItem.quantity--;
        existingItem.totalPrice = existingItem.quantity *  existingItem.price;; // Recalcula
      }
      
     const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addItemToCart, removeItemFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;