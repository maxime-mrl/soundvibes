import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Datactx from "../../context/DataContext";
import { Loader, PlayCta, PlaylistCover } from "../../components";
import { SongList } from "../../containers";
import { getRecommendations } from "../../features/recommendationsReducer";
import "./RecommendationDetails.css";
import { newPlaylist } from "../../features/playlistsReducer";

export default function RecommendationDetails() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchparams] = useSearchParams();
    const { recommendations, topListened } = useSelector(state => state.recommendations);
    const { playNewMusic } = useContext(Datactx);

    const [details, setDetails] = useState();
    
    const id = searchparams.get("id");
    
    function ctaClick() {
        const ids = [];
        details.content.forEach(music => ids.push(music._id));
        playNewMusic({ids});
    }

    function createPlaylist() {
        if (!details || !details.name || !details.content) return;
        const ids = [];
        details.content.forEach(music => ids.push(music._id));
        const data = {
            name: details.name,
            musics: ids
        }
        dispatch(newPlaylist(data))
    }

    useEffect(() => {
        if (!id) navigate("/");
        else dispatch(getRecommendations())
    }, [dispatch, navigate, id ]);

    useEffect(() => {
        const all = [...recommendations, ...topListened]
        if (all && all.length > 0) {
            const target = all.find(recommendation => recommendation._id === id)
            if (target) setDetails(target);
            else navigate("/")
        }
    }, [recommendations, topListened, id, navigate])

    if (!details) return (
        <section className="playlist-details">
            <h1 className="h1">There is nothing here!</h1>
            <h2 className="h2">But is should</h2>
            <p>Wait a few second to load the playlist!</p>
        </section>
    )

    return (
        <>
            <section className="playlist-details">
                <header className="playlist-header">
                    <PlaylistCover playlist={details} />
                    <div className="playlist-text">
                        <h1>{details.name}</h1>
                    </div>
                </header>
                <article className="playlist-actions">
                    <PlayCta clickAction={ctaClick}/>
                    <button className="btn" onClick={createPlaylist}><FontAwesomeIcon icon={faPlus} /> Save as playlist</button>
                </article>
                <article className="playlist-song-list">
                    <SongList musics={details.content} />
                </article>
            </section>
            <Loader />
        </>
    )
}
