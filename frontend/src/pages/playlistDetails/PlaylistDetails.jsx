import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getPlaylist } from "../../features/playlists/playlistsSlice";
import Datactx from "../../context/DataContext";
import { Loader, PlayCta, PlaylistCover } from "../../components";
import { SongList } from "../../containers";
import "./PlaylistDetails.css";

export default function PlaylistDetails() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchparams] = useSearchParams();
    const { playlist } = useSelector(state => state.playlists);
    const { playNewMusic } = useContext(Datactx);
    
    const id = searchparams.get("id");

    useEffect(() => {
        if (!id) navigate("/");
        else dispatch(getPlaylist(id))
    }, [dispatch, navigate, id ]);

    function ctaClick() {
        const ids = [];
        playlist.content.forEach(music => ids.push(music._id));
        playNewMusic({ids})
    }

    if (!playlist) return (
        <>
            <h1 className="h1">There is nothing here!</h1>
            <h2 className="h2">But is should</h2>
            <p>Wait a few second to load the playlist!</p>
        </>
    )
    return (
        <>
            <section className="playlist-details">
                <header className="playlist-header">
                    <PlaylistCover playlist={playlist} />
                    <div className="playlist-text">
                        <h1>{playlist.name}</h1>
                        <h2>{playlist.owner.username}</h2>
                    </div>
                </header>
                <article className="playlist-actions">
                    <PlayCta clickAction={ctaClick}/>
                    <button className="btn"><FontAwesomeIcon icon="fa-solid fa-share" /> Share</button>
                </article>
                <article className="playlist-song-list">
                    <SongList musics={playlist.content} />
                </article>
            </section>
            <Loader />
        </>
    )
}
