import { useCallback, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSwipeable } from "react-swipeable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { getOwn, newPlaylist, updatePlaylist } from "../../features/playlistsSlice";
import Datactx from "../../context/DataContext";
import { PlaylistCover } from "../../components";
import "./AddPlaylist.css";

export default function AddPlaylist() {
    const dispatch = useDispatch() 
    const playlistModal = useRef();
    const { playlists } = useSelector(state => state.playlists)
    const { addPlaylist, setAddPlaylist, windowSize } = useContext(Datactx);
    const { ref } = useSwipeable({ onSwipedDown: () => setAddPlaylist(false) });

    const toggleplayer = useCallback(e => {
        let elem = e.target;
        while (!(elem instanceof HTMLBodyElement)) {
            if (!elem || !elem.parentNode) break;
            if (elem.className && /add-playlist-modal/.test(elem.className)) return;
            elem = elem.parentNode;
        }
        setAddPlaylist(false);
    }, [setAddPlaylist])

    function createPlaylist() {
        const data = {
            name: "New playlist",
            musics: addPlaylist.ids
        }
        dispatch(newPlaylist(data));
        setAddPlaylist(false);
    }
    
    function addToPlaylist(playlist) {
        const contentIds = [];
        playlist.content.forEach(music => contentIds.push(music._id));
        addPlaylist.ids.forEach(id => contentIds.push(id));
        const updatedPlaylist = {
            name: playlist.name,
            musics: contentIds,
            id: playlist._id,
        };
        dispatch(updatePlaylist(updatedPlaylist));
        setAddPlaylist(false);
    }

    useEffect(() => {
        if (addPlaylist) showModal();
        else hideModal();
        return () => { hideModal() }
        
        function showModal() {
            const modal = playlistModal.current;
            // set position (for pc)
            const { clientX, clientY } = addPlaylist.e;
            let position = "";
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
    }, [addPlaylist, ref, toggleplayer, windowSize.height, windowSize.width]);

    useEffect(() => {
        if (!playlists || !playlists[0]) dispatch(getOwn())
    // eslint-disable-next-line
    }, [])

    return (
        <div className="add-playlist-modal" ref={playlistModal}>
            <button className="close-btn btn">
                <FontAwesomeIcon icon={faXmark} onClick={() => setAddPlaylist(false)} />
            </button>
            <h2 className="h2">Add to librairie</h2>
            <div className="playlists-list">
                {playlists &&
                playlists.map(playlist => (
                    <button key={playlist._id} onClick={() => addToPlaylist(playlist)} className="add btn">
                        <PlaylistCover playlist={playlist} />
                        <p>{playlist.name}</p>
                    </button>
                ))
                }
                <button onClick={createPlaylist} className="add btn">
                    <div className="playlist-img">
                        <img src="/img/new-playlist.png" alt="Plus icon" />
                    </div>
                    <p>New playlist</p>
                </button>
            </div>
        </div>
    )
}
