
import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  user: null,
  loading: false,
  error: null,
  success:false
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSuccess:(state, action)=>{
        state.success = action.payload;
    }
  },
});

export const { setUser, setLoading, setError,setSuccess } = userSlice.actions;


export default userSlice.reducer;

// Async action to fetch user data

