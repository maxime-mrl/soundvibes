import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/authSlice";
import musicsReducer from '../features/musicsSlice';
import playlistsReducer from '../features/playlistsSlice';
import recommendationsReducer from '../features/recommendationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    musics: musicsReducer,
    playlists: playlistsReducer,
    recommendations: recommendationsReducer,
  }
});
