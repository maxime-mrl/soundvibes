import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getOwn } from "../../features/playlists/playlistsSlice";
import { Playlist } from "../../components";
import "./UserPlaylist.css";

export default function UserPlaylist() {
    const { playlists } = useSelector(state => state.playlists);
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getOwn())
    }, [dispatch])

    return (
        <article className={`user-playlists ${playlists.length > 4 ? "" : "column"}`}>
            <h2 className="h2">Your playlists:</h2>
            {playlists && playlists.length > 0 
            ? 
                (playlists.map((playlist, i) => (
                    <Playlist key={i} playlist={playlist} />
                )))
            :
            <>
            <h2 className="h2">You have no playlist</h2>
            <p>Create a playlist by adding your first song</p>
            </>
            }
        </article>
    )
}
