import { useContext, useEffect, useState } from "react";
import { CoverImage, MusicControls, PlayerOptions, ProgressBar, VolumeControl } from "../../components";
// import { useSwipeable } from "react-swipeable"
import Datactx from "../../context/DataContext";

export default function PlayerMobile() {
    const { music:{title, artist}, music } = useContext(Datactx);
    const [extended, setExtended] = useState(false);
    // const handlers = useSwipeable({
    //     onSwiped: (eventData) => console.log("User Swiped!", eventData)
    // });

    function openPlayer(e) {
        if (e.target instanceof HTMLInputElement) return;
        setExtended(true)
    }

    useEffect(() => {
        document.body.addEventListener("click", (e) => {
            // if (!extended) return;
            let elem = e.target
            while (!(elem instanceof HTMLBodyElement)) {
                if (!elem) break;
                if (elem.className && elem.className === "player-mobile extended") return;
                if (!elem.parentNode) break;
                elem = elem.parentNode
            }
            setExtended(false)
        })
        return () => {
            document.body.removeEventListener("click", () => {});
        }
    }, [])
    return (
        !extended 
        ?
        <div className="player-mobile reduced" onClick={openPlayer}>
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
