import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./Loader.css";

export default function Loader() {
    const [isSomethingLoading, setisSomethingLoading] = useState(false)
    const loadings = [
        useSelector(state => state.auth).isLoading,
        useSelector(state => state.musics).isLoading,
        useSelector(state => state.playlists).isLoading,
    ]

    useEffect(() => {
        let load = false;
        loadings.forEach(isLoading => { if (isLoading) return load = true });
        if (load) setisSomethingLoading(true)
        else setisSomethingLoading(false)
    }, [isSomethingLoading, loadings])
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
