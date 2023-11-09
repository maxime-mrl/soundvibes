import { MusicControls, PlayerOptions, ProgressBar, VolumeControl } from "../../components";

export default function PlayerPC() {
    return (
        <div className="player-pc">
            <PlayerOptions />
            <div className="center">
                <MusicControls />
                <ProgressBar isTimeShow={true} />
            </div>
            <VolumeControl />
        </div>
    )
}
