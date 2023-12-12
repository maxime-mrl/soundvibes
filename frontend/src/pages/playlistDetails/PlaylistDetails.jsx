import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deletePlaylist, getPlaylist, reset, updatePlaylist } from "../../features/playlists/playlistsSlice";
import Datactx from "../../context/DataContext";
import { ConfirmPopup, Loader, PlayCta, PlaylistCover, ShareBtn, TextInput } from "../../components";
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


    const hideEditTitle = () => { if (editPopup.current) editPopup.current.classList.add("hidden") }

    function ctaClick() {
        const ids = [];
        playlist.content.forEach(music => ids.push(music._id));
        playNewMusic({ids});
    }

    function showEditTitle() {
        if (!editPopup.current) return;
        setEditionTitle(playlist.name);
        editPopup.current.classList.remove("hidden");
    }

    function submitTitle(e) {
        e.preventDefault();
        // parse the id to create formdata
        const contentIds = [];
        playlist.content.forEach(music => contentIds.push(music._id));
        const data = {
            id: playlist._id,
            name: editionTitle,
            musics: contentIds,
        }
        // submit
        dispatch(updatePlaylist(data));
        hideEditTitle();
    }

    function showDeletePopup() {
        const confirm = document.querySelector(".confirm-popup");
        if (!confirm) return;
        confirm.classList.add("shown");
    }

    function deleteSong({ _id:id }) {
        if (!id) return;
        // parse the new id array
        const contentIds = [];
        playlist.content.forEach(music => {if (id !== music._id) contentIds.push(music._id)});
        // form data for update then send request
        const data = {
            id: playlist._id,
            name: playlist.name,
            musics: contentIds,
        }
        dispatch(updatePlaylist(data));
    }
    
    useEffect(() => {
        if (!id) navigate("/");
        else dispatch(getPlaylist(id))
    }, [dispatch, navigate, id ]);

    useEffect(() => {
        if (playlist === false) {
            dispatch(reset());
            navigate("/playlists");
        }
    }, [playlist, dispatch, navigate])

    if (!playlist) return (
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
                    <ShareBtn />
                    {playlist.owner._id === user._id &&
                        <button onClick={showDeletePopup} className="btn-cta btn-fail delete">
                            <FontAwesomeIcon icon="fa-solid fa-trash" /> Delete
                        </button>
                    }
                </article>
                <article className="playlist-song-list">
                    <SongList musics={playlist.content} actions={playlist.owner._id === user._id && "both"} actionHandler={playlist.content.length > 1 ? deleteSong : showDeletePopup} />
                </article>
            </section>
            
            {playlist.owner._id === user._id &&
            <>
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
                <ConfirmPopup text={`to delete playlist ${playlist.name}`} confirm={() => dispatch(deletePlaylist(playlist._id))} cancel={() => {}} />
            </>
            }
            <Loader />
        </>
    )
}
