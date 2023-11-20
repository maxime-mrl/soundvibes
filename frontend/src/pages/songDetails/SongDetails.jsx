import { useNavigate, useSearchParams } from "react-router-dom";
import "./SongDetails.css";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMusic } from "../../features/musics/musicsSlice";
import { toast } from "react-toastify";
import { CoverImage, PlayCta } from "../../components";
import Datactx from "../../context/DataContext";

export default function SongDetails() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchparams] = useSearchParams();
    const id = searchparams.get("id");
    const { setMusic, resetMusic } = useContext(Datactx)
    const { infos, isError, isLoading, message } = useSelector(state => state.musics)

    useEffect(() => {
        if (!id) {
            navigate("/");
        }
        if (isError) toast.error(message);
        else dispatch(getMusic(id));
    }, [dispatch, isError, message, id, navigate]);

    function playClicked() {
        resetMusic()
        setMusic(prevState => ({
            ...prevState,
            id,
            title: infos.title,
            artist: infos.artist,
            autoPlay: true
        }))
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
            <CoverImage music={ {_id: id, ...infos} } />
            <h1 className="h1">{infos.title}</h1>
            <h2 className="h2">{infos.artist}</h2>
            <p>{infos.year}</p>
            <PlayCta clickAction={playClicked}/>
        <pre>
            {infos.title}
            {infos.id}
            {infos.artist}
            {infos.year}
        </pre>
        </>
    )
}
