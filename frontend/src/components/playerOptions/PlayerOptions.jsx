import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Datactx from "../../context/DataContext";
import "./PlayerOptions.css";

export default function PlayerOptions({ isExtended }) {
    const { music:{id, mode}, updateMusic, setAddPlaylist } = useContext(Datactx);
    function modeUpdate(newMode) {
        if (mode === newMode) updateMusic({ mode: false }); // if click again on one actived, desactivate special option
        else updateMusic({ mode: newMode }); // else apply options
    }

    return (
        <div className={isExtended ? "player-options extended" : "player-options"}>
            <button className="btn" onClick={(e) => {setAddPlaylist({ids: [id], e})}}>
                <FontAwesomeIcon icon="fa-solid fa-plus" />{isExtended && <i>Add</i> }
            </button>
            <button className={mode === "loop" ? "btn active-mode" : "btn"} onClick={() => {modeUpdate("loop")}}>
                <FontAwesomeIcon icon="fa-solid fa-repeat" />
            </button>
            <button className={mode === "shuffle" ? "btn active-mode" : "btn"} onClick={() => {modeUpdate("shuffle")}}>
                <FontAwesomeIcon icon="fa-solid fa-shuffle" />
            </button>
        </div>
    )
}
