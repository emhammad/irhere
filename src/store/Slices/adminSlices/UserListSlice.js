
import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  users: null,
  loading: false,
  error: null,
  success:false
};
const userListSlice = createSlice({
  name: 'userList',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
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

export const { setUsers, setLoading, setError,setSuccess } = userListSlice.actions;
//


export default userListSlice.reducer;


