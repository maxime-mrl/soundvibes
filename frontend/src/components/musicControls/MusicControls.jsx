import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./MusicsControls.css";

export default function MusicsControls() {
    return (
        <div className="musics-controls">
            <button className="btn"><FontAwesomeIcon icon="fa-solid fa-backward-step" /></button>
            <button className="btn play"><FontAwesomeIcon icon="fa-solid fa-play" /></button>
            <button className="btn"><FontAwesomeIcon icon="fa-solid fa-forward-step" /></button>
        </div>
    )
}
