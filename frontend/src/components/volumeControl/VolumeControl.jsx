import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import Datactx from "../../context/DataContext";
import { Slider } from "../";
import "./VolumeControl.css";

export default function VolumeControl() {
    const { music:{volume}, updateMusic } = useContext(Datactx);
    
    return (
        <div className="volume-control">
            <FontAwesomeIcon icon={faVolumeHigh} />
            <Slider value={volume} update={(e) => updateMusic({ volume: e.target.value })} />
        </div>
    )
}
