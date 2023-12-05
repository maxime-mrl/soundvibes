import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfirmPopup, CoverImage, Loader, SearchBar } from "../../components";
import { deleteSong } from "../../features/musics/musicsSlice";
import "./DeleteMusic.css";
import SongList from "../songList/SongList";

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
                    <SongList musics={musics} actions={"delete"} actionHandler={showConfirm} />
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
