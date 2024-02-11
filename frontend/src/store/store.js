import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/authReducer";
import musicsReducer from '../features/musicsReducer';
import playlistsReducer from '../features/playlistsReducer';
import recommendationsReducer from '../features/recommendationsReducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    musics: musicsReducer,
    playlists: playlistsReducer,
    recommendations: recommendationsReducer,
  }
});
