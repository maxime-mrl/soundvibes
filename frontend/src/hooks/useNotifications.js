import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { reset as resetUser } from "../features/auth/authSlice";
import { reset as resetMusic } from "../features/musics/musicsSlice";
import { reset as resetPlaylist } from "../features/playlists/playlistsSlice";

export default function useNotification() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth);
    const music = useSelector(state => state.musics);
    const playlist = useSelector(state => state.playlists);
    // user notification
    useEffect(() => {
        if (user.message) {
            dispatch(resetUser());
            if (user.isError) toast.error(user.message);
            else toast.success(user.message);
        }
    }, [user, user.isError, user.isSuccess, user.message, dispatch]);
    // music notification
    useEffect(() => {
        if (music.message) {
            dispatch(resetMusic());
            if (music.isError) toast.error(music.message);
            else toast.success(music.message);
        }
    }, [music, music.isSuccess, music.isError, music.message, dispatch]);
    // playlist notification
    useEffect(() => {
        if (playlist.message) {
            dispatch(resetPlaylist());
            if (playlist.isError) toast.error(playlist.message);
            else toast.success(playlist.message);
        }
    }, [playlist, playlist.isSuccess, playlist.isError, playlist.message, dispatch]);

    return null;
}
