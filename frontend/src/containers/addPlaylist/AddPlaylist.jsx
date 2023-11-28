import { useContext, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSwipeable } from "react-swipeable";
import Datactx from "../../context/DataContext";
import "./AddPlaylist.css";

export default function AddPlaylist() {
    const { addPlaylist, setAddPlaylist, windowSize } = useContext(Datactx);
    const playlistModal = useRef();
    const { ref } = useSwipeable({ onSwipedDown: () => setAddPlaylist(false) });

    function toggleplayer(e) {
        let elem = e.target;
        while (!(elem instanceof HTMLBodyElement)) {
            if (!elem || !elem.parentNode) break;
            if (elem.className && /add-playlist-modal/.test(elem.className)) return;
            elem = elem.parentNode;
        }
        setAddPlaylist(false);
    }

    function createPlaylist(e) {
        console.log(e.clientX)
    }

    function showModal() {
        const modal = playlistModal.current;
        // set position (for pc)
        const { clientX, clientY } = addPlaylist.e;
        let position = "";
        console.log(addPlaylist.e.clientX);
        if (clientX > windowSize.width / 2) position += `--right: ${windowSize.width - clientX}px; `;
        else position += `--left: ${clientX}px; `;
        if (clientY > windowSize.height / 2) position += `--bottom: ${windowSize.height - clientY}px; `;
        else position += `--top: ${clientY}px; `;
        // display
        modal.classList.add("shown");
        modal.style = position;
        document.body.addEventListener("mousedown", toggleplayer);
        
        ref(document);
    }

    function hideModal() {
        const modal = playlistModal.current;
        if (!modal) return;
        modal.classList.remove("shown");
        document.body.removeEventListener("mousedown", toggleplayer);
        ref({});
    }

    useEffect(() => {
        if (addPlaylist) showModal();
        else hideModal();
        return hideModal
    }, [addPlaylist])

    return (
        <div className="add-playlist-modal" ref={playlistModal}>
            <button className="close-btn btn">
                <FontAwesomeIcon icon="fa-solid fa-xmark" onClick={() => setAddPlaylist(false)} />
            </button>
            <h2 className="h2">Add to librairie</h2>
            <div className="options">
                <button onClick={createPlaylist} className="add btn">
                    <img src="/img/new-playlist.png" alt="Plus icon" />
                    <p>New playlist</p>
                </button>
            </div>
        </div>
    )
}
