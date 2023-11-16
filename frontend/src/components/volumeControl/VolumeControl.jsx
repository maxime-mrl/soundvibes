import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Datactx from "../../context/DataContext";
import { Slider } from "../";
import "./VolumeControl.css";

export default function VolumeControl() {
    const { music:{volume}, setMusic } = useContext(Datactx);
    function updateMusic(e) {
        setMusic(prevState => ({
            ...prevState,
            volume: e.target.value
        }));
    }
    return (
        <div className="volume-control">
            <FontAwesomeIcon icon="fa-solid fa-volume-high" />
            <Slider value={volume} update={updateMusic} />
        </div>
    )
}
