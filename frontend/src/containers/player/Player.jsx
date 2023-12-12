import { useContext } from "react";
import Datactx from "../../context/DataContext";

import PlayerMobile from "./Player-mobile";
import PlayerPC from "./Player-pc";
import "./Player.css";
// import { MusicCircle } from "../../components";

export default function Player() {
    const { isMobile } = useContext(Datactx);
    return (
        <>
            <audio className="audio-player">
                <source type="audio/mpeg"/>
            </audio>
            {/* <MusicCircle /> */}
            { isMobile
            ?
                <PlayerMobile />
            :
                <PlayerPC />
            }
        </>
    )
}
