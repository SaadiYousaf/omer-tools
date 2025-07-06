import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: [
    { id: 1, name: 'Power Tools', slug: 'power-tools' },
    { id: 2, name: 'Hand Tools', slug: 'hand-tools' },
    { id: 3, name: 'Tool Storage', slug: 'tool-storage' },
    { id: 4, name: 'Safety Equipment', slug: 'safety-equipment' },
    { id: 5, name: 'Electrical', slug: 'electrical' },
  ],
  currentCategory: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCurrentCategory(state, action) {
      state.currentCategory = action.payload;
    },
  },
});

export const { setCurrentCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;