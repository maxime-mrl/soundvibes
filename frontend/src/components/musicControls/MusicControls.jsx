import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Datactx from "../../context/DataContext";
import "./MusicsControls.css";

export default function MusicsControls() {
    const { music:{isPlaying}, updateMusic, previousSong } = useContext(Datactx);
    return (
        <div className="musics-controls">
            <button className="btn" onClick={() => {updateMusic({ prevLoading: true })}}>
                <FontAwesomeIcon icon="fa-solid fa-backward-step" />
            </button>
            <button onClick={() => {updateMusic({ isPlaying: !isPlaying })}} className="btn play">
                <FontAwesomeIcon icon={isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play"} />
            </button>
            <button className="btn" onClick={() => {updateMusic({ nextLoading: true })}}>
                <FontAwesomeIcon icon="fa-solid fa-forward-step" />
            </button>
        </div>
    )
}
