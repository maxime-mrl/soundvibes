import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackwardStep, faForwardStep, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import Datactx from "../../context/DataContext";
import "./MusicControls.css";

export default function MusicsControls() {
    const { music:{isPlaying}, updateMusic } = useContext(Datactx);
    
    return (
        <div className="musics-controls">
            <button className="btn" onClick={() => {updateMusic({ prevLoading: true })}} aria-label="Previous track">
                <FontAwesomeIcon icon={faBackwardStep} />
            </button>
            <button onClick={() => {updateMusic({ isPlaying: !isPlaying })}} className="btn play" aria-label={(isPlaying ? "Pause current music" : "Play current music")}>
                <FontAwesomeIcon icon={(isPlaying ? faPause : faPlay)} />
            </button>
            <button className="btn" onClick={() => {updateMusic({ nextLoading: true })}} aria-label="Next track">
                <FontAwesomeIcon icon={faForwardStep} />
            </button>
        </div>
    )
}
