import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Datactx from "../../context/DataContext";
import "./MusicsControls.css";

export default function MusicsControls() {
    const { music:{isPlaying}, setMusic } = useContext(Datactx);
    function updateMusic() {
        setMusic(prevState => ({
            ...prevState,
            isPlaying: !isPlaying
        }));
    }
    return (
        <div className="musics-controls">
            <button className="btn"><FontAwesomeIcon icon="fa-solid fa-backward-step" /></button>
            <button onClick={updateMusic} className="btn play"><FontAwesomeIcon icon={isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play"} /></button>
            <button className="btn"><FontAwesomeIcon icon="fa-solid fa-forward-step" /></button>
        </div>
    )
}
