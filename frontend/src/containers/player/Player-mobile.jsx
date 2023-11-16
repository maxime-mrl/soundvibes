import { useContext, useState } from "react";
import { CoverImage, MusicControls, PlayerOptions, ProgressBar, VolumeControl } from "../../components";
import Datactx from "../../context/DataContext";

export default function PlayerMobile() {
    const { music:{title, artist}, music } = useContext(Datactx);
    const [extended, setExtended] = useState(false)
    return (
        !extended 
        ?
        <div className="player-mobile reduced">
            <CoverImage music={music} />
            <div className="text">
                <h2 className="h2">{title}</h2>
                <h3 className="h3">{artist}</h3>
            </div>
            <ProgressBar isTimeShow={false} />
        </div>
        :
        <div className="player-mobile extended">
            <div className="infos">
            <CoverImage music={music} />
                <h2 className="h2">{title}</h2>
                <h3 className="h3">{artist}</h3>
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
