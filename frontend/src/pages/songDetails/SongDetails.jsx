import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getMusic } from "../../features/musics/musicsSlice";
import { getSimilar } from "../../features/playlists/playlistsSlice";
import Datactx from "../../context/DataContext";
import { CoverImage, Loader, PlayCta } from "../../components";
import { SongList } from "../../containers";
import "./SongDetails.css";

export default function SongDetails() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchparams] = useSearchParams();
    
    const id = searchparams.get("id");
    const { playNewMusic, setAddPlaylist } = useContext(Datactx);
    const { infos } = useSelector(state => state.musics);
    const { similar } = useSelector(state => state.playlists)

    useEffect(() => {
        if (!id) navigate("/");
        else dispatch(getMusic(id))
    }, [dispatch, navigate, id ]);
    
    useEffect(() => {
        if (infos && infos.artist) dispatch(getSimilar({artist: infos.artist}))
    }, [dispatch, infos ])

    function playSimilarClicked() {
        const similarIds = [];
        console.log(similar);
        similar.forEach(song => {
            similarIds.push(song._id)
        })
        playNewMusic({ ids: similarIds })
    }

    if (!infos) return (
        <>
            <h1 className="h1">There is nothing here!</h1>
            <h2 className="h2">But is should</h2>
            <p>Wait a few second to load the music!</p>
        </>
    )
    return (
        <>
            <section className="music-details">
                <header className="music-header">
                    <CoverImage music={ {_id: id, ...infos} } />
                    <div>
                        <h1>{infos.title}</h1>
                        <h2>{infos.artist}</h2>
                        <h3>{infos.year}</h3>
                    </div>
                </header>
                <article className="music-actions">
                    <PlayCta clickAction={() => {playNewMusic({ ids: [id] })}}/>
                    <button className="btn" onClick={(e) => {setAddPlaylist({ids: [id], e})}}><FontAwesomeIcon icon="fa-solid fa-plus" /> Add to playlist</button>
                    <button className="btn"><FontAwesomeIcon icon="fa-solid fa-share" /> Share</button>
                </article>
            </section>
            <section className="music-similar">
                <div>
                    <h1 className="h1">
                        Featuring {infos.artist}
                    </h1>
                    <PlayCta clickAction={playSimilarClicked}/>
                </div>
                <SongList musics={similar} />
            </section>
            <Loader />
        </>
    )
}
