import { useContext, useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import Datactx from "../../context/DataContext";
import { CoverImage, MusicControls, PlayerOptions, ProgressBar } from "../../components";

export default function PlayerMobile() {
    const { music:{title, artist}, music } = useContext(Datactx);
    const [extended, setExtended] = useState(false);
    const { ref } = useSwipeable({ onSwipedDown: () => setExtended(false) });

    function toggleplayer(e) {
        let elem = e.target;
        while (!(elem instanceof HTMLBodyElement)) {
            if (!elem || !elem.parentNode) break;
            if (elem.className && /player/.test(elem.className)) return setExtended(true);
            elem = elem.parentNode;
        }
        setExtended(false);
    }

    useEffect(() => {
        // music.volume = 100; // don't know if this should be
        document.body.addEventListener("click", toggleplayer);
        return () => { document.body.removeEventListener("click", toggleplayer) }
    }, [])

    useEffect(() => {
      if (extended) ref(document);
      else ref({});
      return () => ref({});
    }, [extended, ref]);

    return (
        <div className={!extended ? "player-mobile reduced" : "player-mobile extended"}>
            <div className="infos">
                <CoverImage music={music} />
                <div className="text">
                    <h2 className="h2">{title}</h2>
                    <h3 className="h3">{artist}</h3>
                </div>
            </div>
            <MusicControls />
            <div className="options">
                <PlayerOptions isExtended={true} />
            </div>
            <ProgressBar isTimeShow={false} />
        </div>
    )
}
