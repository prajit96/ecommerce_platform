
import { createSlice } from '@reduxjs/toolkit';

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlist: [],
  },
  reducers: {
    setWishlist: (state, action) => {
      state.wishlist = action.payload;
    },
  },
});

export const { setWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
