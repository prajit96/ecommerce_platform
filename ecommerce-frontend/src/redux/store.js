
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import productReducer from './productSlice';
import courseReducer from './courseSlice';
import wishlistReducer from './wishlistSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    course: courseReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
  },
});
