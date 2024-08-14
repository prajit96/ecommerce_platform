
import { createSlice } from '@reduxjs/toolkit';

export const courseSlice = createSlice({
  name: 'course',
  initialState: {
    docs: [],
  },
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload;
    },
  },
});

export const { setCourses } = courseSlice.actions;
export default courseSlice.reducer;
