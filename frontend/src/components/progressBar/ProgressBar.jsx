import { useContext, useEffect, useState } from "react";
import Datactx from "../../context/DataContext";
import { Slider } from "../";
import "./ProgressBar.css";

export default function ProgressBar({ isTimeShow }) {
    const { music:{audio, duration, progress} } = useContext(Datactx);
    const [durationStr, setDurationStr] = useState("-:--");
    const [progressStr, setProgressStr] = useState("-:--");

    useEffect(() => {
        if (isTimeShow) { // only update if shown
            if (duration && progress) { // check if both duration and progress are available
                // parse to string
                const durationMinute = Math.floor(duration/60);
                const durationSecond = Math.round(duration - durationMinute*60);
    
                const progressMinute = Math.floor(progress/60);
                const progressSecond = Math.round(progress - progressMinute*60);
                // set state
                setDurationStr(`${durationMinute}:${(durationSecond < 10 ? "0" + durationSecond : durationSecond)}`);
                setProgressStr(`${progressMinute}:${(progressSecond < 10 ? "0" + progressSecond : progressSecond)}`);
            } else {
                setDurationStr("-:--");
                setProgressStr("-:--");
            }
        }
    }, [duration, progress, isTimeShow]);

    function updateProgress(e) { // handle user input (update the audio)
        const value = parseInt(e.target.value);
        if (audio) audio.currentTime = value;
    }

    return (
        isTimeShow 
        ?
            <div className="full-bar">
                <p className="h3">{progressStr}</p>
                <Slider value={progress} max={duration} update={updateProgress} />
                <p className="h3">{durationStr}</p>
            </div>
        :
        <Slider value={progress} max={duration} update={updateProgress} />
    )
}
