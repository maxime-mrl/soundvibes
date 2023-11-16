import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/auth/authSlice";
import musicsReducer from '../features/musics/musicsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    musics: musicsReducer
  },
});
