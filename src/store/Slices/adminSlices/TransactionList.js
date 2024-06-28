
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  transaction: null,
  loading: false,
  error: null,
  success:false
};
const transactionListSlice = createSlice({
  name: 'transactionList',
  initialState,
  reducers: {
    setTransaction: (state, action) => {
      state.transaction = action.payload;
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

export const { setTransaction, setLoading, setError,setSuccess } = transactionListSlice.actions;
//
export const fetchTransaction = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const token = localStorage.getItem('access_token');

    // Set headers with authorization token bearer
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Make Axios request with headers
    const response = await axios.get(`${process.env.REACT_APP_SERVER_DOMAIN}/api/get_user_list`, { headers });

    // Handle response data
    console.log(response.data);
    dispatch(setTransaction(response.data))
    dispatch(setSuccess(true))
  } catch (error) {
    
    console.log(error, "Error in losgin");
    dispatch(setLoading(false));
    dispatch(setError("internal server error"));
  }
  dispatch(setLoading(false));
};

export default transactionListSlice.reducer;


