import { useState } from "react";
import "./VolumeControl.css";
import Slider from "../slider/Slider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function VolumeControl() {
    const [volume, setVolume] = useState(50)
    return (
        <div className="volume-control">
            <FontAwesomeIcon icon="fa-solid fa-volume-high" />
            <Slider value={volume} setValue={setVolume} />
        </div>
    )
}
