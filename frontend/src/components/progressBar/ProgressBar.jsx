import { useContext, useEffect, useState } from "react";
import "./ProgressBar.css";
import { MusicSlider } from "../";
import Datactx from "../../context/DataContext";

export default function ProgressBar({ isTimeShow }) {
    const { music, setMusic } = useContext(Datactx);
    const [durationStr, setDurationStr] = useState("-:--");
    const [progressStr, setProgressStr] = useState("-:--");
    useEffect(() => {
        if (music.duration) {
            const duration = music.duration;
            let durationMinute = Math.floor(duration/60);
            let durationSecond = Math.round(duration - durationMinute*60);
            setDurationStr(`${durationMinute}:${(durationSecond < 10 ? "0" + durationSecond : durationSecond)}`);
        }
        if (music.audio) {
            const progress = music.audio.currentTime;
            let progressMinute = Math.floor(progress/60);
            let progressSecond = Math.round(progress - progressMinute*60);
            setProgressStr(`${progressMinute}:${(progressSecond < 10 ? "0" + progressSecond : progressSecond)}`);
        }
    }, [music]);

    function updateProgress(e) {
        const value = parseInt(e.target.value)
        if (music.audio) {
            const audio = music.audio;
            audio.currentTime = value;
            setMusic(prevState => ({
                ...prevState,
                audio, 
                progress: e.target.value
            }));
        }
    }

    return (
        isTimeShow 
        ?
            <div className="full-bar">
                <p className="h3">{progressStr}</p>
                <MusicSlider value={music.audio ? music.audio.currentTime : 0} max={music.duration} update={updateProgress} />
                <p className="h3">{durationStr}</p>
            </div>
        :
        <MusicSlider value={music.audio ? music.audio.currentTime : 0} max={music.duration} update={updateProgress} />
        
    )
}
