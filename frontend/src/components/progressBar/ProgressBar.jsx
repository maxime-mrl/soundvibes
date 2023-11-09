import { useState } from "react";
import "./ProgressBar.css";
import { Slider } from "../";

export default function ProgressBar({ isTimeShow }) {
    const [progress, setProgress] = useState(70);
    return (
        isTimeShow 
        ?
            <div className="full-bar">
                <p className="h3">-:--</p>
                <Slider value={progress} setValue={setProgress} />
                <p className="h3">-:--</p>
            </div>
        :
        <Slider value={progress} setValue={setProgress} />
        
    )
}
