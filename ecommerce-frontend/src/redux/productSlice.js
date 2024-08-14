
import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'product',
  initialState: {
    docs: [], 
  },
  reducers: {
    setProducts(state, action) {
      state.products = action.payload; 
    },
  },
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
