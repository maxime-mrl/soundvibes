import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Datactx from "../../context/DataContext";
import "./PlayerOptions.css";

export default function PlayerOptions({ isExtended }) {
    const { music:{id}, setAddPlaylist } = useContext(Datactx);
    return (
        <div className={isExtended ? "player-options extended" : "player-options"}>
            <button className="btn" onClick={(e) => {setAddPlaylist({ids: [id], e})}}>
                <FontAwesomeIcon icon="fa-solid fa-plus" />{isExtended && <i>Add</i> }
                </button>
            <button className="btn"><FontAwesomeIcon icon="fa-solid fa-repeat" /></button>
            <button className="btn"><FontAwesomeIcon icon="fa-solid fa-shuffle" /></button>
        </div>
    )
}
