import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./Loader.css";

export default function Loader() {
    const [isSomethingLoading, setisSomethingLoading] = useState(false);
    
    const authLoading = useSelector(state => state.auth).isLoading;
    const musicsLoading = useSelector(state => state.musics).isLoading;
    const playlistsLoading = useSelector(state => state.playlists).isLoading;
    const recommendationsLoading = useSelector(state => state.recommendations).isLoading;

    useEffect(() => { // check if anything load
        if (authLoading || musicsLoading || playlistsLoading || recommendationsLoading) setisSomethingLoading(true);
        else setisSomethingLoading(false);
    }, [isSomethingLoading, authLoading, musicsLoading, playlistsLoading, recommendationsLoading])

    if (isSomethingLoading) return (
        <div className="loader-container">
            <div className="loader">
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            </div>
        </div>
    ); else return (<></>);
}
