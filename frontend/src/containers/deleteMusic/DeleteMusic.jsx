import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CoverImage, Loader, SearchBar } from "../../components";
import { deleteSong } from "../../features/musics/musicsSlice";
import "./DeleteMusic.css";

export default function DeleteMusic() {
    const { musics } = useSelector(state => state.musics);
    const dispatch = useDispatch();
    const [deleteTarget, setDeleteTarget] = useState("");

    function showConfirm(music) {
        setDeleteTarget(music._id);
        const confirm = document.querySelector(".confirm-popup");
        confirm.classList.add("shown");
        confirm.querySelector("i").textContent = music.title;
    }

    function handleDelete() {
        dispatch(deleteSong(deleteTarget));
        setDeleteTarget("");
        document.querySelector(".confirm-popup").classList.remove("shown");
    }
    function handleCancel() {
        setDeleteTarget("");
        document.querySelector(".confirm-popup").classList.remove("shown");
    }

    return (
        <>
            <div className="confirm-popup">
                <div className="popup">
                    <p className="h2">Are you sure to delete music "<i></i>" ?</p>
                    <button className="btn-cta btn-fail" onClick={handleDelete}>Delete</button>
                    <button className="btn-cta" onClick={handleCancel}>Cancel</button>
                </div>
            </div>
            <section className="delete-music">
                <h2 className="h2">Delete a music:</h2>
                <SearchBar />
                {musics && musics.length > 0
                ? 
                    (!musics[0]._id 
                    ?
                    <>
                        <h2 className="h2">No musics found with this query</h2>
                        <p>Check the spelling or try something else...</p>
                    </>
                    :
                    (musics.map(music => (
                        <div key={music._id} className="song">
                            <div className="details">
                                <CoverImage music={music} />
                                <div className="text">
                                    <h2>{music.title}</h2>
                                    <h3 className="h3">{music.artist}</h3>
                                </div>
                            </div>
                            <FontAwesomeIcon onClick={() => showConfirm(music)} className="delete-btn btn" icon={"fa-solid fa-trash"} />
                        </div>
                    )))
                    )
                :
                <>
                    <Loader />
                    <h2 className="h2">Search something</h2>
                </>
                }
            </section>
        </>
    )
}
