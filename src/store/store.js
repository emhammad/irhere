
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import userReducer from './Slices/UserSlice';
import userListReducer from './Slices/adminSlices/UserListSlice';
const rootReducer = combineReducers({
  // Add other reducers here if any
  user: userReducer,
  userList:userListReducer

});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user','userList'], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
