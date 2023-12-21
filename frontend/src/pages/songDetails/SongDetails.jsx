import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getMusic, reset } from "../../features/musicsSlice";
import { getSimilar } from "../../features/recommendationsSlice";
import Datactx from "../../context/DataContext";
import { CoverImage, Loader, PlayCta, ShareBtn } from "../../components";
import { SongList } from "../../containers";
import "./SongDetails.css";

export default function SongDetails() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchparams] = useSearchParams();
    
    const id = searchparams.get("id");
    const { playNewMusic, setAddPlaylist } = useContext(Datactx);
    const { infos } = useSelector(state => state.musics);
    const { similar } = useSelector(state => state.recommendations);

    function playSimilarClicked() {
        const similarIds = [];
        similar.forEach(song => similarIds.push(song._id));
        playNewMusic({ ids: similarIds });
    }

    useEffect(() => { // check that we have an id in the req params
        if (!id) navigate("/");
        else dispatch(getMusic(id));
    }, [dispatch, navigate, id ]);

    useEffect(() => { // check that we find some infos
        if (infos === false) {
            dispatch(reset());
            navigate("/");
        }
    }, [infos, dispatch, navigate])
    
    useEffect(() => { // when we get the infos get the similar musics
        if (infos && infos.artist) dispatch(getSimilar({artist: infos.artist}));
    }, [dispatch, infos ])

    if (!infos) return (
        <section className="music-details">
            <h1 className="h1">There is nothing here!</h1>
            <h2 className="h2">But is should</h2>
            <p>Wait a few second to load the music!</p>
        </section>
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
                    <button className="btn" onClick={(e) => {setAddPlaylist({ids: [id], e})}}><FontAwesomeIcon icon={faPlus} /> Add to playlist</button>
                    <ShareBtn />
                </article>
            </section>
            <section className="music-similar">
                <div>
                    <h2 className="h1">
                        Featuring {infos.artist}
                    </h2>
                    <PlayCta clickAction={playSimilarClicked}/>
                </div>
                <SongList musics={similar} />
            </section>
            <Loader />
        </>
    )
}
