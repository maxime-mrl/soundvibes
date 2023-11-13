import { useState } from "react";
import { CoverImage, MusicControls, PlayerOptions, ProgressBar, VolumeControl } from "../../components";

export default function PlayerMobile() {
    const [extended, setExtended] = useState(true)
    return (
        !extended 
        ?
        <div className="player-mobile reduced">
            <CoverImage />
            <div className="text">
                <h2 className="h2">Never gonna Give you up</h2>
                <h3 className="h3">rick astley</h3>
            </div>
            <ProgressBar isTimeShow={false} />
        </div>
        :
        <div className="player-mobile extended">
            <div className="infos">
                <CoverImage />
                <h2 className="h2">Never gonna Give you up</h2>
                <h3 className="h3">rick astley</h3>
            </div>
            <MusicControls />
            <div className="options">
                <PlayerOptions />
                <VolumeControl />
            </div>
            <ProgressBar isTimeShow={false} />
        </div>
    )
}
