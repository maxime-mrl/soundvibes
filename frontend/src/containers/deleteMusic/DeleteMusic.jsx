import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfirmPopup, CoverImage, Loader, SearchBar } from "../../components";
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
    }
    function handleCancel() {
        setDeleteTarget("");
    }

    return (
        <>
            <ConfirmPopup text={`to delete music`} confirm={handleDelete} cancel={handleCancel} customText={true} />
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
