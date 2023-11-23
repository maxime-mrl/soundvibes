import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./PlayerOptions.css";

export default function PlayerOptions({ isExtended }) {
    return (
        <div className={isExtended ? "player-options extended" : "player-options"}>
            <button className="btn"><FontAwesomeIcon icon="fa-solid fa-plus" />{isExtended && <i>Add</i> }</button>
            <button className="btn"><FontAwesomeIcon icon="fa-solid fa-repeat" /></button>
            <button className="btn"><FontAwesomeIcon icon="fa-solid fa-shuffle" /></button>
        </div>
    )
}
