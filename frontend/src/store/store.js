import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/auth/authSlice";
import musicsReducer from '../features/musics/musicsSlice';
import playlistsReducer from '../features/playlists/playlistsSlice';
import recommendationsReducer from '../features/recommendations/recommendationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    musics: musicsReducer,
    playlists: playlistsReducer,
    recommendations: recommendationsReducer,
  },
});
