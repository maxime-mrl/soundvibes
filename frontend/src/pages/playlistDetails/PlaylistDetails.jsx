import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getPlaylist, updatePlaylist } from "../../features/playlists/playlistsSlice";
import Datactx from "../../context/DataContext";
import { Loader, PlayCta, PlaylistCover, TextInput } from "../../components";
import { SongList } from "../../containers";
import "./PlaylistDetails.css";

export default function PlaylistDetails() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchparams] = useSearchParams();
    const { playlist } = useSelector(state => state.playlists);
    const { user } = useSelector(state => state.auth);
    const { playNewMusic } = useContext(Datactx);
    const [editionTitle, setEditionTitle] = useState("");
    const editPopup = useRef();
    
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
    function showEditTitle() {
        if (!editPopup.current) return;
        setEditionTitle(playlist.name);
        editPopup.current.classList.remove("hidden");
    }
    function hideEditTitle() {
        if (!editPopup.current) return;
        editPopup.current.classList.add("hidden");
    }

    function submitTitle(e) {
        const contentIds = []
        playlist.content.forEach(music => contentIds.push(music._id));
        e.preventDefault();
        const data = {
            id: playlist._id,
            name: editionTitle,
            musics: contentIds,
        }
        dispatch(updatePlaylist(data));
        hideEditTitle()
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
                        <h1>
                            {playlist.name}
                            {playlist.owner._id === user._id &&
                                <button onClick={showEditTitle} className="playlist-name-edit btn">
                                    <FontAwesomeIcon icon="fa-solid fa-pencil" />
                                </button>
                            }
                        </h1>
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
            
            {playlist.owner._id === user._id &&
                <div className="edit-title-modal hidden" ref={editPopup} onMouseDown={(e) => {if (e.target === editPopup.current) hideEditTitle()}}>
                    <form className="edit-title-form" onSubmit={submitTitle}>
                        <h2 className="h2">Edit title</h2>
                        <button className="close-btn btn" type="button">
                            <FontAwesomeIcon icon="fa-solid fa-xmark" onClick={hideEditTitle} />
                        </button>
                        <TextInput 
                            label={{
                                regular: "Your new title",
                                error: "Invalid title. Please use only letter, number, - and white space"
                            }}
                            input={{
                                name: "playlist-title",
                                placeholder: "title",
                            }}
                            validation={"^[-a-z0-9\\s]+$"}
                            valueState={editionTitle}
                            updateForm={(e) => setEditionTitle(e.target.value)}
                        />
                        <button className="btn-cta">Update</button>
                    </form>
                </div>
            }
            <Loader />
        </>
    )
}
