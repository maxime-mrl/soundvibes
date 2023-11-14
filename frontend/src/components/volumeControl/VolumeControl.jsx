import { useContext, useState } from "react";
import "./VolumeControl.css";
import Slider from "../musicSlider/MusicSlider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Datactx from "../../context/DataContext";

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
