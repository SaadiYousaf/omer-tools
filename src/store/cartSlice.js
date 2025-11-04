import { createSlice } from "@reduxjs/toolkit";

const savedCart = JSON.parse(localStorage.getItem("cart"));

const initialState = savedCart || {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  shipping: 12,
};

const calculateTotals = (items) => {
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce((total, item) => total + item.totalPrice, 0);
  return { totalQuantity, totalAmount };
};

const saveCart = (state) => {
  localStorage.setItem("cart", JSON.stringify(state));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      const maxQuantity = newItem.maxQuantity || Infinity;
      const quantityToAdd = newItem.quantity || 1;

      if (existingItem) {
        if (existingItem.quantity + quantityToAdd > maxQuantity) return;
        existingItem.quantity += quantityToAdd;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
      } else {
        if (quantityToAdd > maxQuantity) return;
        state.items.push({
          ...newItem,
          quantity: quantityToAdd,
          totalPrice: newItem.price * quantityToAdd,
        });
      }

      const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;

      saveCart(state); // persist changes
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (!existingItem) return;

      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
      }

      const { totalQuantity, totalAmount } = calculateTotals(state.items);
      state.totalQuantity = totalQuantity;
      state.totalAmount = totalAmount;

      saveCart(state);
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;

      saveCart(state);
    },
    setShipping(state, action) {
      state.shipping = action.payload;
      saveCart(state);
    },
  },
});

export const { addItemToCart, removeItemFromCart, clearCart, setShipping } =
  cartSlice.actions;
export default cartSlice.reducer;
