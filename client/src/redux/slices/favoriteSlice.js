import { createSlice } from '@reduxjs/toolkit';

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState: {
    items: localStorage.getItem('favorites') 
      ? JSON.parse(localStorage.getItem('favorites')) 
      : [],
  },
  reducers: {
    addToFavorites: (state, action) => {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (!existingItem) {
        state.items.push(action.payload);
        localStorage.setItem('favorites', JSON.stringify(state.items));
      }
    },
    removeFromFavorites: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      localStorage.setItem('favorites', JSON.stringify(state.items));
    },
    clearFavorites: (state) => {
      state.items = [];
      localStorage.removeItem('favorites');
    },
  },
});

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer; 