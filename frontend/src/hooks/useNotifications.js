import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { logout, statusReset as resetUser } from "../features/auth/authSlice";
import { statusReset as resetMusic } from "../features/musics/musicsSlice";
import { statusReset as resetPlaylist } from "../features/playlists/playlistsSlice";

export default function useNotification() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth);
    const music = useSelector(state => state.musics);
    const playlist = useSelector(state => state.playlists);
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
    }, [user, user.isError, user.isSuccess, user.message, dispatch]);
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
    }, [music, music.isSuccess, music.isError, music.message, dispatch]);
    // playlist notification
    useEffect(() => {
        if (playlist.message) {
            if (/token/.test(playlist.message)) {
                dispatch(logout());
                return;
            };
            dispatch(resetPlaylist());
            if (playlist.isError) toast.error(playlist.message);
            else toast.success(playlist.message);
        }
    }, [playlist, playlist.isSuccess, playlist.isError, playlist.message, dispatch]);

    return null;
}
