import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { expiredToken, statusReset as resetUser } from "../features/authReducer";
import { statusReset as resetMusic } from "../features/musicsReducer";
import { statusReset as resetPlaylists } from "../features/playlistsReducer";
import { statusReset as resetRecommendations } from "../features/recommendationsReducer";

export default function useNotification() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth);
    const music = useSelector(state => state.musics);
    const playlists = useSelector(state => state.playlists);
    const recommendations = useSelector(state => state.recommendations);
    const cooldown = {
        message: "",
        last: Date.now()
    }

    const displayNotification = useCallback((state, reset) => {
        if (!state.message) return; // check if notif
        if (/token/.test(state.message)) { // token expired
            dispatch(expiredToken());
            return;
        };
        dispatch(reset()); // reset the message and status of concerned state
        // check cooldown
        if (cooldown.message === state.message && Date.now() - cooldown.last < 2000) return;
        cooldown.message = state.message;
        cooldown.last = Date.now();
        // display notification
        if (state.isError) toast.error(state.message);
        else toast.success(state.message);
    // eslint-disable-next-line
    }, [dispatch])

    /* --------------------------- Useeffect listener --------------------------- */
    // user notification
    useEffect(() => {
        displayNotification(user, resetUser);
    }, [user, displayNotification]);
    // music notification
    useEffect(() => {
        displayNotification(music, resetMusic);
    }, [music, displayNotification]);
    // playlist notification
    useEffect(() => {
        displayNotification(playlists, resetPlaylists);
    }, [playlists, displayNotification]);
    // recommendations notification
    useEffect(() => {
        displayNotification(recommendations, resetRecommendations);
    }, [recommendations, displayNotification]);
}
