import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { logout, statusReset as resetUser } from "../features/authSlice";
import { statusReset as resetMusic } from "../features/musicsSlice";
import { statusReset as resetPlaylist } from "../features/playlistsSlice";
import { statusReset as resetRecommendations } from "../features/recommendationsSlice";

export default function useNotification() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth);
    const music = useSelector(state => state.musics);
    const playlists = useSelector(state => state.playlists);
    const recommendations = useSelector(state => state.recommendations);
    // user notification
    useEffect(() => {
        if (user.message) {
            if (/token/.test(user.message)) {
                dispatch(logout());
                return;
            };
            dispatch(resetUser());
            if (user.isError) toast.error(user.message);
            else toast.success(user.message);
        }
    }, [user, dispatch]);
    // music notification
    useEffect(() => {
        if (music.message) {
            if (/token/.test(music.message)) {
                dispatch(logout());
                return;
            };
            dispatch(resetMusic());
            if (music.isError) toast.error(music.message);
            else toast.success(music.message);
        }
    }, [music, dispatch]);
    // playlist notification
    useEffect(() => {
        if (playlists.message) {
            if (/token/.test(playlists.message)) {
                dispatch(logout());
                return;
            };
            dispatch(resetPlaylist());
            if (playlists.isError) toast.error(playlists.message);
            else toast.success(playlists.message);
        }
    }, [playlists, dispatch]);
    // recommendations notification
    useEffect(() => {
        if (recommendations.message) {
            if (/token/.test(recommendations.message)) {
                dispatch(logout());
                return;
            };
            dispatch(resetRecommendations());
            if (recommendations.isError) toast.error(recommendations.message);
            else toast.success(recommendations.message);
        }
    }, [recommendations, dispatch]);
}
