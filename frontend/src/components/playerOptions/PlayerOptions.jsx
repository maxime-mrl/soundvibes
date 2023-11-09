import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./PlayerOptions.css";

export default function PlayerOptions() {
    return (
        <div className="player-options">
            <button className="btn"><FontAwesomeIcon icon="fa-solid fa-repeat" /></button>
            <button className="btn"><FontAwesomeIcon icon="fa-solid fa-shuffle" /></button>
            <button className="btn"><FontAwesomeIcon icon="fa-solid fa-plus" /></button>
        </div>
    )
}
