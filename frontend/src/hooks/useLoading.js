import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


export default function useLoading() {
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
        console.log(loadings)
    }, [isSomethingLoading, loadings])

    return isSomethingLoading;
}